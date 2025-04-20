import { analyticsService } from '../analytics';
import { automationService } from '../automation';
import { testingService } from './testing';
import { deploymentService } from './deployment';
import winston from 'winston';
import si from 'systeminformation';
import cron from 'node-cron';

class MonitoringService {
  private static instance: MonitoringService;
  private monitoringIntervals: NodeJS.Timeout[] = [];
  private logger: winston.Logger;
  private readonly checkIntervals = {
    health: 60000,        // 1 minute
    performance: 300000,  // 5 minutes
    security: 900000,     // 15 minutes
    business: 1800000,    // 30 minutes
    optimization: 3600000 // 1 hour
  };

  private readonly performanceThresholds = {
    cpu: 80, // 80% max CPU usage
    memory: 85, // 85% max memory usage
    latency: 200, // 200ms max latency
    errorRate: 0.01 // 1% max error rate
  };

  private constructor() {
    this.initializeLogger();
    this.initializeMonitoring();
  }

  private initializeLogger() {
    this.logger = winston.createLogger({
      level: 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      ),
      transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'error.log', level: 'error' })
      ]
    });
  }

  public static getInstance(): MonitoringService {
    if (!MonitoringService.instance) {
      MonitoringService.instance = new MonitoringService();
    }
    return MonitoringService.instance;
  }

  private async initializeMonitoring() {
    try {
      // Initialize core monitoring
      await this.setupCoreMonitoring();

      // Start automated monitoring tasks
      this.startAutomatedMonitoring();

      // Schedule optimization tasks
      this.scheduleOptimizationTasks();

      this.logger.info('Monitoring service initialized successfully');
    } catch (error) {
      this.logger.error('Failed to initialize monitoring:', error);
      await this.handleMonitoringError('initialization', error);
    }
  }

  private async setupCoreMonitoring() {
    // Initialize system monitoring
    await this.initializeSystemMonitoring();

    // Setup performance tracking
    await this.initializePerformanceTracking();

    // Configure error handling
    await this.initializeErrorHandling();
  }

  private async initializeSystemMonitoring() {
    // Monitor system resources
    cron.schedule('*/5 * * * *', async () => {
      try {
        const [cpu, memory, disk] = await Promise.all([
          si.currentLoad(),
          si.mem(),
          si.fsSize()
        ]);

        await this.processSystemMetrics({ cpu, memory, disk });
      } catch (error) {
        this.logger.error('System monitoring error:', error);
      }
    });
  }

  private async initializePerformanceTracking() {
    // Track performance metrics
    cron.schedule('*/1 * * * *', async () => {
      try {
        const metrics = await this.measurePerformanceMetrics();
        await this.processPerformanceMetrics(metrics);
      } catch (error) {
        this.logger.error('Performance tracking error:', error);
      }
    });
  }

  private async initializeErrorHandling() {
    process.on('uncaughtException', async (error) => {
      await this.handleUncaughtError(error);
    });

    process.on('unhandledRejection', async (error) => {
      await this.handleUnhandledRejection(error);
    });
  }

  private async measurePerformanceMetrics() {
    const metrics = {
      cpu: await this.measureCPUUsage(),
      memory: await this.measureMemoryUsage(),
      latency: await this.measureLatency(),
      errorRate: await this.calculateErrorRate()
    };

    return metrics;
  }

  private async measureCPUUsage(): Promise<number> {
    const load = await si.currentLoad();
    return load.currentLoad;
  }

  private async measureMemoryUsage(): Promise<number> {
    const memory = await si.mem();
    return (memory.used / memory.total) * 100;
  }

  private async measureLatency(): Promise<number> {
    const start = Date.now();
    await fetch('/api/health');
    return Date.now() - start;
  }

  private async calculateErrorRate(): Promise<number> {
    const metrics = await analyticsService.getPerformanceMetrics(
      new Date(Date.now() - 5 * 60 * 1000),
      new Date()
    );

    return metrics.errorRates[0]?.value || 0;
  }

  private async processSystemMetrics(metrics: any) {
    // Check thresholds
    const issues = this.checkThresholds(metrics);

    if (issues.length > 0) {
      await this.handlePerformanceIssues(issues);
    }

    // Track metrics
    await analyticsService.trackEvent('system_metrics', {
      metrics,
      timestamp: Date.now()
    });
  }

  private async processPerformanceMetrics(metrics: any) {
    // Validate metrics
    const issues = this.validatePerformanceMetrics(metrics);

    if (issues.length > 0) {
      await this.handlePerformanceIssues(issues);
    }

    // Track metrics
    await analyticsService.trackEvent('performance_metrics', {
      metrics,
      timestamp: Date.now()
    });
  }

  private checkThresholds(metrics: any): any[] {
    const issues = [];

    if (metrics.cpu.currentLoad > this.performanceThresholds.cpu) {
      issues.push({
        type: 'cpu',
        current: metrics.cpu.currentLoad,
        threshold: this.performanceThresholds.cpu
      });
    }

    if ((metrics.memory.used / metrics.memory.total) * 100 > this.performanceThresholds.memory) {
      issues.push({
        type: 'memory',
        current: (metrics.memory.used / metrics.memory.total) * 100,
        threshold: this.performanceThresholds.memory
      });
    }

    return issues;
  }

  private async handlePerformanceIssues(issues: any[]) {
    for (const issue of issues) {
      this.logger.warn(`Performance issue detected: ${issue.type}`, issue);

      try {
        await automationService.handlePerformanceIssue(issue);
      } catch (error) {
        this.logger.error(`Failed to handle ${issue.type} issue:`, error);
      }
    }
  }

  private async handleUncaughtError(error: Error) {
    this.logger.error('Uncaught exception:', error);
    await analyticsService.trackEvent('uncaught_error', {
      error: error.message,
      stack: error.stack,
      timestamp: Date.now()
    });
  }

  private async handleUnhandledRejection(error: any) {
    this.logger.error('Unhandled rejection:', error);
    await analyticsService.trackEvent('unhandled_rejection', {
      error: error.message,
      stack: error.stack,
      timestamp: Date.now()
    });
  }

  private async handleMonitoringError(type: string, error: any) {
    this.logger.error(`Monitoring error (${type}):`, error);
    await analyticsService.trackEvent('monitoring_error', {
      type,
      error: error.message,
      timestamp: Date.now()
    });

    await this.attemptRecovery(type);
  }

  private async attemptRecovery(type: string) {
    try {
      switch (type) {
        case 'performance':
          await this.recoverPerformance();
          break;
        case 'system':
          await this.recoverSystem();
          break;
        default:
          await this.recoverMonitoring();
      }

      this.logger.info(`Recovery successful for ${type}`);
    } catch (error) {
      this.logger.error(`Recovery failed for ${type}:`, error);
      throw error;
    }
  }

  private async recoverPerformance() {
    // Implement performance recovery
    await automationService.optimizePerformance();
  }

  private async recoverSystem() {
    // Implement system recovery
    await automationService.restartServices();
  }

  private async recoverMonitoring() {
    // Implement monitoring recovery
    this.monitoringIntervals.forEach(clearInterval);
    await this.initializeMonitoring();
  }
}

export const monitoringService = MonitoringService.getInstance();