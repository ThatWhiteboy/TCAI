import { beforeAll } from 'vitest';
import fetch from 'cross-fetch';
import dns from 'dns';
import { promisify } from 'util';
import createFetchMock from 'vitest-fetch-mock';

// Setup fetch mock
const fetchMocker = createFetchMock(vi);
fetchMocker.enableMocks();

// Setup global fetch for Node.js environment
global.fetch = fetch;

// Promisify DNS functions
global.dnsResolve = promisify(dns.resolve);

beforeAll(() => {
  // Add test environment variables
  process.env.VITE_APP_URL = 'http://localhost:5173';
  process.env.NODE_ENV = 'test';
  process.env.VITE_STRIPE_PUBLIC_KEY = 'pk_test_mock';
  process.env.STRIPE_SECRET_KEY = 'sk_test_mock';
  process.env.STRIPE_WEBHOOK_SECRET = 'whsec_mock';
  process.env.OPENAI_API_KEY = 'test-key-for-ci';
  
  // Mock analytics data
  global.analyticsData = {
    apiLatency: [{ value: 100 }],
    errorRates: [{ value: 0.01 }],
    requestVolume: [{ value: 1000 }]
  };

  // Mock Stripe
  global.loadStripe = vi.fn().mockResolvedValue({
    elements: vi.fn(),
    createPaymentMethod: vi.fn(),
    confirmCardPayment: vi.fn()
  });
});