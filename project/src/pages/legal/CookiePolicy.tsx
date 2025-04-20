import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

function CookiePolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <Link to="/" className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 mb-8">
          <ArrowLeft className="w-5 h-5" />
          Back to Home
        </Link>

        <h1 className="text-3xl font-bold mb-8">Cookie Policy</h1>

        <div className="prose prose-invert max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
            <p className="text-gray-300 mb-4">
              This Cookie Policy explains how Titan Cloud AI uses cookies and similar technologies to recognize you
              when you visit our website and use our services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. What Are Cookies</h2>
            <p className="text-gray-300 mb-4">
              Cookies are small data files placed on your device when you visit a website. They serve various
              purposes and can be either temporary (session cookies) or persistent.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. Types of Cookies We Use</h2>
            
            <h3 className="text-xl font-semibold mb-3">3.1 Essential Cookies</h3>
            <p className="text-gray-300 mb-4">
              Required for the operation of our website and services:
            </p>
            <ul className="list-disc pl-6 text-gray-300 mb-4">
              <li>Authentication and security</li>
              <li>Session management</li>
              <li>Load balancing</li>
              <li>Remember user preferences</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3">3.2 Analytics Cookies</h3>
            <p className="text-gray-300 mb-4">
              Help us understand how visitors interact with our website:
            </p>
            <ul className="list-disc pl-6 text-gray-300 mb-4">
              <li>Page views and navigation</li>
              <li>Time spent on pages</li>
              <li>Error encounters</li>
              <li>User behavior patterns</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3">3.3 Functionality Cookies</h3>
            <p className="text-gray-300 mb-4">
              Enable enhanced functionality and personalization:
            </p>
            <ul className="list-disc pl-6 text-gray-300 mb-4">
              <li>Remember user preferences</li>
              <li>Language settings</li>
              <li>Custom configurations</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3">3.4 Performance Cookies</h3>
            <p className="text-gray-300 mb-4">
              Help us improve website performance:
            </p>
            <ul className="list-disc pl-6 text-gray-300 mb-4">
              <li>Load times</li>
              <li>Server response</li>
              <li>Error tracking</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. Cookie Management</h2>
            <p className="text-gray-300 mb-4">
              You can control cookies through your browser settings:
            </p>
            <ul className="list-disc pl-6 text-gray-300 mb-4">
              <li>Block all cookies</li>
              <li>Delete existing cookies</li>
              <li>Allow only essential cookies</li>
              <li>Set cookie preferences per website</li>
            </ul>
            <p className="text-gray-300 mb-4">
              Note: Blocking certain cookies may impact the functionality of our services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. Third-Party Cookies</h2>
            <p className="text-gray-300 mb-4">
              We may use third-party services that set their own cookies:
            </p>
            <ul className="list-disc pl-6 text-gray-300 mb-4">
              <li>Analytics providers</li>
              <li>Payment processors</li>
              <li>Social media integrations</li>
              <li>Security services</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. Updates to This Policy</h2>
            <p className="text-gray-300 mb-4">
              We may update this Cookie Policy periodically. We will notify you of any material changes through
              our website or other communication channels.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">7. Contact Us</h2>
            <p className="text-gray-300 mb-4">
              If you have questions about our use of cookies, please contact us at privacy@titancloudai.com.
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

export default CookiePolicy;