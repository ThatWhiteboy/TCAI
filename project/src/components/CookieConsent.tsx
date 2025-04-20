import React, { useState, useEffect } from 'react';
import { X, Check, Settings } from 'lucide-react';

interface CookiePreferences {
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
  functional: boolean;
}

function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    essential: true, // Essential cookies cannot be disabled
    analytics: true,
    marketing: false,
    functional: true
  });

  useEffect(() => {
    // Check if user has already made cookie choices
    const cookieChoices = localStorage.getItem('cookiePreferences');
    if (!cookieChoices) {
      setShowBanner(true);
    } else {
      setPreferences(JSON.parse(cookieChoices));
    }
  }, []);

  const handleAcceptAll = () => {
    const allEnabled = {
      essential: true,
      analytics: true,
      marketing: true,
      functional: true
    };
    setPreferences(allEnabled);
    localStorage.setItem('cookiePreferences', JSON.stringify(allEnabled));
    setShowBanner(false);
  };

  const handleSavePreferences = () => {
    localStorage.setItem('cookiePreferences', JSON.stringify(preferences));
    setShowBanner(false);
    setShowPreferences(false);
  };

  const handleTogglePreference = (key: keyof CookiePreferences) => {
    if (key === 'essential') return; // Essential cookies cannot be toggled
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  if (!showBanner && !showPreferences) return null;

  if (showPreferences) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-slate-900 rounded-xl p-6 max-w-lg w-full mx-4 border border-white/10">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white">Cookie Preferences</h2>
            <button
              onClick={() => setShowPreferences(false)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4 mb-6">
            <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
              <div>
                <h3 className="font-medium text-white">Essential Cookies</h3>
                <p className="text-sm text-gray-400">Required for the website to function</p>
              </div>
              <div className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded text-sm">Required</div>
            </div>

            {(Object.keys(preferences) as Array<keyof CookiePreferences>)
              .filter(key => key !== 'essential')
              .map(key => (
                <div key={key} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <div>
                    <h3 className="font-medium text-white capitalize">{key} Cookies</h3>
                    <p className="text-sm text-gray-400">
                      {key === 'analytics' && 'Help us understand how visitors use our website'}
                      {key === 'marketing' && 'Help us provide relevant advertisements'}
                      {key === 'functional' && 'Enable enhanced website functionality'}
                    </p>
                  </div>
                  <button
                    onClick={() => handleTogglePreference(key)}
                    className={`w-12 h-6 rounded-full transition-colors ${
                      preferences[key] ? 'bg-blue-500' : 'bg-gray-600'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full bg-white transition-transform ${
                        preferences[key] ? 'translate-x-7' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              ))}
          </div>

          <div className="flex justify-end gap-4">
            <button
              onClick={handleSavePreferences}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              Save Preferences
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-lg border-t border-white/10 p-4 z-50">
      <div className="container mx-auto max-w-4xl flex flex-col md:flex-row items-center gap-4 justify-between">
        <div className="text-white text-sm">
          We use cookies to enhance your experience. By continuing to visit this site you agree to our use of cookies.
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowPreferences(true)}
            className="px-4 py-2 text-gray-300 hover:text-white transition-colors flex items-center gap-2"
          >
            <Settings className="w-4 h-4" />
            Preferences
          </button>
          <button
            onClick={handleAcceptAll}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
          >
            <Check className="w-4 h-4" />
            Accept All
          </button>
        </div>
      </div>
    </div>
  );
}

export default CookieConsent;