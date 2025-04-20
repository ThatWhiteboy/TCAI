import express from 'express';
import Stripe from 'stripe';
import dotenv from 'dotenv';
import { appRouter } from './api.js';
import { createExpressMiddleware } from '@trpc/server/adapters/express';
import { emailService } from './services/emailService.js';

dotenv.config();

const app = express();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});

// Middleware
app.use(express.json());

// tRPC middleware
app.use('/api/trpc', createExpressMiddleware({ router: appRouter }));

// Stripe webhook handling
app.post('/api/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];

  try {
    const event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    // Handle the event
    switch (event.type) {
      case 'invoice.created':
        const invoice = event.data.object;
        const customer = await stripe.customers.retrieve(invoice.customer);
        await emailService.sendInvoiceEmail(customer.email, invoice);
        break;

      case 'invoice.payment_failed':
        const failedInvoice = event.data.object;
        const failedCustomer = await stripe.customers.retrieve(failedInvoice.customer);
        await emailService.sendOverdueNotice(failedCustomer.email, failedInvoice);
        break;

      case 'invoice.upcoming':
        const upcomingInvoice = event.data.object;
        const upcomingCustomer = await stripe.customers.retrieve(upcomingInvoice.customer);
        await emailService.sendPaymentReminder(upcomingCustomer.email, upcomingInvoice);
        break;

      case 'customer.subscription.updated':
        const subscription = event.data.object;
        // Handle subscription updates
        console.log('Subscription updated:', subscription);
        break;

      case 'customer.subscription.deleted':
        // Handle subscription cancellation
        console.log('Subscription cancelled:', event.data.object);
        break;

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
  } catch (err) {
    console.error('Webhook Error:', err.message);
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});