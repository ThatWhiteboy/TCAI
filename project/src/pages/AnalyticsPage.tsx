import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { format, subDays } from 'date-fns';
import {
  Activity,
  TrendingUp,
  Users,
  DollarSign,
  Zap,
  AlertTriangle,
  CheckCircle,
  Brain
} from 'lucide-react';
import { analyticsService, type OptimizationSuggestion } from '../lib/analytics';

function AnalyticsPage() {
  const [dateRange, setDateRange] = useState({
    start: subDays(new Date(), 30),
    end: new Date(),
  });
  const [performanceMetrics, setPerformanceMetrics] = useState<any>(null);
  const [salesMetrics, setSalesMetrics] = useState<any>(null);
  const [suggestions, setSuggestions] = useState<OptimizationSuggestion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [performance, sales, optimizations] = await Promise.all([
          analyticsService.getPerformanceMetrics(dateRange.start, dateRange.end),
          analyticsService.getSalesMetrics(dateRange.start, dateRange.end),
          analyticsService.getOptimizationSuggestions(),
        ]);

        setPerformanceMetrics(performance);
        setSalesMetrics(sales);
        setSuggestions(optimizations);
      } catch (error) {
        console.error('Failed to fetch analytics data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dateRange]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Activity className="w-6 h-6 text-blue-400 animate-pulse" />
          <span>Loading analytics...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Analytics & Insights</h1>
          <div className="flex items-center gap-4">
            <select
              className="bg-white/10 border border-white/20 rounded-lg px-4 py-2"
              onChange={(e) => {
                const days = parseInt(e.target.value);
                setDateRange({
                  start: subDays(new Date(), days),
                  end: new Date(),
                });
              }}
            >
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
            </select>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <div className="flex items-center gap-3 mb-4">
              <Users className="w-6 h-6 text-blue-400" />
              <span className="text-gray-400">Active Users</span>
            </div>
            <div className="text-2xl font-bold">2,547</div>
            <div className="text-sm text-green-400 mt-2 flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              +15% vs last period
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <div className="flex items-center gap-3 mb-4">
              <DollarSign className="w-6 h-6 text-green-400" />
              <span className="text-gray-400">Revenue</span>
            </div>
            <div className="text-2xl font-bold">$45,892</div>
            <div className="text-sm text-green-400 mt-2 flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              +23% vs last period
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <div className="flex items-center gap-3 mb-4">
              <Zap className="w-6 h-6 text-yellow-400" />
              <span className="text-gray-400">API Performance</span>
            </div>
            <div className="text-2xl font-bold">245ms</div>
            <div className="text-sm text-green-400 mt-2 flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              -12% latency
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle className="w-6 h-6 text-purple-400" />
              <span className="text-gray-400">Success Rate</span>
            </div>
            <div className="text-2xl font-bold">99.9%</div>
            <div className="text-sm text-green-400 mt-2 flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              +0.5% reliability
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <h2 className="text-xl font-bold mb-6">API Usage Trends</h2>
            {performanceMetrics && (
              <Line
                data={{
                  labels: performanceMetrics.requestVolume.map((m: any) => 
                    format(new Date(m.timestamp), 'MMM dd')
                  ),
                  datasets: [{
                    label: 'Requests',
                    data: performanceMetrics.requestVolume.map((m: any) => m.value),
                    borderColor: '#60A5FA',
                    tension: 0.4,
                    fill: true,
                    backgroundColor: 'rgba(96, 165, 250, 0.1)',
                  }],
                }}
                options={{
                  responsive: true,
                  scales: {
                    y: {
                      beginAtZero: true,
                      grid: { color: 'rgba(255, 255, 255, 0.1)' },
                      ticks: { color: 'rgba(255, 255, 255, 0.7)' },
                    },
                    x: {
                      grid: { color: 'rgba(255, 255, 255, 0.1)' },
                      ticks: { color: 'rgba(255, 255, 255, 0.7)' },
                    },
                  },
                  plugins: { legend: { display: false } },
                }}
              />
            )}
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <h2 className="text-xl font-bold mb-6">Revenue Growth</h2>
            {salesMetrics && (
              <Line
                data={{
                  labels: salesMetrics.revenue.map((m: any) => 
                    format(new Date(m.timestamp), 'MMM dd')
                  ),
                  datasets: [{
                    label: 'Revenue',
                    data: salesMetrics.revenue.map((m: any) => m.value),
                    borderColor: '#34D399',
                    tension: 0.4,
                    fill: true,
                    backgroundColor: 'rgba(52, 211, 153, 0.1)',
                  }],
                }}
                options={{
                  responsive: true,
                  scales: {
                    y: {
                      beginAtZero: true,
                      grid: { color: 'rgba(255, 255, 255, 0.1)' },
                      ticks: { color: 'rgba(255, 255, 255, 0.7)' },
                    },
                    x: {
                      grid: { color: 'rgba(255, 255, 255, 0.1)' },
                      ticks: { color: 'rgba(255, 255, 255, 0.7)' },
                    },
                  },
                  plugins: { legend: { display: false } },
                }}
              />
            )}
          </div>
        </div>

        {/* AI Insights */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
          <div className="flex items-center gap-3 mb-6">
            <Brain className="w-6 h-6 text-blue-400" />
            <h2 className="text-xl font-bold">AI-Driven Insights & Recommendations</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                className="bg-white/5 rounded-xl p-6 border border-white/10"
              >
                <div className="flex items-center gap-2 mb-4">
                  {suggestion.priority === 'high' ? (
                    <AlertTriangle className="w-5 h-5 text-yellow-400" />
                  ) : (
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  )}
                  <span className="font-semibold">
                    {suggestion.type.replace('_', ' ').toUpperCase()}
                  </span>
                </div>
                <p className="text-gray-300 mb-4">{suggestion.suggestion}</p>
                <div className="text-sm">
                  <p className="text-blue-400 mb-2">Expected Impact:</p>
                  <p className="text-gray-400">{suggestion.impact}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AnalyticsPage;