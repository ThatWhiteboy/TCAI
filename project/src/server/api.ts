import { initTRPC } from '@trpc/server';
import { z } from 'zod';
import Stripe from 'stripe';
import { STRIPE_PLANS } from '../lib/stripe';
import { emailService } from './services/emailService';
import { analyticsService } from './services/analyticsService';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
});

const t = initTRPC.create();

// Validation schemas
const createSubscriptionSchema = z.object({
  planId: z.string(),
  customerId: z.string().optional(),
});

export const appRouter = t.router({
  createSubscription: t.procedure
    .input(createSubscriptionSchema)
    .mutation(async ({ input }) => {
      try {
        // Create or retrieve customer
        let customerId = input.customerId;
        if (!customerId) {
          const customer = await stripe.customers.create({
            metadata: {
              planId: input.planId
            }
          });
          customerId = customer.id;
        }

        // Create checkout session
        const session = await stripe.checkout.sessions.create({
          customer: customerId,
          mode: 'subscription',
          payment_method_types: ['card'],
          line_items: [
            {
              price: input.planId,
              quantity: 1,
            },
          ],
          subscription_data: {
            trial_period_days: 14,
            metadata: {
              planId: input.planId
            }
          },
          success_url: `${process.env.VITE_APP_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${process.env.VITE_APP_URL}/billing`,
          automatic_tax: { enabled: true },
          customer_update: {
            address: 'auto',
            name: 'auto',
          },
        });

        return { sessionId: session.url || session.id };
      } catch (error) {
        console.error('Stripe session creation error:', error);
        throw new Error('Failed to create subscription session');
      }
    }),

  getSubscriptionStatus: t.procedure
    .input(z.object({ 
      sessionId: z.string(),
      customerId: z.string().optional() 
    }))
    .query(async ({ input }) => {
      try {
        const session = await stripe.checkout.sessions.retrieve(input.sessionId);
        
        if (input.customerId) {
          const subscriptions = await stripe.subscriptions.list({
            customer: input.customerId,
            limit: 1,
          });

          return {
            status: session.status,
            subscription: subscriptions.data[0] || null,
          };
        }

        return { status: session.status };
      } catch (error) {
        console.error('Error retrieving subscription status:', error);
        throw new Error('Failed to get subscription status');
      }
    }),

  getInvoices: t.procedure
    .input(z.object({ customerId: z.string() }))
    .query(async ({ input }) => {
      try {
        const invoices = await stripe.invoices.list({
          customer: input.customerId,
          limit: 24, // Last 24 invoices
        });

        return {
          invoices: invoices.data.map(invoice => ({
            id: invoice.id,
            number: invoice.number,
            amount: invoice.amount_due,
            status: invoice.status,
            dueDate: invoice.due_date,
            pdfUrl: invoice.invoice_pdf,
            hostedUrl: invoice.hosted_invoice_url,
          })),
        };
      } catch (error) {
        console.error('Error retrieving invoices:', error);
        throw new Error('Failed to retrieve invoices');
      }
    }),

  getFinancialReport: t.procedure
    .input(z.object({ 
      customerId: z.string(),
      startDate: z.string(),
      endDate: z.string(),
    }))
    .query(async ({ input }) => {
      try {
        const [invoices, charges, credits] = await Promise.all([
          stripe.invoices.list({
            customer: input.customerId,
            created: {
              gte: new Date(input.startDate).getTime() / 1000,
              lte: new Date(input.endDate).getTime() / 1000,
            },
          }),
          stripe.charges.list({
            customer: input.customerId,
            created: {
              gte: new Date(input.startDate).getTime() / 1000,
              lte: new Date(input.endDate).getTime() / 1000,
            },
          }),
          stripe.creditNotes.list({
            customer: input.customerId,
            created: {
              gte: new Date(input.startDate).getTime() / 1000,
              lte: new Date(input.endDate).getTime() / 1000,
            },
          }),
        ]);

        return {
          totalBilled: invoices.data.reduce((sum, inv) => sum + inv.amount_due, 0),
          totalPaid: charges.data.reduce((sum, charge) => sum + (charge.amount - (charge.amount_refunded || 0)), 0),
          totalCredits: credits.data.reduce((sum, credit) => sum + credit.amount, 0),
          invoices: invoices.data,
          charges: charges.data,
          credits: credits.data,
        };
      } catch (error) {
        console.error('Error generating financial report:', error);
        throw new Error('Failed to generate financial report');
      }
    }),

  cancelSubscription: t.procedure
    .input(z.object({ subscriptionId: z.string() }))
    .mutation(async ({ input }) => {
      try {
        const subscription = await stripe.subscriptions.update(input.subscriptionId, {
          cancel_at_period_end: true,
        });

        return { success: true, subscription };
      } catch (error) {
        console.error('Error canceling subscription:', error);
        throw new Error('Failed to cancel subscription');
      }
    }),

  updateSubscription: t.procedure
    .input(z.object({ 
      subscriptionId: z.string(),
      newPriceId: z.string()
    }))
    .mutation(async ({ input }) => {
      try {
        const subscription = await stripe.subscriptions.retrieve(input.subscriptionId);
        
        // Update the subscription with the new price
        const updatedSubscription = await stripe.subscriptions.update(
          input.subscriptionId,
          {
            items: [{
              id: subscription.items.data[0].id,
              price: input.newPriceId,
            }],
            proration_behavior: 'always_invoice',
          }
        );

        return { success: true, subscription: updatedSubscription };
      } catch (error) {
        console.error('Error updating subscription:', error);
        throw new Error('Failed to update subscription');
      }
    }),

  getAnalytics: t.procedure
    .input(z.object({
      startDate: z.string(),
      endDate: z.string(),
      metrics: z.array(z.string())
    }))
    .query(async ({ input }) => {
      try {
        return await analyticsService.getMetrics(
          new Date(input.startDate),
          new Date(input.endDate),
          input.metrics
        );
      } catch (error) {
        console.error('Error fetching analytics:', error);
        throw new Error('Failed to fetch analytics data');
      }
    }),

  getOptimizationSuggestions: t.procedure
    .query(async () => {
      try {
        return await analyticsService.generateOptimizationSuggestions();
      } catch (error) {
        console.error('Error generating optimization suggestions:', error);
        throw new Error('Failed to generate optimization suggestions');
      }
    }),

  trackEvent: t.procedure
    .input(z.object({
      eventName: z.string(),
      properties: z.record(z.any()).optional()
    }))
    .mutation(async ({ input }) => {
      try {
        await analyticsService.trackEvent(input.eventName, input.properties);
        return { success: true };
      } catch (error) {
        console.error('Error tracking event:', error);
        throw new Error('Failed to track event');
      }
    })
});

export type AppRouter = typeof appRouter;