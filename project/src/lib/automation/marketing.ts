import { analyticsService } from '../analytics';
import { type MarketingCampaign, type MarketingOptimization } from './types';

class MarketingAutomationService {
  private static instance: MarketingAutomationService;

  private constructor() {}

  public static getInstance(): MarketingAutomationService {
    if (!MarketingAutomationService.instance) {
      MarketingAutomationService.instance = new MarketingAutomationService();
    }
    return MarketingAutomationService.instance;
  }

  public async createCampaign(campaign: Partial<MarketingCampaign>): Promise<MarketingCampaign> {
    try {
      // Generate campaign ID
      const id = `campaign-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      // Create campaign with default metrics
      const newCampaign: MarketingCampaign = {
        id,
        name: campaign.name || 'Automated Campaign',
        type: campaign.type || 'performance',
        budget: campaign.budget || 1000,
        startDate: campaign.startDate || new Date(),
        endDate: campaign.endDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        metrics: {
          impressions: 0,
          clicks: 0,
          conversions: 0,
          cost: 0
        }
      };

      // Track campaign creation
      await analyticsService.trackEvent('campaign_created', {
        campaignId: id,
        type: newCampaign.type,
        budget: newCampaign.budget
      });

      return newCampaign;
    } catch (error) {
      console.error('Campaign creation error:', error);
      throw error;
    }
  }

  public async optimizeCampaigns(campaigns: MarketingCampaign[]): Promise<MarketingOptimization[]> {
    const optimizations: MarketingOptimization[] = [];

    for (const campaign of campaigns) {
      // Analyze campaign performance
      const performance = await this.analyzeCampaignPerformance(campaign);
      
      // Generate optimizations based on performance
      const campaignOptimizations = await this.generateOptimizations(campaign, performance);
      
      optimizations.push(...campaignOptimizations);

      // Track optimizations
      await analyticsService.trackEvent('campaign_optimization', {
        campaignId: campaign.id,
        optimizations: campaignOptimizations
      });
    }

    return optimizations;
  }

  private async analyzeCampaignPerformance(campaign: MarketingCampaign) {
    const { metrics } = campaign;
    
    // Calculate key performance indicators
    const ctr = metrics.clicks / metrics.impressions || 0;
    const conversionRate = metrics.conversions / metrics.clicks || 0;
    const cpa = metrics.cost / metrics.conversions || 0;
    const roi = (metrics.conversions * 100 - metrics.cost) / metrics.cost || 0;

    return {
      ctr,
      conversionRate,
      cpa,
      roi,
      efficiency: this.calculateEfficiencyScore({
        ctr,
        conversionRate,
        cpa,
        roi
      })
    };
  }

  private async generateOptimizations(
    campaign: MarketingCampaign,
    performance: any
  ): Promise<MarketingOptimization[]> {
    const optimizations: MarketingOptimization[] = [];

    // Budget optimization
    if (performance.roi < 2) {
      optimizations.push({
        campaignId: campaign.id,
        type: 'budget',
        changes: {
          budget: campaign.budget * 0.8,
          reason: 'Low ROI - reducing budget to improve efficiency'
        },
        expectedImpact: {
          metric: 'roi',
          improvement: 0.25
        }
      });
    }

    // Targeting optimization
    if (performance.ctr < 0.02) {
      optimizations.push({
        campaignId: campaign.id,
        type: 'targeting',
        changes: {
          action: 'refine_audience',
          reason: 'Low CTR - refining target audience'
        },
        expectedImpact: {
          metric: 'ctr',
          improvement: 0.3
        }
      });
    }

    // Creative optimization
    if (performance.conversionRate < 0.1) {
      optimizations.push({
        campaignId: campaign.id,
        type: 'creative',
        changes: {
          action: 'test_new_creatives',
          reason: 'Low conversion rate - testing new ad creatives'
        },
        expectedImpact: {
          metric: 'conversionRate',
          improvement: 0.2
        }
      });
    }

    return optimizations;
  }

  private calculateEfficiencyScore(metrics: {
    ctr: number;
    conversionRate: number;
    cpa: number;
    roi: number;
  }): number {
    // Normalize and weight each metric
    const normalizedCTR = Math.min(metrics.ctr / 0.02, 1) * 0.2;
    const normalizedCVR = Math.min(metrics.conversionRate / 0.1, 1) * 0.3;
    const normalizedCPA = Math.min(100 / metrics.cpa, 1) * 0.2;
    const normalizedROI = Math.min(metrics.roi / 3, 1) * 0.3;

    return normalizedCTR + normalizedCVR + normalizedCPA + normalizedROI;
  }
}

export const marketingAutomationService = MarketingAutomationService.getInstance();