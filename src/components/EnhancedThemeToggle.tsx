import React, { useState } from "react";
import { useTheme, ThemeMode, THEME_PRESETS } from "../context/ThemeContext";
import {
  ChevronDownIcon,
  CheckIcon,
  ComputerDesktopIcon,
} from "./IconComponents";

interface EnhancedThemeToggleProps {
  variant?: "compact" | "full" | "dropdown";
  showLabel?: boolean;
  className?: string;
}

export const EnhancedThemeToggle: React.FC<EnhancedThemeToggleProps> = ({
  variant = "full",
  showLabel = true,
  className = "",
}) => {
  const {
    theme,
    actualTheme,
    setTheme,
    themeConfig,
    isSystemDarkMode,
    isTransitioning,
    toggleTheme,
    previewTheme,
    stopPreview,
    isPreviewMode,
  } = useTheme();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Trigger animation when theme changes
  React.useEffect(() => {
    setIsAnimating(true);
    const timer = setTimeout(() => setIsAnimating(false), 600);
    return () => clearTimeout(timer);
  }, [actualTheme]);

  const themeOptions: {
    value: ThemeMode;
    label: string;
    emoji: string;
    description: string;
  }[] = [
    {
      value: "auto",
      label: "Auto",
      emoji: "🔄",
      description: "Follow system preference",
    },
    ...Object.entries(THEME_PRESETS).map(([key, config]) => ({
      value: key as ThemeMode,
      label: config.name,
      emoji: config.emoji,
      description: config.description,
    })),
  ];

  const currentOption =
    themeOptions.find((opt) => opt.value === theme) || themeOptions[0];

  if (variant === "compact") {
    return (
      <button
        onClick={toggleTheme}
        className={`
          relative w-12 h-12 rounded-xl transition-all duration-300
          bg-gradient-to-br from-slate-700/80 to-slate-800/80
          hover:from-slate-600/90 hover:to-slate-700/90
          border border-slate-600/50 hover:border-slate-500/70
          shadow-lg hover:shadow-xl
          flex items-center justify-center
          ${isTransitioning ? "animate-pulse" : ""}
          ${isAnimating ? "animate-bounce shadow-2xl shadow-blue-500/50 border-blue-400/70" : ""}
          ${className}
        `}
        title={`Current: ${themeConfig.name}`}
      >
        <span
          className={`
            emoji-icon emoji-xl transition-all duration-300 select-none
            flex items-center justify-center text-white
            ${isAnimating ? "animate-bounce scale-125" : "hover:scale-110"}
          `}
          style={{
            fontSize: "1.5rem",
            lineHeight: 1,
            minWidth: "1.5rem",
            minHeight: "1.5rem",
            filter: "brightness(1.2) contrast(1.1)",
            textShadow: "0 0 8px rgba(255,255,255,0.3)",
          }}
        >
          {currentOption.emoji}
        </span>
        {(isTransitioning || isAnimating) && (
          <div
            className={`
            absolute inset-0 rounded-xl transition-all duration-300
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
            <div className="absolute inset-0 rounded-xl border-2 border-blue-400/50 animate-ping" />
            <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-sm animate-pulse" />
          </>
        )}
      </button>
    );
  }

  if (variant === "dropdown") {
    return (
      <div className={`relative ${className}`}>
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="
            flex items-center gap-3 px-4 py-3
            bg-gradient-to-r from-slate-700/50 to-slate-600/50
            hover:from-slate-600/60 hover:to-slate-500/60
            border border-slate-600/50 hover:border-slate-500/70
            rounded-xl transition-all duration-300
            shadow-lg hover:shadow-xl
            min-w-[200px]
          "
        >
          <span className="text-xl">{currentOption.emoji}</span>
          <div className="flex-1 text-left">
            <div className="text-white font-medium">{currentOption.label}</div>
            {showLabel && (
              <div className="text-slate-400 text-xs">
                {currentOption.description}
              </div>
            )}
          </div>
          <ChevronDownIcon
            className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
              isDropdownOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {isDropdownOpen && (
          <div
            className="
            absolute top-full left-0 right-0 mt-2 z-50
            bg-slate-800/95 backdrop-blur-xl
            border border-slate-700/50 rounded-xl
            shadow-2xl shadow-black/50
            overflow-hidden
          "
          >
            {themeOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  setTheme(option.value);
                  setIsDropdownOpen(false);
                  stopPreview();
                }}
                onMouseEnter={() => previewTheme(option.value)}
                onMouseLeave={() => stopPreview()}
                className={`
                  w-full flex items-center gap-3 px-4 py-3
                  text-left transition-all duration-200
                  hover:bg-slate-700/50
                  ${theme === option.value ? "bg-slate-700/30" : ""}
                `}
              >
                <span className="text-lg">{option.emoji}</span>
                <div className="flex-1">
                  <div className="text-white font-medium flex items-center gap-2">
                    {option.label}
                    {option.value === "auto" && (
                      <span className="text-xs text-slate-400">
                        ({isSystemDarkMode ? "Dark" : "Light"})
                      </span>
                    )}
                    {theme === option.value && (
                      <CheckIcon className="w-4 h-4 text-green-400" />
                    )}
                  </div>
                  <div className="text-slate-400 text-xs">
                    {option.description}
                  </div>
                </div>
              </button>
            ))}

            {isPreviewMode && (
              <div className="px-4 py-2 bg-amber-500/10 border-t border-amber-500/20">
                <div className="text-amber-300 text-xs font-medium">
                  🔍 Previewing theme - click to apply
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  // Full variant (default)
  return (
    <div className={`space-y-2 ${className}`}>
      {showLabel && (
        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-1">
            Theme Settings
          </label>
          <p className="text-xs text-slate-400">
            Choose your preferred interface theme
          </p>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {themeOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => setTheme(option.value)}
            onMouseEnter={() => previewTheme(option.value)}
            onMouseLeave={() => stopPreview()}
            className={`
              relative p-3 rounded-lg border transition-all duration-300
              hover:scale-105 hover:shadow-lg
              ${
                theme === option.value
                  ? "border-sky-400/50 bg-sky-500/10 shadow-sky-500/20"
                  : "border-slate-600/50 bg-slate-700/20 hover:border-slate-500/70"
              }
              ${isTransitioning && theme === option.value ? "animate-pulse" : ""}
            `}
          >
            <div className="text-center">
              <div className="text-2xl mb-2 transform hover:scale-110 transition-transform">
                {option.emoji}
              </div>
              <div className="text-white font-medium text-sm mb-1">
                {option.label}
                {option.value === "auto" && (
                  <span className="text-xs text-slate-400 block">
                    ({isSystemDarkMode ? "Dark" : "Light"})
                  </span>
                )}
              </div>
              <div className="text-slate-400 text-xs leading-tight">
                {option.description}
              </div>
            </div>

            {theme === option.value && (
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                <CheckIcon className="w-3 h-3 text-white" />
              </div>
            )}
          </button>
        ))}
      </div>

      {isPreviewMode && (
        <div className="p-2 bg-amber-500/10 border border-amber-500/20 rounded-lg">
          <div className="flex items-center gap-2 text-amber-300 text-xs">
            <span>🔍</span>
            <span className="font-medium">Preview Mode Active</span>
          </div>
          <p className="text-amber-200 text-xs">
            Hover over themes to preview them. Click to apply permanently.
          </p>
        </div>
      )}

      {/* Theme Info Panel */}
      <div className="p-3 bg-slate-700/20 border border-slate-600/30 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-lg">{themeConfig.emoji}</span>
          <div>
            <h4 className="text-white font-medium text-sm">
              {themeConfig.name}
            </h4>
            <p className="text-slate-400 text-xs">{themeConfig.description}</p>
          </div>
        </div>

        {/* Color Preview */}
        <div className="grid grid-cols-4 gap-1">
          <div
            className="w-full h-6 rounded border border-slate-600/50"
            style={{ background: themeConfig.gradients.primary }}
            title="Primary Gradient"
          />
          <div
            className="w-full h-6 rounded border border-slate-600/50"
            style={{ background: themeConfig.gradients.secondary }}
            title="Secondary Gradient"
          />
          <div
            className="w-full h-6 rounded border border-slate-600/50"
            style={{ background: themeConfig.gradients.accent }}
            title="Accent Gradient"
          />
          <div
            className="w-full h-6 rounded border border-slate-600/50 bg-gradient-to-r"
            style={{
              background: `linear-gradient(90deg, ${themeConfig.colors.accentPrimary}, ${themeConfig.colors.accentSecondary})`,
            }}
            title="Accent Colors"
          />
        </div>
      </div>
    </div>
  );
};

export default EnhancedThemeToggle;
