import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { trpc } from '../lib/trpc';
import { STRIPE_PLANS, type BillingInterval, type PlanTier, getStripe, formatPrice } from '../lib/stripe';
import {
  CreditCard,
  Check,
  X,
  Loader2,
  AlertCircle,
  Clock,
  Shield,
  Zap,
  CheckCircle
} from 'lucide-react';

function BillingPage() {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState<PlanTier | null>(null);
  const [billingInterval, setBillingInterval] = useState<BillingInterval>('monthly');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createSubscription = trpc.createSubscription.useMutation({
    onSuccess: async ({ sessionId }) => {
      try {
        const stripe = await getStripe();
        if (!stripe) {
          throw new Error('Failed to load payment system');
        }
        
        // Redirect to Stripe Checkout
        const { error } = await stripe.redirectToCheckout({ sessionId });
        if (error) {
          throw error;
        }
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    },
    onError: (error) => {
      setError(error.message);
      setLoading(false);
    }
  });

  const handleSubscribe = async (plan: PlanTier) => {
    setLoading(true);
    setError(null);
    setSelectedPlan(plan);

    try {
      const planConfig = STRIPE_PLANS[plan];
      const priceId = `${planConfig.id}_${billingInterval}`;

      await createSubscription.mutateAsync({
        planId: priceId
      });
    } catch (err) {
      setError('Failed to initiate subscription. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Choose Your Plan</h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Select the plan that best fits your needs. All plans include our core AI services
            and can be upgraded or downgraded at any time.
          </p>

          {/* Billing Interval Toggle */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={() => setBillingInterval('monthly')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                billingInterval === 'monthly'
                  ? 'bg-blue-500 text-white'
                  : 'bg-white/10 text-gray-400'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingInterval('yearly')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                billingInterval === 'yearly'
                  ? 'bg-blue-500 text-white'
                  : 'bg-white/10 text-gray-400'
              }`}
            >
              Yearly (Save 20%)
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {(Object.keys(STRIPE_PLANS) as PlanTier[]).map((planTier) => {
            const plan = STRIPE_PLANS[planTier];
            const price = billingInterval === 'monthly' 
              ? plan.monthlyPrice 
              : plan.yearlyPrice;

            return (
              <div
                key={plan.id}
                className={`relative bg-white/10 backdrop-blur-lg rounded-2xl p-8 border ${
                  selectedPlan === planTier
                    ? 'border-blue-400 shadow-lg shadow-blue-500/20'
                    : 'border-white/20'
                }`}
              >
                {planTier === 'GROWTH' && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                      MOST POPULAR
                    </span>
                  </div>
                )}

                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <div className="flex items-baseline mb-6">
                  <span className="text-4xl font-bold">${price}</span>
                  <span className="text-gray-400 ml-2">/{billingInterval === 'monthly' ? 'mo' : 'yr'}</span>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <Check className="w-5 h-5 text-green-400" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleSubscribe(planTier)}
                  disabled={loading}
                  className={`w-full py-3 px-6 rounded-lg font-medium flex items-center justify-center gap-2 transition-all ${
                    loading
                      ? 'bg-gray-600 cursor-not-allowed'
                      : 'bg-blue-500 hover:bg-blue-600'
                  }`}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-5 h-5" />
                      Subscribe Now
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>

        {/* Features Grid */}
        <div className="mt-16 max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold mb-8 text-center">All Plans Include</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white/5 rounded-xl p-6">
              <Shield className="w-8 h-8 text-blue-400 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Enterprise Security</h3>
              <p className="text-gray-400">
                Bank-grade encryption and security measures to protect your data
              </p>
            </div>
            <div className="bg-white/5 rounded-xl p-6">
              <Clock className="w-8 h-8 text-blue-400 mb-4" />
              <h3 className="text-xl font-semibold mb-2">99.9% Uptime</h3>
              <p className="text-gray-400">
                Guaranteed availability with enterprise-grade infrastructure
              </p>
            </div>
            <div className="bg-white/5 rounded-xl p-6">
              <Zap className="w-8 h-8 text-blue-400 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Real-time Processing</h3>
              <p className="text-gray-400">
                Lightning-fast AI processing with minimal latency
              </p>
            </div>
          </div>
        </div>

        {error && (
          <div className="fixed bottom-4 right-4 bg-red-500/20 text-red-400 p-4 rounded-lg flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            <span>{error}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default BillingPage