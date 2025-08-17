interface APIMetrics {
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  averageResponseTime: number;
  cacheHitRate: number;
  fallbackUsage: number;
  lastError?: string;
  lastErrorTime?: number;
}

interface RequestLog {
  timestamp: number;
  duration: number;
  success: boolean;
  fromCache: boolean;
  fromFallback: boolean;
  error?: string;
  userId?: string;
}

class APIMonitoringService {
  private metrics: APIMetrics = {
    totalRequests: 0,
    successfulRequests: 0,
    failedRequests: 0,
    averageResponseTime: 0,
    cacheHitRate: 0,
    fallbackUsage: 0,
  };

  private requestLogs: RequestLog[] = [];
  private maxLogs = 1000;

  logRequest(log: RequestLog): void {
    this.requestLogs.push(log);

    // Keep only recent logs
    if (this.requestLogs.length > this.maxLogs) {
      this.requestLogs = this.requestLogs.slice(-this.maxLogs);
    }

    this.updateMetrics();
  }

  private updateMetrics(): void {
    const recentLogs = this.getRecentLogs(3600000); // Last hour

    this.metrics.totalRequests = recentLogs.length;
    this.metrics.successfulRequests = recentLogs.filter(
      (log) => log.success,
    ).length;
    this.metrics.failedRequests = recentLogs.filter(
      (log) => !log.success,
    ).length;

    const totalTime = recentLogs.reduce((sum, log) => sum + log.duration, 0);
    this.metrics.averageResponseTime = totalTime / recentLogs.length || 0;

    const cacheHits = recentLogs.filter((log) => log.fromCache).length;
    this.metrics.cacheHitRate = (cacheHits / recentLogs.length) * 100 || 0;

    const fallbackUsage = recentLogs.filter((log) => log.fromFallback).length;
    this.metrics.fallbackUsage = (fallbackUsage / recentLogs.length) * 100 || 0;

    // Track latest error
    const latestError = recentLogs
      .filter((log) => !log.success && log.error)
      .sort((a, b) => b.timestamp - a.timestamp)[0];

    if (latestError) {
      this.metrics.lastError = latestError.error;
      this.metrics.lastErrorTime = latestError.timestamp;
    }
  }

  private getRecentLogs(timeWindow: number): RequestLog[] {
    const cutoff = Date.now() - timeWindow;
    return this.requestLogs.filter((log) => log.timestamp > cutoff);
  }

  getMetrics(): APIMetrics {
    return { ...this.metrics };
  }

  getDetailedReport(): {
    metrics: APIMetrics;
    hourlyBreakdown: Array<{
      hour: number;
      requests: number;
      successRate: number;
      avgResponseTime: number;
    }>;
    errorFrequency: Array<{
      error: string;
      count: number;
      lastOccurrence: number;
    }>;
  } {
    const recentLogs = this.getRecentLogs(86400000); // Last 24 hours

    // Hourly breakdown
    const hourlyData = new Map<number, RequestLog[]>();
    recentLogs.forEach((log) => {
      const hour = new Date(log.timestamp).getHours();
      if (!hourlyData.has(hour)) hourlyData.set(hour, []);
      hourlyData.get(hour)!.push(log);
    });

    const hourlyBreakdown = Array.from(hourlyData.entries()).map(
      ([hour, logs]) => ({
        hour,
        requests: logs.length,
        successRate:
          (logs.filter((log) => log.success).length / logs.length) * 100,
        avgResponseTime:
          logs.reduce((sum, log) => sum + log.duration, 0) / logs.length,
      }),
    );

    // Error frequency
    const errorCounts = new Map<
      string,
      { count: number; lastOccurrence: number }
    >();
    recentLogs
      .filter((log) => !log.success && log.error)
      .forEach((log) => {
        const error = log.error!;
        const current = errorCounts.get(error) || {
          count: 0,
          lastOccurrence: 0,
        };
        errorCounts.set(error, {
          count: current.count + 1,
          lastOccurrence: Math.max(current.lastOccurrence, log.timestamp),
        });
      });

    const errorFrequency = Array.from(errorCounts.entries())
      .map(([error, data]) => ({ error, ...data }))
      .sort((a, b) => b.count - a.count);

    return {
      metrics: this.getMetrics(),
      hourlyBreakdown,
      errorFrequency,
    };
  }

  // Alert when things go wrong
  checkAlerts(): Array<{
    level: "warning" | "critical";
    message: string;
    metric: string;
    value: number;
  }> {
    const alerts = [];
    const metrics = this.getMetrics();

    // Success rate too low
    const successRate =
      (metrics.successfulRequests / metrics.totalRequests) * 100;
    if (successRate < 95 && metrics.totalRequests > 10) {
      alerts.push({
        level: "critical" as const,
        message: `Success rate dropped to ${successRate.toFixed(1)}%`,
        metric: "successRate",
        value: successRate,
      });
    }

    // Response time too high
    if (metrics.averageResponseTime > 5000) {
      alerts.push({
        level: "warning" as const,
        message: `Average response time is ${(metrics.averageResponseTime / 1000).toFixed(1)}s`,
        metric: "responseTime",
        value: metrics.averageResponseTime,
      });
    }

    // Too much fallback usage
    if (metrics.fallbackUsage > 50) {
      alerts.push({
        level: "warning" as const,
        message: `${metrics.fallbackUsage.toFixed(1)}% requests using fallback`,
        metric: "fallbackUsage",
        value: metrics.fallbackUsage,
      });
    }

    return alerts;
  }

  // Export data for external monitoring
  exportMetrics(): string {
    return JSON.stringify({
      timestamp: Date.now(),
      metrics: this.getMetrics(),
      recentLogs: this.getRecentLogs(3600000),
    });
  }
}

export const apiMonitoring = new APIMonitoringService();

// Helper function to wrap API calls with monitoring
export function withMonitoring<T>(
  apiCall: () => Promise<T>,
  userId?: string,
): Promise<T> {
  const startTime = Date.now();

  return apiCall()
    .then((result) => {
      apiMonitoring.logRequest({
        timestamp: startTime,
        duration: Date.now() - startTime,
        success: true,
        fromCache: (result as any)?.fromCache || false,
        fromFallback: (result as any)?.fromFallback || false,
        userId,
      });
      return result;
    })
    .catch((error) => {
      apiMonitoring.logRequest({
        timestamp: startTime,
        duration: Date.now() - startTime,
        success: false,
        fromCache: false,
        fromFallback: false,
        error: error.message,
        userId,
      });
      throw error;
    });
}
