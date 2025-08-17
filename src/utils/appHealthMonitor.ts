import AppNotifications from "./appNotifications";

export class AppHealthMonitor {
  private static instance: AppHealthMonitor;
  private errorCounts = new Map<string, number>();
  private lastErrorTime = new Map<string, number>();
  private readonly ERROR_THRESHOLD = 3;
  private readonly TIME_WINDOW = 60000; // 1 minute

  static getInstance(): AppHealthMonitor {
    if (!AppHealthMonitor.instance) {
      AppHealthMonitor.instance = new AppHealthMonitor();
    }
    return AppHealthMonitor.instance;
  }

  private constructor() {
    this.setupMonitoring();
  }

  private setupMonitoring() {
    // Monitor console errors
    const originalError = console.error;
    console.error = (...args) => {
      this.handleError("console", args.join(" "));
      originalError.apply(console, args);
    };

    // Monitor fetch failures (exclude Firebase operations to prevent interference)
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      try {
        const response = await originalFetch(...args);
        const url = args[0]?.toString() || "";

        // Skip monitoring Firebase, Auth, Google APIs, and other service requests to prevent interference
        if (
          url.includes("firestore.googleapis.com") ||
          url.includes("firebase") ||
          url.includes("identitytoolkit.googleapis.com") ||
          url.includes("securetoken.googleapis.com") ||
          url.includes("googleapis.com") ||
          url.includes("youtube") ||
          url.includes("oauth2") ||
          url.includes("accounts.google.com") ||
          url.includes("fullstory.com") ||
          url.includes("edge.fullstory.com") ||
          url.includes("www.gstatic.com") ||
          url.includes("firebaseapp.com") ||
          url.includes("firebasestorage.app") ||
          url.includes(".googleapis.") ||
          url.includes("google") ||
          url.includes("gcp") ||
          url.includes("fs.js") ||
          url.includes("api.") ||
          url.includes("cdn.") ||
          url.includes("auth")
        ) {
          return response;
        }

        if (!response.ok) {
          this.handleError("fetch", `HTTP ${response.status}: ${args[0]}`);
        }
        return response;
      } catch (error) {
        const url = args[0]?.toString() || "";

        // Skip reporting Firebase, Auth, and monitoring service errors to prevent noise
        if (
          !url.includes("firestore.googleapis.com") &&
          !url.includes("firebase") &&
          !url.includes("identitytoolkit.googleapis.com") &&
          !url.includes("securetoken.googleapis.com") &&
          !url.includes("googleapis.com") &&
          !url.includes("fullstory.com") &&
          !url.includes("www.gstatic.com") &&
          !url.includes("firebaseapp.com") &&
          !url.includes("firebasestorage.app") &&
          !url.includes(".googleapis.") &&
          !url.includes("google") &&
          !url.includes("gcp") &&
          !url.includes("fs.js")
        ) {
          this.handleError("fetch", `Network error: ${args[0]}`);
        }
        throw error;
      }
    };

    // Monitor performance issues
    this.monitorPerformance();

    // Monitor memory usage
    this.monitorMemory();
  }

  private handleError(type: string, message: string) {
    const now = Date.now();
    const key = `${type}-${message.substring(0, 50)}`;

    // Reset count if outside time window
    const lastTime = this.lastErrorTime.get(key) || 0;
    if (now - lastTime > this.TIME_WINDOW) {
      this.errorCounts.set(key, 0);
    }

    // Increment error count
    const count = (this.errorCounts.get(key) || 0) + 1;
    this.errorCounts.set(key, count);
    this.lastErrorTime.set(key, now);

    // Show notification if threshold exceeded
    if (count >= this.ERROR_THRESHOLD) {
      this.showErrorNotification(type, message, count);
      this.errorCounts.set(key, 0); // Reset to avoid spam
    }
  }

  private showErrorNotification(type: string, message: string, count: number) {
    switch (type) {
      case "fetch":
        if (message.includes("HTTP 401") || message.includes("HTTP 403")) {
          AppNotifications.authError();
        } else if (message.includes("HTTP 429")) {
          AppNotifications.rateLimited();
        } else if (message.includes("HTTP 5")) {
          AppNotifications.serviceUnavailable();
        } else {
          AppNotifications.networkError(
            `Repeated network issues detected (${count} times)`,
          );
        }
        break;

      case "console":
        if (message.toLowerCase().includes("permission")) {
          AppNotifications.permissionDenied("Required feature");
        } else if (
          message.toLowerCase().includes("quota") ||
          message.toLowerCase().includes("limit")
        ) {
          AppNotifications.quotaExceeded();
        } else if (
          message.toLowerCase().includes("storage") ||
          message.toLowerCase().includes("localStorage")
        ) {
          AppNotifications.storageError();
        } else {
          AppNotifications.genericError(
            `Repeated errors detected: ${message.substring(0, 100)}...`,
          );
        }
        break;
    }
  }

  private monitorPerformance() {
    // Monitor slow operations
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.duration > 5000) {
          // 5 seconds
          AppNotifications.custom(
            "Performance Issue",
            `Slow operation detected: ${entry.name} took ${Math.round(entry.duration)}ms`,
            "warning",
            { duration: 3000 },
          );
        }
      }
    });

    try {
      observer.observe({ entryTypes: ["measure", "navigation"] });
    } catch (e) {
      // Performance Observer not supported
    }
  }

  private monitorMemory() {
    // Monitor memory usage (if supported)
    if ("memory" in performance) {
      setInterval(() => {
        const memory = (performance as any).memory;
        const usedMB = memory.usedJSHeapSize / 1024 / 1024;
        const limitMB = memory.jsHeapSizeLimit / 1024 / 1024;

        if (usedMB > limitMB * 0.8) {
          // 80% of limit
          AppNotifications.custom(
            "High Memory Usage",
            `App is using ${Math.round(usedMB)}MB of memory. Consider refreshing if experiencing slow performance.`,
            "warning",
            {
              duration: 8000,
              actionText: "Refresh",
              onAction: () => window.location.reload(),
            },
          );
        }
      }, 30000); // Check every 30 seconds
    }
  }

  // Manually report app issues
  reportIssue(category: string, description: string) {
    switch (category.toLowerCase()) {
      case "slow":
        AppNotifications.custom("Performance Issue", description, "warning", {
          duration: 5000,
        });
        break;
      case "error":
        AppNotifications.genericError(description);
        break;
      case "network":
        AppNotifications.networkError(description);
        break;
      default:
        AppNotifications.custom("App Issue", description, "info");
    }
  }

  // Check app health status
  getHealthStatus() {
    const totalErrors = Array.from(this.errorCounts.values()).reduce(
      (sum, count) => sum + count,
      0,
    );

    if (totalErrors === 0) return "healthy";
    if (totalErrors < 5) return "warning";
    return "error";
  }
}

// Initialize health monitoring
const healthMonitor = AppHealthMonitor.getInstance();

// Add global methods for manual issue reporting
declare global {
  interface Window {
    reportAppIssue: (category: string, description: string) => void;
    getAppHealth: () => string;
  }
}

window.reportAppIssue = (category: string, description: string) => {
  healthMonitor.reportIssue(category, description);
};

window.getAppHealth = () => {
  return healthMonitor.getHealthStatus();
};

export default healthMonitor;
