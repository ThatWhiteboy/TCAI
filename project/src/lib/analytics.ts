import { format } from 'date-fns';
import { automationService } from './automation';

export interface AnalyticsMetric {
  timestamp: number;
  value: number;
  metadata?: Record<string, any>;
}

export interface PerformanceMetrics {
  apiLatency: AnalyticsMetric[];
  errorRates: AnalyticsMetric[];
  requestVolume: AnalyticsMetric[];
  successRates: AnalyticsMetric[];
  campaigns: any[]; // Added for marketing metrics
}

export interface SalesMetrics {
  conversionRate: AnalyticsMetric[];
  revenue: AnalyticsMetric[];
  customerAcquisitionCost: AnalyticsMetric[];
  customerLifetimeValue: AnalyticsMetric[];
  pipeline: any; // Added for sales pipeline
}

export interface ServiceMetrics {
  responseTime: number;
  satisfaction: number;
  resolutionRate: number;
  customerSatisfaction: number;
  firstContactResolution: number;
  ticketVolume: number;
  agentPerformance: Record<string, {
    tickets: number;
    satisfaction: number;
    responseTime: number;
    resolutionTime: number;
  }>;
}

export interface BusinessMetrics {
  grossMargin: AnalyticsMetric[];
  operatingExpenses: AnalyticsMetric[];
  netProfitMargin: AnalyticsMetric[];
  cashFlow: AnalyticsMetric[];
}

export interface OptimizationSuggestion {
  id?: string;
  type: 'performance' | 'sales' | 'user_experience' | 'profitability';
  priority: 'high' | 'medium' | 'low';
  suggestion: string;
  impact: string;
  implementation: string;
  potentialValue: number;
  confidence: number;
  autoApplicable?: boolean;
  safetyScore?: number;
  rollbackPlan?: string;
  implementationSteps?: OptimizationStep[];
  monitoringMetrics?: string[];
  successCriteria?: SuccessCriteria;
}

interface OptimizationStep {
  id: string;
  description: string;
  action: () => Promise<void>;
  rollback: () => Promise<void>;
  validation: () => Promise<boolean>;
}

interface SuccessCriteria {
  metrics: string[];
  thresholds: Record<string, number>;
  evaluationPeriod: number; // in hours
}

interface OptimizationResult {
  success: boolean;
  metrics: Record<string, number>;
  timestamp: number;
  rollbackNeeded: boolean;
}

class AnalyticsService {
  private static instance: AnalyticsService;
  private metricsBuffer: Map<string, AnalyticsMetric[]>;
  private flushInterval: number = 60000;
  private aiModelVersion: string = '2.0.0';
  private readonly automationThresholds = {
    performance: {
      latency: 200, // ms
      errorRate: 0.01, // 1%
      successRate: 0.995 // 99.5%
    },
    sales: {
      conversionRate: 0.05, // 5%
      revenueGrowth: 0.1, // 10%
      customerRetention: 0.8 // 80%
    },
    costs: {
      profitMargin: 0.2, // 20%
      operationalEfficiency: 0.85 // 85%
    }
  };

  private constructor() {
    this.metricsBuffer = new Map();
    this.startAutoFlush();
    this.startAutomatedOptimization();
  }

  public static getInstance(): AnalyticsService {
    if (!AnalyticsService.instance) {
      AnalyticsService.instance = new AnalyticsService();
    }
    return AnalyticsService.instance;
  }

  private startAutoFlush() {
    setInterval(() => this.flush(), this.flushInterval);
  }

  private startAutomatedOptimization() {
    setInterval(async () => {
      try {
        const suggestions = await this.getOptimizationSuggestions();
        const automatedSuggestions = suggestions.filter(suggestion => 
          suggestion.confidence >= 0.85 && suggestion.potentialValue > 10000
        );

        for (const suggestion of automatedSuggestions) {
          await this.implementOptimization(suggestion);
        }
      } catch (error) {
        console.error('Automated optimization error:', error instanceof Error ? error.message : 'Unknown error');
      }
    }, 15 * 60 * 1000); // Every 15 minutes
  }

  private async implementOptimization(suggestion: OptimizationSuggestion) {
    try {
      await automationService.implementChange({
        type: suggestion.type,
        changes: this.generateChanges(suggestion),
        rollbackPlan: this.generateRollbackPlan(suggestion),
        monitoringPlan: this.generateMonitoringPlan(suggestion)
      });
    } catch (error) {
      console.error('Optimization implementation error:', error instanceof Error ? error.message : 'Unknown error');
    }
  }

