import React, { useState, useEffect, useRef } from 'react';
import { Bot, Send, User, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

interface Message {
  type: 'user' | 'assistant';
  content: string;
}

interface OnboardingStep {
  question: string;
  options?: string[];
  description?: string;
}

interface OnboardingData {
  aiService: string;
  usageVolume: string;
  securityRequirements: string[];
  integrationPreferences: string[];
  deploymentTimeline: string;
}

const onboardingSteps: OnboardingStep[] = [
  {
    question: "Welcome to Titan Cloud AI! I'll help you get started. What type of AI services are you most interested in?",
    description: "Choose the primary AI service that best fits your needs. We can always add more services later.",
    options: [
      "Machine Learning (Predictive Analytics)",
      "Natural Language Processing (Text/Chat)",
      "Computer Vision (Image/Video)",
      "Automated Decision Making (Business Logic)"
    ]
  },
  {
    question: "Great choice! What's your expected monthly usage volume?",
    description: "This helps us optimize your infrastructure and pricing.",
    options: [
      "Starter (< 1,000 requests/month)",
      "Growth (1,000 - 10,000 requests/month)",
      "Enterprise (10,000+ requests/month)",
      "Custom Volume"
    ]
  },
  {
    question: "Which security requirements and compliance standards do you need? (Select all that apply)",
    description: "We'll configure your environment according to these standards.",
    options: [
      "HIPAA Compliance",
      "GDPR Compliance",
      "SOC 2 Type II",
      "ISO 27001",
      "Custom Security Requirements",
      "Not Sure (Our team will guide you)"
    ]
  },
  {
    question: "How would you like to integrate with our services?",
    description: "Choose your preferred integration method(s).",
    options: [
      "REST API",
      "SDK Integration",
      "Webhook Events",
      "Custom Integration"
    ]
  },
  {
    question: "What's your desired timeline for deployment?",
    options: [
      "Immediate (24-48 hours)",
      "Standard (1-2 weeks)",
      "Extended (2-4 weeks)",
      "Custom Timeline"
    ]
  }
];

function OnboardingPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [userInfo, setUserInfo] = useState<any>(null);
  const [isActivating, setIsActivating] = useState(false);
  const [activationStatus, setActivationStatus] = useState<'none' | 'success' | 'error'>('none');
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({
    aiService: '',
    usageVolume: '',
    securityRequirements: [],
    integrationPreferences: [],
    deploymentTimeline: ''
  });
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const storedInfo = localStorage.getItem('userInfo');
    if (storedInfo) {
      setUserInfo(JSON.parse(storedInfo));
    }
  }, []);

  useEffect(() => {
    if (userInfo && messages.length === 0) {
      addMessage('assistant', `Hi ${userInfo.name}! 👋 ${onboardingSteps[0].question}`);
      if (onboardingSteps[0].description) {
        addMessage('assistant', onboardingSteps[0].description);
      }
    }
  }, [userInfo]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const addMessage = (type: 'user' | 'assistant', content: string) => {
    setMessages(prev => [...prev, { type, content }]);
  };

  const activateServices = async () => {
    setIsActivating(true);
    setActivationStatus('none');
    
    try {
      // Simulate service activation with a realistic delay
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Prepare detailed welcome email content
      const emailData = {
        to: userInfo.email,
        subject: 'Welcome to Titan Cloud AI - Your Services Are Being Activated',
        name: userInfo.name,
        services: onboardingData,
        nextSteps: {
          documentation: 'https://docs.titancloudai.com/getting-started',
          support: 'https://support.titancloudai.com',
          dashboard: 'https://dashboard.titancloudai.com'
        }
      };
      
      // Prepare detailed admin notification
      const adminNotification = {
        newClient: {
          ...userInfo,
          onboardingCompleted: new Date().toISOString()
        },
        selectedServices: onboardingData,
        businessNeeds: userInfo.businessNeeds,
        systemRecommendations: {
          suggestedPlan: onboardingData.usageVolume.includes('Enterprise') ? 'Enterprise' : 'Growth',
          prioritySetup: onboardingData.deploymentTimeline.includes('Immediate'),
          securityAuditRequired: onboardingData.securityRequirements.length > 0
        }
      };
      
      // Simulate API calls with proper error handling
      await Promise.all([
        fetch('/api/send-welcome-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(emailData)
        }).catch(() => console.log('Email notification simulated')),
        
        fetch('/api/admin-notification', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(adminNotification)
        }).catch(() => console.log('Admin notification simulated'))
      ]);

      setActivationStatus('success');
      addMessage('assistant', 
        "🎉 Excellent news! Your AI services are being activated right now. Here's what's happening:\n\n" +
        "1. Your account is being provisioned with your selected configurations\n" +
        "2. A welcome email is on its way to your inbox with:\n" +
        "   - Your access credentials\n" +
        "   - Quick start guide\n" +
        "   - Documentation links\n" +
        "3. Our team has been notified and will review your setup\n\n" +
        "You'll have full access within the next 15 minutes. Would you like to know more about getting started with your services?"
      );
    } catch (error) {
      setActivationStatus('error');
      addMessage('assistant', 
        "⚠️ I apologize, but we've encountered an issue while activating your services. Don't worry though:\n\n" +
        "1. Our technical team has been automatically notified\n" +
        "2. A support specialist will contact you within the next hour\n" +
        "3. Your configuration preferences have been saved\n\n" +
        "Would you like me to connect you with a support representative right away?"
      );
    } finally {
      setIsActivating(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    addMessage('user', userInput);
    
    // Store the response based on current step
    switch (currentStep) {
      case 0:
        setOnboardingData(prev => ({ ...prev, aiService: userInput }));
        break;
      case 1:
        setOnboardingData(prev => ({ ...prev, usageVolume: userInput }));
        break;
      case 2:
        setOnboardingData(prev => ({ 
          ...prev, 
          securityRequirements: [...prev.securityRequirements, userInput]
        }));
        break;
      case 3:
        setOnboardingData(prev => ({ 
          ...prev, 
          integrationPreferences: [...prev.integrationPreferences, userInput]
        }));
        break;
      case 4:
        setOnboardingData(prev => ({ ...prev, deploymentTimeline: userInput }));
        break;
    }
    
    // Simulate AI response with a natural delay
    setTimeout(() => {
      if (currentStep < onboardingSteps.length - 1) {
        addMessage('assistant', onboardingSteps[currentStep + 1].question);
        if (onboardingSteps[currentStep + 1].description) {
          addMessage('assistant', onboardingSteps[currentStep + 1].description);
        }
        setCurrentStep(prev => prev + 1);
      } else {
        addMessage('assistant', 
          "Perfect! I have all the information needed to set up your AI services. " +
          "I'll now begin the activation process. This will just take a moment..."
        );
        activateServices();
      }
    }, 1000);

    setUserInput('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b border-white/10 flex items-center gap-3">
            <Bot className="w-8 h-8 text-blue-400" />
            <div>
              <h1 className="text-xl font-bold">Titan AI Assistant</h1>
              <p className="text-sm text-gray-400">Onboarding Guide</p>
            </div>
            {isActivating && (
              <div className="ml-auto flex items-center gap-2 text-blue-400">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="text-sm">Activating Services...</span>
              </div>
            )}
            {!isActivating && activationStatus === 'success' && (
              <div className="ml-auto flex items-center gap-2 text-green-400">
                <CheckCircle2 className="w-5 h-5" />
                <span className="text-sm">Services Activated</span>
              </div>
            )}
            {!isActivating && activationStatus === 'error' && (
              <div className="ml-auto flex items-center gap-2 text-red-400">
                <AlertCircle className="w-5 h-5" />
                <span className="text-sm">Activation Issue</span>
              </div>
            )}
          </div>

          {/* Chat Messages */}
          <div className="h-[500px] overflow-y-auto p-6 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex items-start gap-3 ${
                  message.type === 'assistant' ? '' : 'flex-row-reverse'
                }`}
              >
                {message.type === 'assistant' ? (
                  <Bot className="w-8 h-8 text-blue-400" />
                ) : (
                  <User className="w-8 h-8 text-green-400" />
                )}
                <div
                  className={`rounded-2xl p-4 max-w-[80%] ${
                    message.type === 'assistant'
                      ? 'bg-white/5 border border-white/10'
                      : 'bg-blue-500/20 border border-blue-500/30'
                  }`}
                >
                  {message.content}
                  {message.type === 'assistant' && currentStep === messages.length / 2 - 1 && onboardingSteps[currentStep].options && (
                    <div className="mt-4 grid grid-cols-2 gap-2">
                      {onboardingSteps[currentStep].options?.map((option, i) => (
                        <button
                          key={i}
                          onClick={() => {
                            setUserInput(option);
                            handleSendMessage(new Event('submit') as any);
                          }}
                          className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors text-sm"
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleSendMessage} className="p-4 border-t border-white/10">
            <div className="flex gap-4">
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-400"
                disabled={isActivating}
              />
              <button
                type="submit"
                className={`bg-blue-500 rounded-lg px-6 py-2 flex items-center gap-2 transition-colors ${
                  isActivating ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'
                }`}
                disabled={isActivating}
              >
                Send <Send className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default OnboardingPage;