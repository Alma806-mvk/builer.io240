import notificationManager from "./notificationSystem";

// Common app problem notifications
export const AppNotifications = {
  // Network and connectivity issues
  networkError: (details?: string) => {
    notificationManager.show({
      type: "error",
      title: "Connection Problem",
      message:
        details ||
        "Unable to connect to server. Please check your internet connection.",
      icon: "🌐",
      duration: 8000,
      actionText: "Retry",
      onAction: () => window.location.reload(),
    });
  },

  // Authentication issues
  authError: (details?: string) => {
    notificationManager.show({
      type: "warning",
      title: "Authentication Issue",
      message: details || "Your session has expired. Please sign in again.",
      icon: "🔐",
      duration: 0, // Don't auto-dismiss
      actionText: "Sign In",
      onAction: () => {
        // Trigger sign in flow
        window.location.href = "/auth";
      },
    });
  },

  // API rate limiting
  rateLimited: () => {
    notificationManager.show({
      type: "warning",
      title: "Rate Limit Exceeded",
      message: "Too many requests. Please wait a moment before trying again.",
      icon: "⏱️",
      duration: 6000,
    });
  },

  // Service unavailable
  serviceUnavailable: (serviceName?: string) => {
    notificationManager.show({
      type: "error",
      title: "Service Unavailable",
      message: `${serviceName || "The service"} is temporarily unavailable. Please try again later.`,
      icon: "🔧",
      duration: 10000,
      actionText: "Check Status",
      onAction: () => window.open("https://status.example.com", "_blank"),
    });
  },

  // Quota exceeded (for APIs like Gemini)
  quotaExceeded: () => {
    notificationManager.show({
      type: "warning",
      title: "Quota Exceeded",
      message:
        "Daily API quota reached. Service will resume tomorrow or upgrade your plan.",
      icon: "📊",
      duration: 0,
      actionText: "Upgrade",
      onAction: () => {
        // Navigate to pricing page
        window.location.href = "/pricing";
      },
    });
  },

  // Browser compatibility issues
  browserNotSupported: () => {
    notificationManager.show({
      type: "warning",
      title: "Browser Compatibility",
      message:
        "Some features may not work properly in your browser. Please update or switch to a modern browser.",
      icon: "🌍",
      duration: 0,
      actionText: "Learn More",
      onAction: () => window.open("https://browsehappy.com/", "_blank"),
    });
  },

  // Local storage issues
  storageError: () => {
    notificationManager.show({
      type: "error",
      title: "Storage Problem",
      message:
        "Unable to save data locally. Please check your browser settings and clear cache if needed.",
      icon: "💾",
      duration: 8000,
      actionText: "Clear Cache",
      onAction: () => {
        localStorage.clear();
        sessionStorage.clear();
        window.location.reload();
      },
    });
  },

  // Permission issues (microphone, camera, etc.)
  permissionDenied: (permission: string) => {
    notificationManager.show({
      type: "warning",
      title: "Permission Required",
      message: `${permission} access is required for this feature. Please allow permission and try again.`,
      icon: "🔒",
      duration: 8000,
      actionText: "Settings",
      onAction: () => {
        // Open browser settings or show help
        notificationManager.show({
          type: "info",
          title: "Grant Permissions",
          message:
            "Click the camera/microphone icon in your address bar to grant permissions.",
          duration: 10000,
        });
      },
    });
  },

  // Subscription/payment issues
  paymentFailed: () => {
    notificationManager.show({
      type: "error",
      title: "Payment Failed",
      message:
        "Your payment could not be processed. Please update your payment method.",
      icon: "💳",
      duration: 0,
      actionText: "Update Payment",
      onAction: () => {
        // Navigate to billing page
        window.location.href = "/billing";
      },
    });
  },

  // Feature temporarily disabled
  featureDisabled: (featureName: string, reason?: string) => {
    notificationManager.show({
      type: "info",
      title: "Feature Temporarily Unavailable",
      message: `${featureName} is currently disabled${reason ? `: ${reason}` : ". We're working to restore it soon."}`,
      icon: "🚧",
      duration: 8000,
    });
  },

  // Maintenance mode
  maintenanceMode: () => {
    notificationManager.show({
      type: "info",
      title: "Maintenance Mode",
      message:
        "The app is currently under maintenance. Some features may be limited.",
      icon: "🔧",
      duration: 0,
      position: "top-center",
    });
  },

  // Success notifications
  operationSuccess: (operation: string) => {
    notificationManager.show({
      type: "success",
      title: "Success!",
      message: `${operation} completed successfully.`,
      duration: 3000,
    });
  },

  // Data saved successfully
  dataSaved: () => {
    notificationManager.show({
      type: "success",
      title: "Saved",
      message: "Your changes have been saved successfully.",
      icon: "💾",
      duration: 2000,
      position: "bottom-right",
    });
  },

  // Update available
  updateAvailable: () => {
    notificationManager.show({
      type: "info",
      title: "Update Available",
      message:
        "A new version is available. Refresh to get the latest features.",
      icon: "🔄",
      duration: 0,
      actionText: "Refresh",
      onAction: () => window.location.reload(),
      position: "bottom-center",
    });
  },

  // Generic error with retry
  genericError: (message: string, canRetry = true) => {
    notificationManager.show({
      type: "error",
      title: "Something went wrong",
      message,
      duration: canRetry ? 8000 : 5000,
      actionText: canRetry ? "Try Again" : undefined,
      onAction: canRetry ? () => window.location.reload() : undefined,
    });
  },

  // Credits/usage related
  creditsRunningLow: (remaining: number) => {
    notificationManager.show({
      type: "warning",
      title: "Credits Running Low",
      message: `You have ${remaining} credits remaining. Consider purchasing more to continue using premium features.`,
      icon: "⚡",
      duration: 10000,
      actionText: "Buy Credits",
      onAction: () => {
        // Navigate to credit purchase page
        window.location.href = "/credits";
      },
    });
  },

  // Custom notification for any app problem
  custom: (
    title: string,
    message: string,
    type: "error" | "warning" | "info" | "success" = "info",
    options?: any,
  ) => {
    notificationManager.show({
      type,
      title,
      message,
      duration: 5000,
      ...options,
    });
  },
};

// Global error handler for unhandled errors
window.addEventListener("error", (event) => {
  console.error("Global error:", event.error);

  AppNotifications.genericError(
    "An unexpected error occurred. The page will reload automatically.",
    true,
  );

  // Auto-reload after 3 seconds for critical errors
  setTimeout(() => {
    window.location.reload();
  }, 3000);
});

// Global promise rejection handler
window.addEventListener("unhandledrejection", (event) => {
  console.error("Unhandled promise rejection:", event.reason);

  // Only show notification for non-Firebase errors (Firebase errors are handled separately)
  if (
    !event.reason?.message?.includes("Firebase") &&
    !event.reason?.message?.includes("auth/")
  ) {
    AppNotifications.genericError(
      "A background operation failed. Some features may not work correctly.",
      false,
    );
  }
});

export default AppNotifications;
