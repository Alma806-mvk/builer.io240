import React, { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";

const FloatingThemeToggle: React.FC = () => {
  const { theme, actualTheme, themeConfig, toggleTheme, isTransitioning } =
    useTheme();

  const [isNotificationVisible, setIsNotificationVisible] = useState(false);
  const [isButtonVisible, setIsButtonVisible] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);
  const [hideTimer, setHideTimer] = useState<NodeJS.Timeout | null>(null);

  // Show the toggle when theme changes
  useEffect(() => {
    // Always show button and notification when theme changes
    setIsButtonVisible(true);
    setIsAnimating(true);
    setIsNotificationVisible(true);

    // Clear any existing timer
    if (hideTimer) {
      clearTimeout(hideTimer);
    }

    // Hide notification after 4 seconds
    const newHideTimer = setTimeout(() => {
      setIsNotificationVisible(false);
    }, 4000);

    setHideTimer(newHideTimer);

    // Stop animation after 800ms for smoother effect
    const animationTimer = setTimeout(() => {
      setIsAnimating(false);
    }, 800);

    return () => {
      if (newHideTimer) clearTimeout(newHideTimer);
      clearTimeout(animationTimer);
    };
  }, [actualTheme]);

  // Handle manual dismiss - hide both notification and button
  const handleDismiss = () => {
    setIsNotificationVisible(false);
    setIsButtonVisible(false);
    if (hideTimer) {
      clearTimeout(hideTimer);
    }
  };

  // Get current theme emoji
  const getThemeEmoji = () => {
    const themeEmojis = {
      light: "☀️",
      dark: "🌙",
      midnight: "🌌",
      cosmic: "🚀",
      ocean: "🌊",
    };
    return themeEmojis[actualTheme] || "🌙";
  };

  return (
    <>
      {/* Floating Toggle Button - Visible when not dismissed */}
      {isButtonVisible && (
        <div className="fixed bottom-6 left-6 z-50 flex flex-col items-start gap-2">
          <button
            onClick={toggleTheme}
            className={`
              w-14 h-14 rounded-full transition-all duration-500 ease-out
              bg-gradient-to-br from-slate-700/90 to-slate-800/90
              hover:from-slate-600/95 hover:to-slate-700/95
              border border-slate-600/60 hover:border-slate-500/80
              shadow-xl hover:shadow-2xl backdrop-blur-sm
              flex items-center justify-center
              group cursor-pointer transform-gpu
              ${isAnimating ? "animate-bounce shadow-2xl shadow-blue-500/50 border-blue-400/70 scale-110" : "hover:scale-105"}
            `}
            title={`Current: ${themeConfig.name} - Click to change`}
          >
            <span
              className={`
                emoji-icon text-2xl transition-all duration-500 ease-out select-none
                flex items-center justify-center text-white transform-gpu
                group-hover:scale-110
                ${isAnimating ? "animate-bounce scale-125" : ""}
              `}
              style={{
                fontSize: "1.75rem",
                lineHeight: 1,
                minWidth: "1.75rem",
                minHeight: "1.75rem",
                filter: "brightness(1.2) contrast(1.1)",
                textShadow: "0 0 12px rgba(255,255,255,0.4)",
              }}
            >
              {getThemeEmoji()}
            </span>

            {/* Animation effects */}
            {(isTransitioning || isAnimating) && (
              <div
                className={`
                absolute inset-0 rounded-full transition-all duration-500 ease-out
                ${
                  isAnimating
                    ? "bg-gradient-to-r from-blue-500/20 via-purple-500/30 to-blue-500/20 animate-pulse"
                    : "bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"
                }
              `}
              />
            )}

            {isAnimating && (
              <>
                <div className="absolute inset-0 rounded-full border-2 border-blue-400/50 animate-ping opacity-75" />
                <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-md animate-pulse opacity-60" />
              </>
            )}
          </button>

          {/* Dismiss button - small X next to the main button */}
          <button
            onClick={handleDismiss}
            className="
              w-6 h-6 rounded-full transition-all duration-300 ease-out
              bg-slate-600/80 hover:bg-slate-500/90
              border border-slate-500/50 hover:border-slate-400/70
              shadow-lg hover:shadow-xl backdrop-blur-sm
              flex items-center justify-center
              group cursor-pointer transform-gpu
              hover:scale-110 active:scale-95
              opacity-80 hover:opacity-100
            "
            title="Hide theme toggle until next theme change"
          >
            <span className="text-slate-200 group-hover:text-white text-sm font-bold leading-none">
              ×
            </span>
          </button>
        </div>
      )}

      {/* Theme Change Notification - Shows temporarily when theme changes */}
      {isNotificationVisible && isButtonVisible && (
        <div
          className={`
            fixed bottom-32 left-6 z-40
            px-4 py-3 rounded-xl transition-all duration-700 ease-out
            bg-gradient-to-r from-slate-800/95 to-slate-700/95
            border border-slate-600/60 shadow-2xl backdrop-blur-sm
            transform-gpu max-w-xs
            ${isNotificationVisible ? "translate-y-0 opacity-100 scale-100" : "translate-y-4 opacity-0 scale-95"}
          `}
        >
          <div className="flex items-center gap-3">
            <span
              className={`
                emoji-icon text-xl transition-all duration-500 ease-out
                ${isAnimating ? "animate-bounce" : ""}
              `}
              style={{
                filter: "brightness(1.2) contrast(1.1)",
                textShadow: "0 0 8px rgba(255,255,255,0.3)",
              }}
            >
              {getThemeEmoji()}
            </span>
            <div className="flex-1">
              <div className="text-white font-medium text-sm">
                {themeConfig.name}
              </div>
              <div className="text-slate-400 text-xs">
                {themeConfig.description}
              </div>
            </div>

            {/* X button to dismiss notification only */}
            <button
              onClick={() => setIsNotificationVisible(false)}
              className="
                ml-2 w-5 h-5 rounded-full
                bg-slate-600/50 hover:bg-slate-500/70
                border border-slate-500/30 hover:border-slate-400/50
                flex items-center justify-center
                transition-all duration-300 ease-out
                group cursor-pointer
                hover:scale-110 active:scale-95
              "
              title="Dismiss notification only"
            >
              <span className="text-slate-300 group-hover:text-white text-xs font-bold leading-none">
                ×
              </span>
            </button>
          </div>

          {/* Progress bar showing how long notification will remain */}
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-600/30 rounded-b-xl overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-b-xl transition-all duration-300"
              style={{
                animation: "shrink 4000ms linear forwards",
              }}
            />
          </div>
        </div>
      )}

      {/* CSS Animation for progress bar */}
      <style>{`
        @keyframes shrink {
          from {
            width: 100%;
            opacity: 0.8;
          }
          to {
            width: 0%;
            opacity: 0.3;
          }
        }

        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
          100% {
            transform: translateX(100%);
            opacity: 0;
          }
        }

        .animate-shimmer {
          animation: shimmer 2s ease-in-out infinite;
        }

        /* Smooth bounce animation */
        @keyframes smooth-bounce {
          0%, 100% {
            transform: translateY(0);
            animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
          }
          50% {
            transform: translateY(-25%);
            animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
          }
        }

        .animate-smooth-bounce {
          animation: smooth-bounce 1s ease-in-out 2;
        }
      `}</style>
    </>
  );
};

export default FloatingThemeToggle;
