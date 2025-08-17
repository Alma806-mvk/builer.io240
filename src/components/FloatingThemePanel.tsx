import React, { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import EnhancedThemeToggle from "./EnhancedThemeToggle";
import {
  CogIcon,
  XMarkIcon,
  SparklesIcon,
  EyeIcon,
  ComputerDesktopIcon,
  SunIcon,
  MoonIcon,
} from "./IconComponents";

export const FloatingThemePanel: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [position, setPosition] = useState({
    x: window.innerWidth - 80, // Right side, accounting for button width
    y: window.innerHeight - 140, // Above AI assistant (AI assistant is at bottom-6, this places theme panel above it)
  });
  const { actualTheme, themeConfig, isTransitioning } = useTheme();

  // Track the last theme to detect changes
  const [lastTheme, setLastTheme] = useState(actualTheme);

  // Keyboard shortcut to toggle panel
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.altKey && e.key === "t") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);

  // Watch for theme changes and reshow panel if it was hidden
  useEffect(() => {
    if (actualTheme !== lastTheme) {
      setLastTheme(actualTheme);

      // If panel is currently hidden and theme changed, show it again
      if (!isVisible) {
        setIsVisible(true);
        setIsOpen(false); // Close the settings panel but show the button
      }
    }
  }, [actualTheme, lastTheme, isVisible]);

  const getThemeIcon = () => {
    switch (actualTheme) {
      case "light":
        return <SunIcon className="w-4 h-4" />;
      case "dark":
        return <MoonIcon className="w-4 h-4" />;
      case "midnight":
        return <span className="text-sm">🌌</span>;
      case "cosmic":
        return <span className="text-sm">🚀</span>;
      case "ocean":
        return <span className="text-sm">🌊</span>;
      default:
        return <ComputerDesktopIcon className="w-4 h-4" />;
    }
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed bottom-20 right-6 z-50">
      {/* Close button */}
      <button
        onClick={() => setIsVisible(false)}
        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-xs font-bold transition-all duration-200 shadow-lg hover:scale-110 z-10"
        title="Close theme panel"
      >
        ✕
      </button>

      {/* Main toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          relative w-12 h-12 rounded-xl transition-all duration-300
          bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl
          hover:from-slate-700/95 hover:to-slate-800/95
          border border-slate-600/50 hover:border-slate-500/70
          shadow-2xl hover:shadow-3xl
          flex items-center justify-center
          group theme-toggle-glow
          ${isTransitioning ? "animate-pulse" : ""}
          ${isOpen ? "scale-110" : "hover:scale-105"}
        `}
        title={`Theme Settings (Alt+T) - Current: ${themeConfig.name}`}
      >
        {isOpen ? (
          <XMarkIcon className="w-5 h-5 text-slate-300 group-hover:text-white transition-colors" />
        ) : (
          <div className="relative">
            {getThemeIcon()}
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-sky-400 to-purple-400 rounded-full animate-pulse" />
          </div>
        )}

        {/* Ripple effect */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </button>

      {/* Settings panel */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-80 transform transition-all duration-300 ease-out">
          <div
            className="
            bg-slate-800/95 backdrop-blur-xl
            border border-slate-700/50 rounded-2xl
            shadow-2xl shadow-black/50
            p-6 space-y-6
          "
          >
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-sky-500 to-purple-500 rounded-lg flex items-center justify-center">
                  <SparklesIcon className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">Theme Settings</h3>
                  <p className="text-slate-400 text-xs">
                    Customize your experience
                  </p>
                </div>
              </div>
              <div className="text-xs text-slate-500 bg-slate-700/50 px-2 py-1 rounded-md">
                Alt+T
              </div>
            </div>

            {/* Current theme info */}
            <div className="p-4 bg-slate-700/30 border border-slate-600/30 rounded-xl">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-lg">{themeConfig.emoji}</span>
                <div>
                  <div className="text-white font-medium">
                    {themeConfig.name}
                  </div>
                  <div className="text-slate-400 text-xs">
                    {themeConfig.description}
                  </div>
                </div>
              </div>

              {/* Mini color palette */}
              <div className="flex gap-1 mt-3">
                <div
                  className="w-6 h-6 rounded border border-slate-600/50"
                  style={{ background: themeConfig.colors.accentPrimary }}
                />
                <div
                  className="w-6 h-6 rounded border border-slate-600/50"
                  style={{ background: themeConfig.colors.accentSecondary }}
                />
                <div
                  className="w-6 h-6 rounded border border-slate-600/50"
                  style={{ background: themeConfig.gradients.primary }}
                />
              </div>
            </div>

            {/* Theme selector */}
            <EnhancedThemeToggle variant="dropdown" showLabel={false} />

            {/* Quick actions */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => {
                  // Create theme particles effect
                  const particles = document.createElement("div");
                  particles.className = "theme-particles";
                  document.body.appendChild(particles);

                  for (let i = 0; i < 20; i++) {
                    const particle = document.createElement("div");
                    particle.className = "theme-particle";
                    particle.style.left = Math.random() * 100 + "%";
                    particle.style.top = Math.random() * 100 + "%";
                    particle.style.animationDelay = Math.random() * 2 + "s";
                    particles.appendChild(particle);
                  }

                  setTimeout(() => particles.remove(), 3000);
                }}
                className="flex items-center gap-2 px-3 py-2 bg-slate-700/50 hover:bg-slate-600/50 border border-slate-600/50 rounded-lg transition-all text-sm text-slate-300 hover:text-white"
              >
                <SparklesIcon className="w-4 h-4" />
                Effects
              </button>

              <button
                onClick={() => {
                  // Toggle preview mode
                  const overlay = document.createElement("div");
                  overlay.className = "theme-preview-overlay active";
                  document.body.appendChild(overlay);
                  setTimeout(() => overlay.remove(), 2000);
                }}
                className="flex items-center gap-2 px-3 py-2 bg-slate-700/50 hover:bg-slate-600/50 border border-slate-600/50 rounded-lg transition-all text-sm text-slate-300 hover:text-white"
              >
                <EyeIcon className="w-4 h-4" />
                Preview
              </button>
            </div>

            {/* Tips */}
            <div className="text-xs text-slate-400 bg-slate-700/20 p-3 rounded-lg">
              <div className="font-medium text-slate-300 mb-1">
                💡 Pro Tips:
              </div>
              <div>• Themes sync with your system preference</div>
              <div>• Use Alt+T to quickly access theme settings</div>
              <div>• Hover over themes to preview them</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FloatingThemePanel;
