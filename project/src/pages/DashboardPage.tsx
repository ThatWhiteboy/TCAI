import React from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Line,
  Doughnut
} from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import {
  Activity,
  BarChart3,
  Clock,
  DollarSign,
  PieChart,
  Zap
} from 'lucide-react';
import { format } from 'date-fns';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// Mock data fetching function with error handling
const fetchUsageData = async () => {
  try {
    // Simulate API call with random delay
    await new Promise(resolve => setTimeout(resolve, Math.random() * 1000 + 500));

    // Generate realistic mock data
    const today = new Date();
    const dailyData = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      return {
        date: format(date, 'MMM dd'),
        requests: Math.floor(Math.random() * 1000) + 500
      };
    }).reverse();

    return {
      daily: dailyData,
      serviceUsage: {
        'Machine Learning': 45,
        'Natural Language Processing': 30,
        'Computer Vision': 15,
        'Automated Decision Making': 10
      },
      metrics: {
        totalRequests: '8,547',
        successRate: '99.8%',
        avgResponseTime: '245ms',
        costToDate: '$123.45'
      }
    };
  } catch (error) {
    console.error('Error fetching usage data:', error);
    throw new Error('Failed to fetch usage data. Please try again later.');
  }
};

function DashboardPage() {
  const { data: usageData, isLoading, error } = useQuery({
    queryKey: ['usage'],
    queryFn: fetchUsageData,
    refetchInterval: 30000, // Refresh every 30 seconds
    retry: 3 // Retry failed requests up to 3 times
  });

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-center">
        <div className="bg-red-500/20 text-red-400 p-4 rounded-lg flex items-center gap-2">
          <Activity className="w-6 h-6" />
          <span>Failed to load dashboard data. Please refresh the page.</span>
        </div>
      </div>
    );
  }

  if (isLoading || !usageData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-center">
        <div className="animate-spin text-blue-400">
          <Activity className="w-8 h-8" />
        </div>
      </div>
    );
  }

  const lineChartData = {
    labels: usageData.daily.map(d => d.date),
    datasets: [
      {
        label: 'API Requests',
        data: usageData.daily.map(d => d.requests),
        fill: true,
        borderColor: '#60A5FA',
        backgroundColor: 'rgba(96, 165, 250, 0.1)',
        tension: 0.4
      }
    ]
  };

  const doughnutData = {
    labels: Object.keys(usageData.serviceUsage),
    datasets: [
      {
        data: Object.values(usageData.serviceUsage),
        backgroundColor: [
          'rgba(96, 165, 250, 0.8)',
          'rgba(52, 211, 153, 0.8)',
          'rgba(251, 146, 60, 0.8)',
          'rgba(167, 139, 250, 0.8)'
        ]
      }
    ]
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Analytics Dashboard</h1>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            {
              label: 'Total Requests',
              value: usageData.metrics.totalRequests,
              icon: Zap,
              color: 'text-blue-400'
            },
            {
              label: 'Success Rate',
              value: usageData.metrics.successRate,
              icon: Activity,
              color: 'text-green-400'
            },
            {
              label: 'Avg Response Time',
              value: usageData.metrics.avgResponseTime,
              icon: Clock,
              color: 'text-orange-400'
            },
            {
              label: 'Cost to Date',
              value: usageData.metrics.costToDate,
              icon: DollarSign,
              color: 'text-purple-400'
            }
          ].map((metric, index) => (
            <div
              key={index}
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
            >
              <div className="flex items-center gap-3 mb-4">
                <metric.icon className={`w-6 h-6 ${metric.color}`} />
                <span className="text-gray-400">{metric.label}</span>
              </div>
              <div className="text-2xl font-bold">{metric.value}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* API Usage Trend */}
          <div className="lg:col-span-2 bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">API Usage Trend</h2>
              <BarChart3 className="w-6 h-6 text-blue-400" />
            </div>
            <Line
              data={lineChartData}
              options={{
                responsive: true,
                scales: {
                  y: {
                    beginAtZero: true,
                    grid: {
                      color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                      color: 'rgba(255, 255, 255, 0.7)'
                    }
                  },
                  x: {
                    grid: {
                      color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                      color: 'rgba(255, 255, 255, 0.7)'
                    }
                  }
                },
                plugins: {
                  legend: {
                    display: false
                  }
                }
              }}
            />
          </div>

          {/* Service Distribution */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Service Distribution</h2>
              <PieChart className="w-6 h-6 text-blue-400" />
            </div>
            <Doughnut
              data={doughnutData}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: 'bottom',
                    labels: {
                      color: 'rgba(255, 255, 255, 0.7)'
                    }
                  }
                }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;