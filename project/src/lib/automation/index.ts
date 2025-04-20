import { analyticsService } from '../analytics';
import { monitoringService } from '../monitor';
import { maintenanceService } from '../maintenance';
import { complianceService } from '../compliance';
import { marketingAutomationService } from './marketing';
import { salesAutomationService } from './sales';
import { serviceAutomationService } from './service';
import { ecommerceAutomationService } from './ecommerce';
import { format } from 'date-fns';

class BusinessAutomationService {
  private static instance: BusinessAutomationService;

  private constructor() {}

  public static getInstance(): BusinessAutomationService {
    if (!BusinessAutomationService.instance) {
      BusinessAutomationService.instance = new BusinessAutomationService();
    }
    return BusinessAutomationService.instance;
  }

  public async optimizeMarketing(): Promise<void> {
    try {
      const metrics = await analyticsService.getPerformanceMetrics(
        new Date(Date.now() - 24 * 60 * 60 * 1000),
        new Date()
      );
      
      const optimizations = await marketingAutomationService.optimizeCampaigns(metrics.campaigns);
      
      await analyticsService.trackEvent('marketing_optimization', {
        optimizations,
        timestamp: Date.now()
      });
    } catch (error) {
      await this.handleAutomationError('marketing', error);
    }
  }

  public async optimizeSales(): Promise<void> {
    try {
      const metrics = await analyticsService.getSalesMetrics(
        new Date(Date.now() - 24 * 60 * 60 * 1000),
        new Date()
      );
      
      const optimizations = await salesAutomationService.optimizePipeline(metrics.pipeline);
      
      await analyticsService.trackEvent('sales_optimization', {
        optimizations,
        timestamp: Date.now()
      });
    } catch (error) {
      await this.handleAutomationError('sales', error);
    }
  }

  public async optimizeService(): Promise<void> {
    try {
      const metrics = await analyticsService.getServiceMetrics(
        new Date(Date.now() - 24 * 60 * 60 * 1000),
        new Date()
      );
      
      const optimizations = await serviceAutomationService.optimizeService(metrics);
      
      await analyticsService.trackEvent('service_optimization', {
        optimizations,
        timestamp: Date.now()
      });
    } catch (error) {
      await this.handleAutomationError('service', error);
    }
  }

  public async optimizeEcommerce(): Promise<void> {
    try {
      const products = await ecommerceAutomationService.getAllProducts();
      const optimizations = await ecommerceAutomationService.optimizePricing(products);
      
      await analyticsService.trackEvent('ecommerce_optimization', {
        optimizations,
        timestamp: Date.now()
      });
    } catch (error) {
      await this.handleAutomationError('ecommerce', error);
    }
  }

  public async manageInventory(): Promise<void> {
    try {
      const inventory = await ecommerceAutomationService.checkInventory();
      const updates = await ecommerceAutomationService.updateInventory(inventory);
      
      await analyticsService.trackEvent('inventory_update', {
        updates,
        timestamp: Date.now()
      });
    } catch (error) {
      await this.handleAutomationError('inventory', error);
    }
  }

  public async checkCompliance(): Promise<void> {
    try {
      const status = await complianceService.checkCompliance();
      
      await analyticsService.trackEvent('compliance_check', {
        status,
        timestamp: Date.now()
      });
    } catch (error) {
      await this.handleAutomationError('compliance', error);
    }
  }

  public async maintainSystem(): Promise<void> {
    try {
      const maintenance = await maintenanceService.performMaintenance();
      
      await analyticsService.trackEvent('system_maintenance', {
        maintenance,
        timestamp: Date.now()
      });
    } catch (error) {
      await this.handleAutomationError('maintenance', error);
    }
  }

  public async checkPerformance(): Promise<void> {
    try {
      const metrics = await monitoringService.checkPerformance();
      
      await analyticsService.trackEvent('performance_metrics', {
        metrics,
        timestamp: Date.now()
      });
    } catch (error) {
      await this.handleAutomationError('performance', error);
    }
  }

  private async handleAutomationError(type: string, error: any) {
    console.error(`Automation error (${type}):`, error);
    await analyticsService.trackEvent('automation_error', {
      type,
      error: error.message,
      timestamp: Date.now()
    });

    // Implement error recovery
    await this.attemptRecovery(type);
  }

  private async attemptRecovery(type: string) {
    try {
      switch (type) {
        case 'marketing':
          await marketingAutomationService.recoverCampaigns();
          break;
        case 'sales':
          await salesAutomationService.recoverPipeline();
          break;
        case 'service':
          await serviceAutomationService.recoverService();
          break;
        case 'ecommerce':
          await ecommerceAutomationService.recoverOperations();
          break;
        case 'compliance':
          await complianceService.recoverCompliance();
          break;
        case 'maintenance':
          await maintenanceService.recoverMaintenance();
          break;
        case 'performance':
          await monitoringService.recoverPerformance();
          break;
      }

      await analyticsService.trackEvent('error_recovery', {
        type,
        success: true,
        timestamp: Date.now()
      });
    } catch (error) {
      console.error(`Recovery failed for ${type}:`, error);
      await analyticsService.trackEvent('recovery_failed', {
        type,
        error: error.message,
        timestamp: Date.now()
      });
    }
  }
}

export const businessAutomationService = BusinessAutomationService.getInstance();