import React from "react";

export type NotificationType = "error" | "warning" | "info" | "success";

export interface NotificationOptions {
  type: NotificationType;
  title: string;
  message: string;
  duration?: number; // Auto-dismiss after milliseconds, 0 = no auto-dismiss
  icon?: string;
  actionText?: string;
  onAction?: () => void;
  position?:
    | "top-right"
    | "top-left"
    | "bottom-right"
    | "bottom-left"
    | "top-center";
}

class NotificationManager {
  private notifications: Set<HTMLElement> = new Set();
  private notificationId = 0;

  // Theme configurations for different notification types
  private getThemeConfig(type: NotificationType) {
    const themes = {
      error: {
        gradient: "linear-gradient(135deg, #dc2626, #b91c1c)",
        icon: "🚨",
        borderColor: "rgba(220, 38, 38, 0.3)",
        shadowColor: "rgba(220, 38, 38, 0.2)",
      },
      warning: {
        gradient: "linear-gradient(135deg, #f59e0b, #d97706)",
        icon: "⚠️",
        borderColor: "rgba(245, 158, 11, 0.3)",
        shadowColor: "rgba(245, 158, 11, 0.2)",
      },
      info: {
        gradient: "linear-gradient(135deg, #3b82f6, #2563eb)",
        icon: "ℹ️",
        borderColor: "rgba(59, 130, 246, 0.3)",
        shadowColor: "rgba(59, 130, 246, 0.2)",
      },
      success: {
        gradient: "linear-gradient(135deg, #10b981, #059669)",
        icon: "✅",
        borderColor: "rgba(16, 185, 129, 0.3)",
        shadowColor: "rgba(16, 185, 129, 0.2)",
      },
    };
    return themes[type];
  }

  // Get position styles
  private getPositionStyles(position: string) {
    const positions = {
      "top-right": { top: "80px", right: "20px" },
      "top-left": { top: "80px", left: "20px" },
      "bottom-right": { bottom: "20px", right: "20px" },
      "bottom-left": { bottom: "20px", left: "20px" },
      "top-center": { top: "80px", left: "50%", transform: "translateX(-50%)" },
    };
    return (
      positions[position as keyof typeof positions] || positions["top-right"]
    );
  }

