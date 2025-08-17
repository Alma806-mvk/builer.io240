import React, { useEffect } from "react";

interface GlobalErrorHandlersProps {
  children: React.ReactNode;
}

export const GlobalErrorHandlers: React.FC<GlobalErrorHandlersProps> = ({
  children,
}) => {
  useEffect(() => {
    // Global error handler for Builder.io environment
    if (
      typeof window !== "undefined" &&
      window.location.hostname.includes("builder.codes")
    ) {
      // Suppress fetch errors that are expected in Builder.io environment
      const originalConsoleError = console.error;
      console.error = (...args) => {
        const message = args[0]?.toString() || "";
        if (
          message.includes("Failed to fetch") ||
          message.includes("NetworkError") ||
          message.includes("CORS")
        ) {
          // Convert to warning for expected network errors
          console.warn(
            "🟡 Expected network restriction in Builder.io environment:",
            ...args,
          );
          return;
        }
        originalConsoleError(...args);
      };

      // Handle unhandled promise rejections from Firebase
      const handleFirebaseRejection = (event: PromiseRejectionEvent) => {
        const error = event.reason;
        if (
          error?.message?.includes("Failed to fetch") ||
          error?.message?.includes("NetworkError")
        ) {
          console.warn(
            "🟡 Handled Firebase network error in Builder.io environment:",
            error.message,
          );
          event.preventDefault(); // Prevent the error from being logged as unhandled
        }
      };

      window.addEventListener("unhandledrejection", handleFirebaseRejection);

      return () => {
        window.removeEventListener(
          "unhandledrejection",
          handleFirebaseRejection,
        );
        console.error = originalConsoleError;
      };
    }
  }, []);

  useEffect(() => {
    // Global error handler for INTERNAL Firebase Function errors
    const handleInternalErrors = (event: PromiseRejectionEvent) => {
      const error = event.reason;
      if (
        error?.message?.includes("INTERNAL") ||
        error?.code === "internal" ||
        error?.toString?.().includes("INTERNAL")
      ) {
        console.warn("🚨 Caught global INTERNAL error:", error);

        // Show user-friendly notification
        const notification = document.createElement("div");
        notification.style.cssText = `
          position: fixed;
          top: 20px;
          right: 20px;
          background: linear-gradient(135deg, #dc2626, #b91c1c);
          color: white;
          padding: 16px 20px;
          border-radius: 12px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.3);
          z-index: 10000;
          font-family: system-ui, sans-serif;
          font-size: 14px;
          max-width: 350px;
          border: 1px solid rgba(255,255,255,0.2);
        `;
        notification.innerHTML = `
          <div style="display: flex; align-items: center; margin-bottom: 8px;">
            <span style="font-size: 20px; margin-right: 8px;">⚠️</span>
            <strong>Service Temporarily Unavailable</strong>
          </div>
          <p style="margin: 0; line-height: 1.4; opacity: 0.9;">
            Payment services are being configured. Please try again in a few moments.
          </p>
        `;
        document.body.appendChild(notification);

        // Remove notification after 5 seconds
        setTimeout(() => {
          if (document.body.contains(notification)) {
            notification.style.transition = "opacity 0.5s ease";
            notification.style.opacity = "0";
            setTimeout(() => {
              if (document.body.contains(notification)) {
                document.body.removeChild(notification);
              }
            }, 500);
          }
        }, 5000);

        event.preventDefault(); // Prevent the error from being logged as unhandled
      }
    };

    window.addEventListener("unhandledrejection", handleInternalErrors);

    return () => {
      window.removeEventListener("unhandledrejection", handleInternalErrors);
    };
  }, []);

  return <>{children}</>;
};

export default GlobalErrorHandlers;
