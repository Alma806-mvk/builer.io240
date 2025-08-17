import React from "react";
import AppNotifications from "../utils/appNotifications";

export const NotificationDemo: React.FC = () => {
  const demoNotifications = [
    {
      title: "Network Error",
      description: "Connection problem simulation",
      action: () =>
        AppNotifications.networkError(
          "Unable to connect to server. Please check your internet connection.",
        ),
      color: "bg-red-500",
    },
    {
      title: "Authentication Issue",
      description: "Session expired simulation",
      action: () =>
        AppNotifications.authError(
          "Your session has expired. Please sign in again.",
        ),
      color: "bg-orange-500",
    },
    {
      title: "Rate Limited",
      description: "Too many requests",
      action: () => AppNotifications.rateLimited(),
      color: "bg-yellow-500",
    },
    {
      title: "Service Unavailable",
      description: "Service down simulation",
      action: () => AppNotifications.serviceUnavailable("AI Generation"),
      color: "bg-red-600",
    },
    {
      title: "Quota Exceeded",
      description: "API quota reached",
      action: () => AppNotifications.quotaExceeded(),
      color: "bg-orange-600",
    },
    {
      title: "Browser Not Supported",
      description: "Compatibility issue",
      action: () => AppNotifications.browserNotSupported(),
      color: "bg-purple-500",
    },
    {
      title: "Storage Error",
      description: "Local storage problem",
      action: () => AppNotifications.storageError(),
      color: "bg-red-700",
    },
    {
      title: "Permission Denied",
      description: "Camera/microphone access",
      action: () => AppNotifications.permissionDenied("Camera"),
      color: "bg-orange-400",
    },
    {
      title: "Payment Failed",
      description: "Payment processing error",
      action: () => AppNotifications.paymentFailed(),
      color: "bg-red-400",
    },
    {
      title: "Feature Disabled",
      description: "Temporary feature unavailable",
      action: () =>
        AppNotifications.featureDisabled(
          "Advanced Analytics",
          "undergoing maintenance",
        ),
      color: "bg-blue-500",
    },
    {
      title: "Maintenance Mode",
      description: "App under maintenance",
      action: () => AppNotifications.maintenanceMode(),
      color: "bg-blue-600",
    },
    {
      title: "Operation Success",
      description: "Successful operation",
      action: () => AppNotifications.operationSuccess("File upload"),
      color: "bg-green-500",
    },
    {
      title: "Data Saved",
      description: "Changes saved successfully",
      action: () => AppNotifications.dataSaved(),
      color: "bg-green-600",
    },
    {
      title: "Update Available",
      description: "New version available",
      action: () => AppNotifications.updateAvailable(),
      color: "bg-blue-400",
    },
    {
      title: "Credits Running Low",
      description: "Low credit warning",
      action: () => AppNotifications.creditsRunningLow(5),
      color: "bg-yellow-600",
    },
    {
      title: "Custom Error",
      description: "Generic error example",
      action: () =>
        AppNotifications.genericError(
          "Something unexpected happened while processing your request.",
        ),
      color: "bg-gray-500",
    },
  ];

  return (
    <div className="p-6 bg-slate-800 rounded-lg">
      <h2 className="text-xl font-bold text-white mb-4">
        🔔 Notification System Demo
      </h2>
      <p className="text-slate-300 mb-6">
        Click any button to see the notification in action with beautiful
        animations!
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {demoNotifications.map((demo, index) => (
          <button
            key={index}
            onClick={demo.action}
            className={`${demo.color} hover:scale-105 transform transition-all duration-200 text-white p-3 rounded-lg text-left shadow-lg hover:shadow-xl`}
          >
            <div className="font-semibold text-sm">{demo.title}</div>
            <div className="text-xs opacity-90 mt-1">{demo.description}</div>
          </button>
        ))}
      </div>

      <div className="mt-6 p-4 bg-slate-700 rounded-lg">
        <h3 className="text-white font-semibold mb-2">
          🎛️ Notification Controls
        </h3>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => window.notificationManager?.dismissAll()}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm transition-colors"
          >
            Clear All Notifications
          </button>
          <button
            onClick={() => {
              // Show multiple notifications at once
              setTimeout(
                () => AppNotifications.operationSuccess("First task"),
                0,
              );
              setTimeout(() => AppNotifications.dataSaved(), 500);
              setTimeout(() => AppNotifications.creditsRunningLow(3), 1000);
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm transition-colors"
          >
            Show Multiple
          </button>
          <button
            onClick={() => {
              AppNotifications.custom(
                "Custom Notification",
                "This is a completely custom notification with custom styling!",
                "info",
                {
                  icon: "🎨",
                  duration: 8000,
                  position: "top-center",
                  actionText: "Cool!",
                  onAction: () =>
                    AppNotifications.operationSuccess(
                      "You clicked the custom action!",
                    ),
                },
              );
            }}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded text-sm transition-colors"
          >
            Custom Notification
          </button>
        </div>
      </div>

      <div className="mt-4 text-xs text-slate-400">
        <p>
          💡 <strong>Pro tip:</strong> Double-click the developer mode button
          (⚙) in the header for random notification testing!
        </p>
      </div>
    </div>
  );
};

export default NotificationDemo;
