import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Brain, Cloud, Cpu, Send, ShieldCheck } from 'lucide-react';

function LandingPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    businessNeeds: ''
  });

  useEffect(() => {
    // Handle referral from Durable site
    const referral = searchParams.get('ref');
    if (referral === 'durable') {
      // Track referral analytics
      analyticsService.trackEvent('durable_referral', {
        timestamp: Date.now()
      });
    }

    // Pre-fill form if data was passed from Durable
    const durableData = searchParams.get('data');
    if (durableData) {
      try {
        const decodedData = JSON.parse(atob(durableData));
        setFormData(prev => ({
          ...prev,
          ...decodedData
        }));
      } catch (error) {
        console.error('Failed to parse Durable data:', error);
      }
    }
  }, [searchParams]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Store form data and navigate to onboarding
    localStorage.setItem('userInfo', JSON.stringify(formData));
    navigate('/onboarding');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      {/* Hero Section */}
      <div className="relative min-h-screen flex items-center">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1639322537228-f710d846310a?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-10" />
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1 text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start gap-2 mb-6">
                <Brain className="w-10 h-10 text-blue-400" />
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  Titan Cloud AI Platform
                </span>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                Welcome to Your <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">AI Control Center</span>
              </h1>
              
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto lg:mx-0">
                Access your full suite of automated AI services. Monitor, manage, and optimize your business operations from a single dashboard.
              </p>

              <div className="flex flex-wrap gap-6 justify-center lg:justify-start mb-12">
                <div className="flex items-center gap-2 text-gray-300">
                  <ShieldCheck className="w-5 h-5 text-blue-400" />
                  <span>Enterprise Security</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <Cloud className="w-5 h-5 text-blue-400" />
                  <span>Cloud-Native</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <Cpu className="w-5 h-5 text-blue-400" />
                  <span>Advanced AI</span>
                </div>
              </div>
            </div>

            {/* Platform Access Form */}
            <div className="w-full max-w-md">
              <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-xl border border-white/20">
                <h2 className="text-2xl font-bold text-white mb-6">Access Your Platform</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                      Full Name
                    </label>
                    <input
                      id="name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20"
                      placeholder="John Doe"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                      Business Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20"
                      placeholder="john@company.com"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="businessNeeds" className="block text-sm font-medium text-gray-300 mb-2">
                      Additional Requirements
                    </label>
                    <textarea
                      id="businessNeeds"
                      value={formData.businessNeeds}
                      onChange={(e) => setFormData({...formData, businessNeeds: e.target.value})}
                      rows={4}
                      className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20"
                      placeholder="Any specific requirements or questions?"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-6 py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-all duration-300 transform hover:scale-[1.02]"
                  >
                    Access Platform <Send className="w-5 h-5" />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;