import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Send,
  User,
  Search,
  HelpCircle,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface Message {
  type: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const faqs: FAQItem[] = [
  {
    category: 'Getting Started',
    question: 'How do I integrate the AI API into my application?',
    answer: 'Our API integration is straightforward. Start by obtaining your API key from the dashboard, then follow our comprehensive integration guide in the documentation. We provide SDKs for multiple programming languages.'
  },
  {
    category: 'Getting Started',
    question: 'What are the system requirements?',
    answer: 'Our services are cloud-based and require no special hardware. You just need a stable internet connection and the ability to make HTTPS requests.'
  },
  {
    category: 'Billing',
    question: 'How does usage-based billing work?',
    answer: "We count API requests on a monthly basis. You can monitor your usage in real-time from the dashboard. If you exceed your plan's limits, you'll be notified before any additional charges are applied."
  },
  {
    category: 'Security',
    question: 'How do you handle data privacy?',
    answer: 'We employ industry-standard encryption for all data in transit and at rest. Your data is processed in compliance with GDPR and other relevant regulations. We never store or use your data for training purposes without explicit consent.'
  },
  {
    category: 'Technical',
    question: 'What is the API rate limit?',
    answer: 'Rate limits vary by plan. Starter plans are limited to 10 requests per second, Growth plans to 50 requests per second, and Enterprise plans have custom limits based on needs.'
  }
];

// Mock AI responses based on keywords
const mockAIResponses: Record<string, string> = {
  'api': "To integrate our API, you'll need your API key from the dashboard. Would you like me to guide you through the integration process?",
  'billing': "Our billing is usage-based and calculated monthly. You can view your current usage and costs in real-time from the dashboard. Would you like to know more about our pricing structure?",
  'security': "We take security seriously and employ industry-standard encryption for all data. Would you like more details about our security measures?",
  'help': "I'm here to help! Could you please provide more details about what you need assistance with?",
  'error': "I understand you're experiencing an error. To better assist you, could you please provide more details about the error you're encountering?",
  'default': "I'll help you with that. Could you please provide more details about your question?"
};

function SupportPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const generateAIResponse = (input: string): string => {
    const lowercaseInput = input.toLowerCase();
    const matchingKeyword = Object.keys(mockAIResponses).find(keyword => 
      lowercaseInput.includes(keyword)
    );
    return mockAIResponses[matchingKeyword || 'default'];
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim() || isTyping) return;

    const userMessage = userInput.trim();
    setMessages(prev => [...prev, { 
      type: 'user', 
      content: userMessage,
      timestamp: Date.now()
    }]);
    setUserInput('');
    setIsTyping(true);

    // Simulate AI thinking and typing
    setTimeout(() => {
      const response = generateAIResponse(userMessage);
      setMessages(prev => [...prev, { 
        type: 'assistant', 
        content: response,
        timestamp: Date.now()
      }]);
      setIsTyping(false);
    }, Math.random() * 1000 + 500); // Random delay between 500-1500ms
  };

  const filteredFAQs = faqs.filter(
    faq =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const groupedFAQs = filteredFAQs.reduce((acc, faq) => {
    if (!acc[faq.category]) {
      acc[faq.category] = [];
    }
    acc[faq.category].push(faq);
    return acc;
  }, {} as Record<string, FAQItem[]>);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          {/* FAQ Section */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search FAQs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:border-blue-400"
                />
              </div>
            </div>

            <div className="space-y-6">
              {Object.entries(groupedFAQs).map(([category, items]) => (
                <div key={category} className="border-b border-white/10 pb-4">
                  <h3 className="text-lg font-semibold mb-3 text-blue-400">{category}</h3>
                  <div className="space-y-3">
                    {items.map((faq) => (
                      <div key={faq.question} className="rounded-lg bg-white/5">
                        <button
                          onClick={() =>
                            setExpandedFAQ(
                              expandedFAQ === faq.question ? null : faq.question
                            )
                          }
                          className="w-full text-left px-4 py-3 flex justify-between items-center"
                        >
                          <span className="flex items-center gap-2">
                            <HelpCircle className="w-5 h-5 text-blue-400" />
                            {faq.question}
                          </span>
                          {expandedFAQ === faq.question ? (
                            <ChevronUp className="w-5 h-5" />
                          ) : (
                            <ChevronDown className="w-5 h-5" />
                          )}
                        </button>
                        {expandedFAQ === faq.question && (
                          <div className="px-4 pb-3 text-gray-300">
                            {faq.answer}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Chat Support Section */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 overflow-hidden flex flex-col">
            <div className="p-4 border-b border-white/10 flex items-center gap-3">
              <Bot className="w-8 h-8 text-blue-400" />
              <div>
                <h2 className="text-xl font-bold">AI Support Assistant</h2>
                <p className="text-sm text-gray-400">24/7 Available</p>
              </div>
            </div>

            <div className="flex-1 p-4 overflow-y-auto space-y-4">
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
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex items-start gap-3">
                  <Bot className="w-8 h-8 text-blue-400" />
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                      <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                      <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            <form onSubmit={handleSendMessage} className="p-4 border-t border-white/10">
              <div className="flex gap-4">
                <input
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-400"
                  disabled={isTyping}
                />
                <button
                  type="submit"
                  disabled={isTyping}
                  className={`rounded-lg px-6 py-2 flex items-center gap-2 transition-colors ${
                    isTyping
                      ? 'bg-gray-600 cursor-not-allowed'
                      : 'bg-blue-500 hover:bg-blue-600'
                  }`}
                >
                  Send <Send className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SupportPage;