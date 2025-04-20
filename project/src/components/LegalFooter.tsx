import React from 'react';
import { Link } from 'react-router-dom';

function LegalFooter() {
  return (
    <footer className="bg-slate-900/50 backdrop-blur-lg border-t border-white/10 py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm text-gray-400">
            © {new Date().getFullYear()} Titan Cloud AI. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <Link to="/legal/terms" className="text-sm text-gray-400 hover:text-white transition-colors">
              Terms of Service
            </Link>
            <Link to="/legal/privacy" className="text-sm text-gray-400 hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link to="/legal/cookies" className="text-sm text-gray-400 hover:text-white transition-colors">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default LegalFooter;