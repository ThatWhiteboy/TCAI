import { analyticsService } from '../analytics';

export class StripeValidator {
  private static readonly REQUIRED_ENV_VARS = [
    'VITE_STRIPE_PUBLIC_KEY',
    'STRIPE_SECRET_KEY',
    'STRIPE_WEBHOOK_SECRET'
  ];

  public static async validateConfiguration(): Promise<{ valid: boolean; errors: string[] }> {
    const errors: string[] = [];

    // Check environment variables
    this.REQUIRED_ENV_VARS.forEach(envVar => {
      const value = envVar.startsWith('VITE_') 
        ? import.meta.env[envVar]
        : process.env[envVar];

      if (!value) {
        errors.push(`Missing required environment variable: ${envVar}`);
      } else if (!this.isValidKey(envVar, value)) {
        errors.push(`Invalid format for ${envVar}`);
      }
    });

    // Track validation result
    await analyticsService.trackEvent('stripe_config_validation', {
      valid: errors.length === 0,
      errorCount: errors.length,
      timestamp: Date.now()
    });

    return {
      valid: errors.length === 0,
      errors
    };
  }

  private static isValidKey(varName: string, value: string): boolean {
    switch (varName) {
      case 'VITE_STRIPE_PUBLIC_KEY':
        return value.startsWith('pk_');
      case 'STRIPE_SECRET_KEY':
        return value.startsWith('sk_');
      case 'STRIPE_WEBHOOK_SECRET':
        return value.startsWith('whsec_');
      default:
        return true;
    }
  }
}