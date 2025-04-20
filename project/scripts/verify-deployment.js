import https from 'https';
import { promisify } from 'util';
import dns from 'dns';

const dnsResolve = promisify(dns.resolve);

async function verifyDeployment() {
  try {
    // Verify DNS configuration
    const records = await dnsResolve('titancloudai.com', 'A');
    console.log('DNS records verified:', records);

    // Verify SSL certificate
    const options = {
      hostname: 'titancloudai.com',
      port: 443,
      method: 'GET',
      rejectUnauthorized: true
    };

    await new Promise((resolve, reject) => {
      const req = https.request(options, (res) => {
        console.log('SSL certificate verified');
        console.log('TLS version:', res.socket.getProtocol());
        resolve();
      });

      req.on('error', reject);
      req.end();
    });

    // Verify critical pages
    const criticalPages = ['/', '/dashboard', '/analytics'];
    for (const page of criticalPages) {
      const response = await fetch(`https://titancloudai.com${page}`);
      if (!response.ok) {
        throw new Error(`Failed to load ${page}`);
      }
      console.log(`Verified page: ${page}`);
    }

    console.log('Deployment verification completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Deployment verification failed:', error);
    process.exit(1);
  }
}

verifyDeployment();