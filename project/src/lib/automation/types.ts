// Marketing Types
export interface MarketingCampaign {
  id: string;
  name: string;
  type: string;
  budget: number;
  startDate: Date;
  endDate: Date;
  metrics: {
    impressions: number;
    clicks: number;
    conversions: number;
    cost: number;
  };
}

export interface MarketingOptimization {
  campaignId: string;
  type: 'budget' | 'targeting' | 'creative' | 'timing';
  changes: any;
  expectedImpact: {
    metric: string;
    improvement: number;
  };
}

// Sales Types
export interface SalesPipeline {
  stages: {
    [key: string]: {
      deals: number;
      value: number;
      conversionRate: number;
      avgTimeInStage: number;
    };
  };
  metrics: {
    totalDeals: number;
    totalValue: number;
    avgDealSize: number;
    avgCycleTime: number;
  };
}

export interface SalesOptimization {
  stage: string;
  type: 'process' | 'pricing' | 'messaging' | 'timing';
  changes: any;
  expectedImpact: {
    metric: string;
    improvement: number;
  };
}

// Service Types
export interface ServiceMetrics {
  responseTime: number;
  resolutionTime: number;
  customerSatisfaction: number;
  firstContactResolution: number;
  ticketVolume: number;
  agentPerformance: {
    [agentId: string]: {
      tickets: number;
      satisfaction: number;
      responseTime: number;
      resolutionTime: number;
    };
  };
}

export interface ServiceOptimization {
  area: string;
  type: 'process' | 'training' | 'resources' | 'automation';
  changes: any;
  expectedImpact: {
    metric: string;
    improvement: number;
  };
}