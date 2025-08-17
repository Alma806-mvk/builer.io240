import React, { Component, ReactNode } from "react";
import AppNotifications from "../utils/appNotifications";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: any;
}

class FirebaseErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.info("Firebase Error Boundary caught an error:", error);

    this.setState({
      error,
      errorInfo,
    });

    // Handle specific Firebase errors
    if (
      error.message?.includes("Firebase") ||
      error.message?.includes("auth/network-request-failed") ||
      error.message?.includes("insufficient permissions")
    ) {
      console.info(
        "Firebase service temporarily unavailable - app will continue in offline mode",
      );

      // Show user-friendly notification
      AppNotifications.custom(
        "Connection Issue",
        "Some features may be limited. The app will work offline.",
        "info",
        {
          icon: "ℹ️",
          duration: 5000,
          actionText: "Retry",
          onAction: () => {
            this.setState({
              hasError: false,
              error: null,
              errorInfo: null,
            });
            window.location.reload();
          },
        },
      );
    }
  }

  render() {
    if (this.state.hasError) {
      // Render fallback UI that allows the app to continue
      return (
        <div
          style={{
            padding: "1rem",
            background: "rgba(59, 130, 246, 0.1)",
            border: "1px solid rgba(59, 130, 246, 0.3)",
            borderRadius: "0.5rem",
            margin: "1rem",
            color: "#e2e8f0",
          }}
        >
          <h3 style={{ color: "#3b82f6", marginBottom: "0.5rem" }}>
            ℹ️ Service Temporarily Unavailable
          </h3>
          <p style={{ fontSize: "0.875rem", marginBottom: "1rem" }}>
            Some backend services are temporarily unavailable. The app will
            continue to work with limited functionality.
          </p>
          <button
            onClick={() => {
              this.setState({
                hasError: false,
                error: null,
                errorInfo: null,
              });
              window.location.reload();
            }}
            style={{
              background: "#3b82f6",
              color: "white",
              border: "none",
              borderRadius: "0.375rem",
              padding: "0.5rem 1rem",
              cursor: "pointer",
              fontSize: "0.875rem",
            }}
          >
            Retry Connection
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default FirebaseErrorBoundary;
