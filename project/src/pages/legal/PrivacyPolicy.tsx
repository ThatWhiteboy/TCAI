import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <Link to="/" className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 mb-8">
          <ArrowLeft className="w-5 h-5" />
          Back to Home
        </Link>

        <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>

        <div className="prose prose-invert max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
            <p className="text-gray-300 mb-4">
              This Privacy Policy explains how Titan Cloud AI ("we", "us", "our") collects, uses, and protects your
              personal information when you use our services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. Information We Collect</h2>
            <h3 className="text-xl font-semibold mb-3">2.1 Personal Information</h3>
            <p className="text-gray-300 mb-4">We collect information that you provide directly to us, including:</p>
            <ul className="list-disc pl-6 text-gray-300 mb-4">
              <li>Name and contact information</li>
              <li>Account credentials</li>
              <li>Billing information</li>
              <li>Company information</li>
              <li>Usage preferences</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3">2.2 Automatically Collected Information</h3>
            <p className="text-gray-300 mb-4">We automatically collect certain information when you use our services:</p>
            <ul className="list-disc pl-6 text-gray-300 mb-4">
              <li>Device and browser information</li>
              <li>IP address and location data</li>
              <li>Usage statistics and patterns</li>
              <li>Performance metrics</li>
              <li>Error logs and debugging information</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. How We Use Your Information</h2>
            <p className="text-gray-300 mb-4">We use the collected information for:</p>
            <ul className="list-disc pl-6 text-gray-300 mb-4">
              <li>Providing and improving our services</li>
              <li>Processing payments and maintaining accounts</li>
              <li>Personalizing user experience</li>
              <li>Analyzing service performance and usage patterns</li>
              <li>Communicating with users about service updates</li>
              <li>Ensuring security and preventing fraud</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. Data Storage and Security</h2>
            <p className="text-gray-300 mb-4">
              We implement industry-standard security measures to protect your data:
            </p>
            <ul className="list-disc pl-6 text-gray-300 mb-4">
              <li>Encryption of data in transit and at rest</li>
              <li>Regular security audits and penetration testing</li>
              <li>Access controls and authentication mechanisms</li>
              <li>Secure data centers with physical security measures</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. Data Sharing and Disclosure</h2>
            <p className="text-gray-300 mb-4">
              We may share your information with:
            </p>
            <ul className="list-disc pl-6 text-gray-300 mb-4">
              <li>Service providers and business partners</li>
              <li>Legal authorities when required by law</li>
              <li>Third parties with your explicit consent</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. Your Rights and Choices</h2>
            <p className="text-gray-300 mb-4">
              You have the right to:
            </p>
            <ul className="list-disc pl-6 text-gray-300 mb-4">
              <li>Access your personal information</li>
              <li>Correct inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Opt-out of marketing communications</li>
              <li>Export your data</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">7. Cookies and Tracking</h2>
            <p className="text-gray-300 mb-4">
              We use cookies and similar tracking technologies to:
            </p>
            <ul className="list-disc pl-6 text-gray-300 mb-4">
              <li>Maintain user sessions</li>
              <li>Remember user preferences</li>
              <li>Analyze service usage</li>
              <li>Improve user experience</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">8. International Data Transfers</h2>
            <p className="text-gray-300 mb-4">
              We may transfer your data internationally. When we do, we ensure appropriate safeguards are in place
              and comply with applicable data protection laws.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">9. Changes to This Policy</h2>
            <p className="text-gray-300 mb-4">
              We may update this Privacy Policy periodically. We will notify you of any material changes and obtain
              consent where required by law.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">10. Contact Us</h2>
            <p className="text-gray-300 mb-4">
              For privacy-related inquiries, please contact our Data Protection Officer at privacy@titancloudai.com.
            </p>
          </section>

          <div className="text-sm text-gray-400 mt-12">
            Last updated: {new Date().toLocaleDateString()}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PrivacyPolicy;