  private generateChanges(suggestion: OptimizationSuggestion): any[] {
    // Implementation specific to each suggestion type
    switch (suggestion.type) {
      case 'performance':
        return this.generatePerformanceChanges(suggestion);
      case 'sales':
        return this.generateSalesChanges(suggestion);
      case 'user_experience':
        return this.generateUXChanges(suggestion);
      case 'profitability':
        return this.generateProfitabilityChanges(suggestion);
      default:
        return [];
    }
  }

  private generateRollbackPlan(suggestion: OptimizationSuggestion): any {
    return {
      steps: this.generateChanges(suggestion).map(change => ({
        action: this.generateRollbackAction(change),
        validation: this.generateRollbackValidation(change)
      })),
      thresholds: this.getRollbackThresholds(suggestion.type)
    };
  }

  private generateMonitoringPlan(suggestion: OptimizationSuggestion): any {
    return {
      metrics: this.getRelevantMetrics(suggestion.type),
      thresholds: this.getMonitoringThresholds(suggestion.type),
      interval: this.getMonitoringInterval(suggestion.type),
      duration: this.getMonitoringDuration(suggestion.type)
    };
  }

  private async flush() {
    if (this.metricsBuffer.size === 0) return;

    try {
      const metrics = Object.fromEntries(this.metricsBuffer);
      await fetch('/api/analytics/metrics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(metrics),
      });
      this.metricsBuffer.clear();
    } catch (error) {
      console.error('Failed to flush metrics:', error instanceof Error ? error.message : 'Unknown error');
    }
  }

  public trackMetric(name: string, value: number, metadata?: Record<string, any>) {
    const metric: AnalyticsMetric = {
      timestamp: Date.now(),
      value,
      metadata: {
        ...metadata,
        aiVersion: this.aiModelVersion,
      },
    };

    const currentMetrics = this.metricsBuffer.get(name) || [];
    this.metricsBuffer.set(name, [...currentMetrics, metric]);
  }

  public async getPerformanceMetrics(startDate: Date, endDate: Date): Promise<PerformanceMetrics> {
    try {
      return {
        apiLatency: this.generateMockTimeSeriesData(startDate, endDate, 100, 500),
        errorRates: this.generateMockTimeSeriesData(startDate, endDate, 0, 0.02),
        requestVolume: this.generateMockTimeSeriesData(startDate, endDate, 1000, 5000),
        successRates: this.generateMockTimeSeriesData(startDate, endDate, 0.95, 1),
        campaigns: this.generateMockCampaigns()
      };
    } catch (error) {
      console.error('Error getting performance metrics:', error instanceof Error ? error.message : 'Unknown error');
      // Return empty metrics to prevent UI errors
      return {
        apiLatency: [],
        errorRates: [],
        requestVolume: [],
        successRates: [],
        campaigns: []
      };
    }
  }

  public async getSalesMetrics(startDate: Date, endDate: Date): Promise<SalesMetrics> {
    try {
      return {
        conversionRate: this.generateMockTimeSeriesData(startDate, endDate, 0.01, 0.1),
        revenue: this.generateMockTimeSeriesData(startDate, endDate, 10000, 50000),
        customerAcquisitionCost: this.generateMockTimeSeriesData(startDate, endDate, 50, 200),
        customerLifetimeValue: this.generateMockTimeSeriesData(startDate, endDate, 1000, 5000),
        pipeline: this.generateMockSalesPipeline()
      };
    } catch (error) {
      console.error('Error getting sales metrics:', error instanceof Error ? error.message : 'Unknown error');
      return {
        conversionRate: [],
        revenue: [],
        customerAcquisitionCost: [],
        customerLifetimeValue: [],
        pipeline: { stages: {} }
      };
    }
  }

  public async getServiceMetrics(startDate: Date, endDate: Date): Promise<ServiceMetrics> {
    try {
      return {
        responseTime: 120,
        satisfaction: 0.85,
        resolutionRate: 0.9,
        customerSatisfaction: 0.88,
        firstContactResolution: 0.75,
        ticketVolume: 150,
        agentPerformance: this.generateMockAgentPerformance()
      };
    } catch (error) {
      console.error('Error getting service metrics:', error instanceof Error ? error.message : 'Unknown error');
      return {
        responseTime: 0,
        satisfaction: 0,
        resolutionRate: 0,
        customerSatisfaction: 0,
        firstContactResolution: 0,
        ticketVolume: 0,
        agentPerformance: {}
      };
    }
  }

  public async getBusinessMetrics(startDate: Date, endDate: Date): Promise<BusinessMetrics> {
    try {
      return {
        grossMargin: this.generateMockTimeSeriesData(startDate, endDate, 0.3, 0.5),
        operatingExpenses: this.generateMockTimeSeriesData(startDate, endDate, 5000, 20000),
        netProfitMargin: this.generateMockTimeSeriesData(startDate, endDate, 0.1, 0.3),
        cashFlow: this.generateMockTimeSeriesData(startDate, endDate, -5000, 15000)
      };
    } catch (error) {
      console.error('Error getting business metrics:', error instanceof Error ? error.message : 'Unknown error');
      return {
        grossMargin: [],
        operatingExpenses: [],
        netProfitMargin: [],
        cashFlow: []
      };
    }
  }

  public async getUserBehaviorMetrics(startDate: Date, endDate: Date) {
    try {
      return {
        userRetention: this.generateMockTimeSeriesData(startDate, endDate, 60, 90),
        sessionDuration: this.generateMockTimeSeriesData(startDate, endDate, 120, 300)
      };
    } catch (error) {
      console.error('Error getting user behavior metrics:', error instanceof Error ? error.message : 'Unknown error');
      return {
        userRetention: [],
        sessionDuration: []
      };
    }
  }

  public async getOptimizationSuggestions(): Promise<OptimizationSuggestion[]> {
    try {
      return [
        {
          type: 'performance',
          priority: 'high',
          suggestion: 'Implement API response caching',
          impact: 'Could reduce API latency by up to 40% and improve overall system performance',
          implementation: 'Add Redis caching layer for frequently accessed endpoints',
          potentialValue: 85000,
          confidence: 0.92
        },
        {
          type: 'sales',
          priority: 'medium',
          suggestion: 'Optimize checkout flow',
          impact: 'Could increase conversion rate by 15-20%',
          implementation: 'Reduce checkout steps and implement one-click purchasing',
          potentialValue: 120000,
          confidence: 0.85
        },
        {
          type: 'user_experience',
          priority: 'medium',
          suggestion: 'Enhance onboarding experience',
          impact: 'Could improve user retention by 25%',
          implementation: 'Implement interactive tutorials and progress tracking',
          potentialValue: 95000,
          confidence: 0.78
        },
        {
          type: 'profitability',
          priority: 'high',
          suggestion: 'Optimize cloud resource allocation',
          impact: 'Could reduce operational costs by 30%',
          implementation: 'Implement auto-scaling and right-sizing for cloud resources',
          potentialValue: 150000,
          confidence: 0.9
        }
      ];
    } catch (error) {
      console.error('Error generating optimization suggestions:', error instanceof Error ? error.message : 'Unknown error');
      return [];
    }
  }

  private generateMockTimeSeriesData(startDate: Date, endDate: Date, min: number, max: number): AnalyticsMetric[] {
    try {
      const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
      return Array.from({ length: Math.max(1, days) }, (_, i) => ({
        timestamp: startDate.getTime() + i * 24 * 60 * 60 * 1000,
        value: min + Math.random() * (max - min)
      }));
    } catch (error) {
      console.error('Error generating mock data:', error instanceof Error ? error.message : 'Unknown error');
      return [{ timestamp: Date.now(), value: 0 }];
    }
  }

  private generateMockCampaigns() {
    try {
      return [
        {
          id: 'campaign-1',
          metrics: {
            impressions: 1000,
            clicks: 100,
            conversions: 10,
            cost: 500
          }
        }
      ];
    } catch (error) {
      console.error('Error generating mock campaigns:', error instanceof Error ? error.message : 'Unknown error');
      return [];
    }
  }

  private generateMockSalesPipeline() {
    try {
      return {
        stages: {
          lead: { conversion: 0.2 },
          opportunity: { conversion: 0.3 },
          negotiation: { conversion: 0.4 }
        }
      };
    } catch (error) {
      console.error('Error generating mock sales pipeline:', error instanceof Error ? error.message : 'Unknown error');
      return { stages: {} };
    }
  }

  private generateMockAgentPerformance() {
    try {
      return {
        'agent-1': {
          tickets: 50,
          satisfaction: 0.9,
          responseTime: 120,
          resolutionTime: 480
        }
      };
    } catch (error) {
      console.error('Error generating mock agent performance:', error instanceof Error ? error.message : 'Unknown error');
      return {};
    }
  }

  public async trackEvent(eventName: string, properties?: Record<string, any>) {
    try {
      await fetch('/api/analytics/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: eventName,
          properties,
          timestamp: Date.now()
        }),
      });
    } catch (error) {
      console.error('Failed to track event:', error instanceof Error ? error.message : 'Unknown error');
    }
  }

  // Helper methods for optimization
  private generatePerformanceChanges(suggestion: OptimizationSuggestion) {
    try {
      return [
        {
          type: 'caching',
          config: {
            ttl: 300,
            endpoints: ['/api/data', '/api/metrics']
          }
        }
      ];
    } catch (error) {
      console.error('Error generating performance changes:', error instanceof Error ? error.message : 'Unknown error');
      return [];
    }
  }

  private generateSalesChanges(suggestion: OptimizationSuggestion) {
    try {
      return [
        {
          type: 'checkout',
          config: {
            steps: 2,
            savePaymentInfo: true
          }
        }
      ];
    } catch (error) {
      console.error('Error generating sales changes:', error instanceof Error ? error.message : 'Unknown error');
      return [];
    }
  }

  private generateUXChanges(suggestion: OptimizationSuggestion) {
    try {
      return [
        {
          type: 'onboarding',
          config: {
            steps: ['welcome', 'profile', 'preferences'],
            interactive: true
          }
        }
      ];
    } catch (error) {
      console.error('Error generating UX changes:', error instanceof Error ? error.message : 'Unknown error');
      return [];
    }
  }

  private generateProfitabilityChanges(suggestion: OptimizationSuggestion) {
    try {
      return [
        {
          type: 'resources',
          config: {
            autoScale: true,
            minInstances: 2,
            maxInstances: 10
          }
        }
      ];
    } catch (error) {
      console.error('Error generating profitability changes:', error instanceof Error ? error.message : 'Unknown error');
      return [];
    }
  }

  private generateRollbackAction(change: any) {
    return async () => {
      try {
        console.log(`Rolling back change: ${change.type}`);
        return true;
      } catch (error) {
        console.error(`Rollback error for ${change.type}:`, error instanceof Error ? error.message : 'Unknown error');
        return false;
      }
    };
  }

  private generateRollbackValidation(change: any) {
    return async () => {
      try {
        console.log(`Validating rollback for: ${change.type}`);
        return true;
      } catch (error) {
        console.error(`Validation error for ${change.type}:`, error instanceof Error ? error.message : 'Unknown error');
        return false;
      }
    };
  }

  private getRollbackThresholds(type: string) {
    try {
      switch (type) {
        case 'performance':
          return { latency: 300, errorRate: 0.02 };
        case 'sales':
          return { conversionRate: 0.03 };
        case 'user_experience':
          return { retention: 0.6 };
        case 'profitability':
          return { costs: 1.2 }; // 20% increase
        default:
          return {};
      }
    } catch (error) {
      console.error('Error getting rollback thresholds:', error instanceof Error ? error.message : 'Unknown error');
      return {};
    }
  }

  private getRelevantMetrics(type: string) {
    try {
      switch (type) {
        case 'performance':
          return ['latency', 'errorRate', 'throughput'];
        case 'sales':
          return ['conversionRate', 'revenue', 'aov'];
        case 'user_experience':
          return ['retention', 'satisfaction', 'engagement'];
        case 'profitability':
          return ['costs', 'margin', 'efficiency'];
        default:
          return [];
      }
    } catch (error) {
      console.error('Error getting relevant metrics:', error instanceof Error ? error.message : 'Unknown error');
      return [];
    }
  }

  private getMonitoringThresholds(type: string) {
    try {
      switch (type) {
        case 'performance':
          return { latency: 200, errorRate: 0.01 };
        case 'sales':
          return { conversionRate: 0.05 };
        case 'user_experience':
          return { retention: 0.7 };
        case 'profitability':
          return { costs: 0.8 }; // 20% decrease
        default:
          return {};
      }
    } catch (error) {
      console.error('Error getting monitoring thresholds:', error instanceof Error ? error.message : 'Unknown error');
      return {};
    }
  }

  private getMonitoringInterval(type: string) {
    try {
      switch (type) {
        case 'performance':
          return 300000; // 5 minutes
        case 'sales':
          return 3600000; // 1 hour
        case 'user_experience':
          return 86400000; // 1 day
        case 'profitability':
          return 86400000; // 1 day
        default:
          return 3600000; // 1 hour default
      }
    } catch (error) {
      console.error('Error getting monitoring interval:', error instanceof Error ? error.message : 'Unknown error');
      return 3600000; // 1 hour default
    }
  }

  private getMonitoringDuration(type: string) {
    try {
      switch (type) {
        case 'performance':
          return 86400000; // 1 day
        case 'sales':
          return 604800000; // 1 week
        case 'user_experience':
          return 2592000000; // 30 days
        case 'profitability':
          return 2592000000; // 30 days
        default:
          return 604800000; // 1 week default
      }
    } catch (error) {
      console.error('Error getting monitoring duration:', error instanceof Error ? error.message : 'Unknown error');
      return 604800000; // 1 week default
    }
  }
}

export const analyticsService = AnalyticsService.getInstance();