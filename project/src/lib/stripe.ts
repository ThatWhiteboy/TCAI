import { loadStripe } from '@stripe/stripe-js';

// Initialize Stripe with more graceful error handling
const initializeStripeKey = () => {
  const key = import.meta.env.VITE_STRIPE_PUBLIC_KEY;
  if (!key) {
    console.warn('Stripe public key not found - running in test mode');
    return 'pk_test_51O5KdPK5CNVmRVVGGi2mHVgxGXXEGBCnHPzrXUNfcWBXGHb6NgqkOgQJLhGBqZFPuVPxYKMBTUC5WPBXKwXOLGxq00OPwzLJNB';
  }
  return key;
};

const STRIPE_PUBLIC_KEY = initializeStripeKey();

// Stripe plan configuration
export const STRIPE_PLANS = {
  STARTER: {
    id: 'price_starter',
    name: 'Starter',
    monthlyPrice: 49,
    yearlyPrice: 470,
    features: [
      'Up to 1,000 API requests/month',
      'Basic AI Services',
      'Email Support',
      'Standard API Access',
      'Basic Analytics'
    ]
  },
  GROWTH: {
    id: 'price_growth',
    name: 'Growth',
    monthlyPrice: 199,
    yearlyPrice: 1990,
    features: [
      'Up to 10,000 API requests/month',
      'Advanced AI Services',
      'Priority Support',
      'Advanced API Access',
      'Detailed Analytics',
      'Custom Integrations'
    ]
  },
  ENTERPRISE: {
    id: 'price_enterprise',
    name: 'Enterprise',
    monthlyPrice: 999,
    yearlyPrice: 9990,
    features: [
      'Unlimited API requests',
      'Full AI Suite',
      '24/7 Support',
      'Dedicated API Gateway',
      'Advanced Analytics',
      'Custom Solutions',
      'SLA Guarantee'
    ]
  }
} as const;

export type PlanTier = keyof typeof STRIPE_PLANS;
export type BillingInterval = 'monthly' | 'yearly';

// Initialize Stripe with error handling and retry logic
let stripePromise: Promise<any> | null = null;
let retryCount = 0;
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

export const getStripe = async () => {
  if (!stripePromise) {
    const loadStripeWithRetry = async (): Promise<any> => {
      try {
        const stripe = await loadStripe(STRIPE_PUBLIC_KEY);
        if (!stripe) throw new Error('Failed to initialize Stripe');
        return stripe;
      } catch (error) {
        if (retryCount < MAX_RETRIES) {
          retryCount++;
          await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * retryCount));
          return loadStripeWithRetry();
        }
        throw error;
      }
    };

    stripePromise = loadStripeWithRetry().catch(error => {
      console.error('Failed to load Stripe:', error);
      throw new Error('Failed to initialize payment system. Please try again later.');
    });
  }
  return stripePromise;
};

// Helper function to get plan price ID
export const getPlanPriceId = (plan: PlanTier, interval: BillingInterval) => {
  const planConfig = STRIPE_PLANS[plan];
  return interval === 'monthly' ? `${planConfig.id}_monthly` : `${planConfig.id}_yearly`;
};

// Helper function to format price
export const formatPrice = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0
  }).format(amount);
};

// Helper function to calculate discounted yearly price
export const calculateYearlyPrice = (monthlyPrice: number) => {
  return monthlyPrice * 12 * 0.8; // 20% discount for yearly plans
};

// Helper function to validate Stripe configuration
export const validateStripeConfig = () => {
  if (!STRIPE_PUBLIC_KEY) {
    console.warn('Missing Stripe public key - running in test mode');
    return false;
  }
  return true;
};