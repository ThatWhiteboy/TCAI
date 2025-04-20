import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

function TermsOfService() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <Link to="/" className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 mb-8">
          <ArrowLeft className="w-5 h-5" />
          Back to Home
        </Link>

        <h1 className="text-3xl font-bold mb-8">Terms of Service</h1>

        <div className="prose prose-invert max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-300 mb-4">
              By accessing and using Titan Cloud AI's services ("Services"), you agree to be bound by these Terms of Service
              ("Terms"). If you disagree with any part of these terms, you may not access the Services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. Description of Services</h2>
            <p className="text-gray-300 mb-4">
              Titan Cloud AI provides artificial intelligence and machine learning services, including but not limited to:
            </p>
            <ul className="list-disc pl-6 text-gray-300 mb-4">
              <li>Machine Learning and Predictive Analytics</li>
              <li>Natural Language Processing</li>
              <li>Computer Vision Solutions</li>
              <li>Automated Decision Making Systems</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. User Obligations</h2>
            <p className="text-gray-300 mb-4">
              Users of the Services agree to:
            </p>
            <ul className="list-disc pl-6 text-gray-300 mb-4">
              <li>Provide accurate and complete information</li>
              <li>Maintain the security of their account credentials</li>
              <li>Comply with all applicable laws and regulations</li>
              <li>Use the Services in accordance with these Terms</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. Intellectual Property</h2>
            <p className="text-gray-300 mb-4">
              All rights, title, and interest in and to the Services (excluding content provided by users) are and will remain
              the exclusive property of Titan Cloud AI. The Services are protected by copyright, trademark, and other laws.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. Data Usage and Privacy</h2>
            <p className="text-gray-300 mb-4">
              Our use of your data is governed by our Privacy Policy. By using the Services, you agree to our collection
              and use of information in accordance with our Privacy Policy.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. Service Level Agreement</h2>
            <p className="text-gray-300 mb-4">
              We strive to maintain a 99.9% uptime for our Services. Specific service levels and compensation for
              service interruptions are detailed in your subscription agreement.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">7. Limitation of Liability</h2>
            <p className="text-gray-300 mb-4">
              Titan Cloud AI shall not be liable for any indirect, incidental, special, consequential, or punitive
              damages resulting from your use or inability to use the Services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">8. Modifications to Services</h2>
            <p className="text-gray-300 mb-4">
              We reserve the right to modify or discontinue the Services at any time. We will provide notice of any
              substantial changes to the Services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">9. Termination</h2>
            <p className="text-gray-300 mb-4">
              We may terminate or suspend your access to the Services immediately, without prior notice, for conduct
              that we believe violates these Terms or is harmful to other users of the Services, us, or third parties,
              or for any other reason.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">10. Governing Law</h2>
            <p className="text-gray-300 mb-4">
              These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in which
              Titan Cloud AI is established, without regard to its conflict of law provisions.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">11. Contact Information</h2>
            <p className="text-gray-300 mb-4">
              For any questions about these Terms, please contact us at legal@titancloudai.com.
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

export default TermsOfService;