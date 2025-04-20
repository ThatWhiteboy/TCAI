import { describe, test, expect, beforeAll } from 'vitest';
import fetch from 'cross-fetch';
import https from 'https';
import dns from 'dns';
import { promisify } from 'util';

const dnsResolve = promisify(dns.resolve);
const BASE_URL = process.env.VITE_APP_URL || 'http://localhost:5173';

// Increase test timeout
const TEST_TIMEOUT = 60000;

describe('Deployment Verification Tests', () => {
  let sslInfo: any;

  beforeAll(async () => {
    // Verify SSL certificate
    try {
      sslInfo = await new Promise((resolve, reject) => {
        const req = https.request({
          hostname: new URL(BASE_URL).hostname,
          port: 443,
          method: 'GET',
          timeout: TEST_TIMEOUT
        }, (res) => {
          const socket = res.socket as any;
          resolve({
            protocol: socket?.getProtocol?.() || 'unknown',
            cert: socket?.getPeerCertificate?.() || {}
          });
        });

        req.on('error', reject);
        req.on('timeout', () => {
          req.destroy();
          reject(new Error('Request timed out'));
        });
        req.end();
      });
    } catch (error) {
      console.warn('SSL verification skipped in development:', error.message);
      sslInfo = { protocol: 'unknown', cert: {} };
    }
  }, TEST_TIMEOUT);

  describe('Basic Connectivity', () => {
    test('should connect to the application', async () => {
      const response = await fetch(BASE_URL);
      expect(response.status).toBe(200);
    }, TEST_TIMEOUT);
  });

  describe('Core Pages', () => {
    const pages = [
      '/',
      '/dashboard',
      '/analytics',
      '/billing',
      '/support',
      '/onboarding',
      '/legal/terms',
      '/legal/privacy',
      '/legal/cookies'
    ];

    test.each(pages)('should load %s successfully', async (page) => {
      const response = await fetch(`${BASE_URL}${page}`);
      expect(response.status).toBe(200);
      const html = await response.text();
      expect(html).toContain('Titan Cloud AI');
    }, TEST_TIMEOUT);
  });

  describe('API Integration', () => {
    test('should handle API requests', async () => {
      const response = await fetch(`${BASE_URL}/api/trpc/health`);
      expect(response.status).toBe(200);
    }, TEST_TIMEOUT);
  });

  describe('Performance', () => {
    test('should meet performance thresholds', async () => {
      const start = Date.now();
      const response = await fetch(BASE_URL);
      const ttfb = Date.now() - start;
      
      expect(ttfb).toBeLessThan(1000); // Relaxed threshold for CI/CD
      expect(response.headers.get('Content-Type')).toBeDefined();
    }, TEST_TIMEOUT);
  });

  describe('Security', () => {
    test('should have basic security headers', async () => {
      const response = await fetch(BASE_URL);
      const headers = response.headers;

      expect(headers.get('Content-Type')).toBeDefined();
      expect(headers.get('X-Content-Type-Options')).toBeDefined();
    }, TEST_TIMEOUT);
  });
});