import { loadStripe } from '@stripe/stripe-js';
import { StripeValidator } from './validation';
import { analyticsService } from '../analytics';

let stripeInstance: any = null;
let initializationAttempts = 0;
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

export async function initializeStripe() {
  // Validate configuration first
  const validation = await StripeValidator.validateConfiguration();
  if (!validation.valid) {
    throw new Error(`Stripe configuration invalid: ${validation.errors.join(', ')}`);
  }

  while (initializationAttempts < MAX_RETRIES) {
    try {
      if (!stripeInstance) {
        const publicKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY;
        if (!publicKey) {
          throw new Error('Stripe public key is required. Please add VITE_STRIPE_PUBLIC_KEY to your .env file.');
        }

        stripeInstance = await loadStripe(publicKey);
        if (!stripeInstance) {
          throw new Error('Failed to initialize Stripe');
        }

        // Track successful initialization
        await analyticsService.trackEvent('stripe_initialized', {
          timestamp: Date.now(),
          attempt: initializationAttempts + 1
        });
      }
      return stripeInstance;
    } catch (error) {
      initializationAttempts++;
      
      // Track initialization failure
      await analyticsService.trackEvent('stripe_initialization_error', {
        error: error.message,
        attempt: initializationAttempts,
        timestamp: Date.now()
      });

      if (initializationAttempts === MAX_RETRIES) {
        throw new Error(`Failed to initialize Stripe after ${MAX_RETRIES} attempts: ${error.message}`);
      }
      
      // Exponential backoff
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * Math.pow(2, initializationAttempts - 1)));
    }
  }
}

export function resetStripeInstance() {
  stripeInstance = null;
  initializationAttempts = 0;
}