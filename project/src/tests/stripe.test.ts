import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest';
import { StripeValidator } from '../lib/stripe/validation';
import { initializeStripe, resetStripeInstance } from '../lib/stripe/initialization';
import { StripeMonitor } from '../lib/stripe/monitoring';
import { analyticsService } from '../lib/analytics';

// Mock analytics service
vi.mock('../lib/analytics', () => ({
  analyticsService: {
    trackEvent: vi.fn()
  }
}));

describe('Stripe Integration', () => {
  beforeEach(() => {
    // Reset Stripe instance before each test
    resetStripeInstance();
    
    // Set up test environment variables
    process.env.VITE_STRIPE_PUBLIC_KEY = 'pk_test_mock';
    process.env.STRIPE_SECRET_KEY = 'sk_test_mock';
    process.env.STRIPE_WEBHOOK_SECRET = 'whsec_mock';
    
    // Clear analytics mocks
    vi.clearAllMocks();
  });

  afterEach(() => {
    resetStripeInstance();
    vi.resetAllMocks();
  });

  describe('Configuration Validation', () => {
    test('should validate required environment variables', async () => {
      const validation = await StripeValidator.validateConfiguration();
      expect(validation.valid).toBe(true);
      expect(validation.errors).toHaveLength(0);
      expect(analyticsService.trackEvent).toHaveBeenCalledWith(
        'stripe_config_validation',
        expect.any(Object)
      );
    });

    test('should detect missing environment variables', async () => {
      delete process.env.VITE_STRIPE_PUBLIC_KEY;
      const validation = await StripeValidator.validateConfiguration();
      expect(validation.valid).toBe(false);
      expect(validation.errors).toContain('Missing required environment variable: VITE_STRIPE_PUBLIC_KEY');
    });

    test('should validate key formats', async () => {
      process.env.VITE_STRIPE_PUBLIC_KEY = 'invalid_key';
      const validation = await StripeValidator.validateConfiguration();
      expect(validation.valid).toBe(false);
      expect(validation.errors).toContain('Invalid format for VITE_STRIPE_PUBLIC_KEY');
    });
  });

  describe('Stripe Initialization', () => {
    test('should initialize Stripe successfully', async () => {
      const stripe = await initializeStripe();
      expect(stripe).toBeDefined();
      expect(analyticsService.trackEvent).toHaveBeenCalledWith(
        'stripe_initialized',
        expect.any(Object)
      );
    });

    test('should handle initialization failures', async () => {
      process.env.VITE_STRIPE_PUBLIC_KEY = 'invalid_key';
      await expect(initializeStripe()).rejects.toThrow();
      expect(analyticsService.trackEvent).toHaveBeenCalledWith(
        'stripe_initialization_error',
        expect.any(Object)
      );
    });

    test('should retry failed initializations', async () => {
      let attempts = 0;
      global.loadStripe = async () => {
        attempts++;
        if (attempts < 2) throw new Error('Temporary failure');
        return {};
      };

      const stripe = await initializeStripe();
      expect(stripe).toBeDefined();
      expect(attempts).toBe(2);
      expect(analyticsService.trackEvent).toHaveBeenCalledTimes(2);
    });
  });

  describe('Stripe Monitoring', () => {
    test('should monitor Stripe health', async () => {
      await StripeMonitor.monitorStripeHealth();
      expect(analyticsService.trackEvent).toHaveBeenCalledWith(
        'stripe_health_check',
        expect.any(Object)
      );
    });

    test('should detect performance issues', async () => {
      vi.useFakeTimers();
      const startTime = Date.now();
      
      // Simulate slow initialization
      vi.advanceTimersByTime(3000);
      
      await StripeMonitor.monitorStripeHealth();
      expect(analyticsService.trackEvent).toHaveBeenCalledWith(
        'stripe_performance_issue',
        expect.any(Object)
      );
      
      vi.useRealTimers();
    });

    test('should handle monitoring errors', async () => {
      // Force an error
      vi.spyOn(global, 'loadStripe').mockRejectedValue(new Error('Monitoring error'));
      
      await StripeMonitor.monitorStripeHealth();
      expect(analyticsService.trackEvent).toHaveBeenCalledWith(
        'stripe_monitoring_error',
        expect.any(Object)
      );
    });
  });
});