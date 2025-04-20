import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import LandingPage from './pages/LandingPage';
import OnboardingPage from './pages/OnboardingPage';
import DashboardPage from './pages/DashboardPage';
import BillingPage from './pages/BillingPage';
import SupportPage from './pages/SupportPage';
import AnalyticsPage from './pages/AnalyticsPage';
import TermsOfService from './pages/legal/TermsOfService';
import PrivacyPolicy from './pages/legal/PrivacyPolicy';
import CookiePolicy from './pages/legal/CookiePolicy';
import LegalFooter from './components/LegalFooter';
import CookieConsent from './components/CookieConsent';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex flex-col min-h-screen">
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/onboarding" element={<OnboardingPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/billing" element={<BillingPage />} />
            <Route path="/support" element={<SupportPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/legal/terms" element={<TermsOfService />} />
            <Route path="/legal/privacy" element={<PrivacyPolicy />} />
            <Route path="/legal/cookies" element={<CookiePolicy />} />
          </Routes>
        </main>
        <LegalFooter />
        <CookieConsent />
      </div>
    </QueryClientProvider>
  );
}

export default App;