  show(options: NotificationOptions): void {
    const {
      type,
      title,
      message,
      duration = 5000,
      icon,
      actionText,
      onAction,
      position = "top-right",
    } = options;

    const theme = this.getThemeConfig(type);
    const positionStyles = this.getPositionStyles(position);
    const notificationId = ++this.notificationId;

    // Create notification element
    const notification = document.createElement("div");
    notification.id = `notification-${notificationId}`;

    // Base styles
    const baseStyles = {
      position: "fixed",
      zIndex: "9999",
      maxWidth: "400px",
      minWidth: "320px",
      opacity: "0",
      transform: position.includes("right")
        ? "translateX(100%)"
        : position.includes("left")
          ? "translateX(-100%)"
          : position.includes("center")
            ? "translateX(-50%) translateY(-20px)"
            : "translateY(-20px)",
      transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
      background: theme.gradient,
      color: "white",
      borderRadius: "12px",
      boxShadow: `0 8px 32px ${theme.shadowColor}, 0 4px 12px rgba(0,0,0,0.15)`,
      border: `1px solid ${theme.borderColor}`,
      backdropFilter: "blur(12px)",
      overflow: "hidden",
      cursor: "pointer",
      ...positionStyles,
    };

    // Apply styles
    Object.assign(notification.style, baseStyles);

    // Create notification content
    notification.innerHTML = `
      <div style="padding: 16px; position: relative;">
        <!-- Close button -->
        <button 
          onclick="window.notificationManager.dismiss('${notification.id}')"
          style="
            position: absolute;
            top: 8px;
            right: 8px;
            background: rgba(255,255,255,0.2);
            border: none;
            color: white;
            width: 24px;
            height: 24px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            cursor: pointer;
            transition: all 0.2s ease;
          "
          onmouseover="this.style.background='rgba(255,255,255,0.3)'"
          onmouseout="this.style.background='rgba(255,255,255,0.2)'"
        >×</button>

        <!-- Icon and content -->
        <div style="display: flex; align-items: flex-start; gap: 12px; margin-right: 20px;">
          <div style="
            font-size: 20px; 
            line-height: 1; 
            margin-top: 2px;
            filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));
          ">
            ${icon || theme.icon}
          </div>
          
          <div style="flex: 1; min-width: 0;">
            <div style="
              font-weight: 600; 
              font-size: 14px; 
              margin-bottom: 4px;
              text-shadow: 0 1px 2px rgba(0,0,0,0.2);
            ">
              ${title}
            </div>
            <div style="
              font-size: 13px; 
              opacity: 0.95; 
              line-height: 1.4;
              text-shadow: 0 1px 2px rgba(0,0,0,0.1);
            ">
              ${message}
            </div>
            
            ${
              actionText && onAction
                ? `
              <button 
                onclick="${onAction.toString()}" 
                style="
                  background: rgba(255,255,255,0.2);
                  border: 1px solid rgba(255,255,255,0.3);
                  color: white;
                  padding: 6px 12px;
                  border-radius: 6px;
                  font-size: 12px;
                  font-weight: 500;
                  margin-top: 8px;
                  cursor: pointer;
                  transition: all 0.2s ease;
                "
                onmouseover="this.style.background='rgba(255,255,255,0.3)'"
                onmouseout="this.style.background='rgba(255,255,255,0.2)'"
              >
                ${actionText}
              </button>
            `
                : ""
            }
          </div>
        </div>

        <!-- Progress bar for auto-dismiss -->
        ${
          duration > 0
            ? `
          <div style="
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            height: 3px;
            background: rgba(255,255,255,0.2);
          ">
            <div 
              id="progress-${notificationId}" 
              style="
                height: 100%;
                background: rgba(255,255,255,0.6);
                width: 100%;
                transition: width ${duration}ms linear;
                border-radius: 0 0 12px 12px;
              "
            ></div>
          </div>
        `
            : ""
        }
      </div>
    `;

    // Add click to dismiss
    notification.addEventListener("click", (e) => {
      if (
        e.target === notification ||
        (e.target as Element).closest(".notification-content")
      ) {
        this.dismiss(notification.id);
      }
    });

    // Add to DOM
    document.body.appendChild(notification);
    this.notifications.add(notification);

    // Animate in
    requestAnimationFrame(() => {
      notification.style.opacity = "1";
      if (position.includes("right")) {
        notification.style.transform = "translateX(0)";
      } else if (position.includes("left")) {
        notification.style.transform = "translateX(0)";
      } else if (position.includes("center")) {
        notification.style.transform = "translateX(-50%) translateY(0)";
      } else {
        notification.style.transform = "translateY(0)";
      }
    });

    // Start progress bar animation
    if (duration > 0) {
      const progressBar = document.getElementById(`progress-${notificationId}`);
      if (progressBar) {
        setTimeout(() => {
          progressBar.style.width = "0%";
        }, 100);
      }
    }

    // Auto-dismiss
    if (duration > 0) {
      setTimeout(() => {
        this.dismiss(notification.id);
      }, duration);
    }

    // Add shake animation on serious errors
    if (type === "error") {
      notification.style.animation = "shake 0.5s ease-in-out";
    }
  }

  dismiss(notificationId: string): void {
    const notification = document.getElementById(notificationId);
    if (!notification) return;

    const position = notification.style.right
      ? "right"
      : notification.style.left &&
          !notification.style.transform.includes("translateX(-50%)")
        ? "left"
        : "center";

    // Animate out
    notification.style.opacity = "0";
    if (position === "right") {
      notification.style.transform = "translateX(100%)";
    } else if (position === "left") {
      notification.style.transform = "translateX(-100%)";
    } else {
      notification.style.transform = "translateX(-50%) translateY(-20px)";
    }

    // Remove after animation
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
        this.notifications.delete(notification);
      }
    }, 400);
  }

  // Clear all notifications
  dismissAll(): void {
    this.notifications.forEach((notification) => {
      this.dismiss(notification.id);
    });
  }
}

// Create global instance
const notificationManager = new NotificationManager();

// Add to window for global access
declare global {
  interface Window {
    notificationManager: NotificationManager;
  }
}
window.notificationManager = notificationManager;

// CSS for shake animation
const style = document.createElement("style");
style.textContent = `
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-5px); }
    75% { transform: translateX(5px); }
  }
`;
document.head.appendChild(style);

export default notificationManager;
