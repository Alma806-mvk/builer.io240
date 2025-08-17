import React, { createContext, useContext, useState, useEffect } from "react";

export type ThemeMode =
  | "light"
  | "dark"
  | "auto"
  | "midnight"
  | "cosmic"
  | "ocean";

export interface ThemePresets {
  light: ThemeConfig;
  dark: ThemeConfig;
  midnight: ThemeConfig;
  cosmic: ThemeConfig;
  ocean: ThemeConfig;
}

export interface ThemeConfig {
  name: string;
  emoji: string;
  description: string;
  colors: {
    bgPrimary: string;
    bgSecondary: string;
    bgTertiary: string;
    textPrimary: string;
    textSecondary: string;
    textTertiary: string;
    borderPrimary: string;
    borderSecondary: string;
    accentPrimary: string;
    accentSecondary: string;
    success: string;
    warning: string;
    error: string;
    info: string;
  };
  gradients: {
    primary: string;
    secondary: string;
    accent: string;
  };
}

interface ThemeContextType {
  theme: ThemeMode;
  actualTheme: Exclude<ThemeMode, "auto">; // The resolved theme (auto becomes light/dark)
  setTheme: (theme: ThemeMode) => void;
  themeConfig: ThemeConfig;
  isSystemDarkMode: boolean;
  isTransitioning: boolean;
  toggleTheme: () => void;
  previewTheme: (theme: ThemeMode) => void;
  stopPreview: () => void;
  isPreviewMode: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_PRESETS: ThemePresets = {
  light: {
    name: "Light Mode",
    emoji: "☀️",
    description: "Modern clean design with excellent contrast",
    colors: {
      bgPrimary: "#ffffff",
      bgSecondary: "#f8fafc",
      bgTertiary: "#f1f5f9",
      textPrimary: "#0f172a",
      textSecondary: "#334155",
      textTertiary: "#64748b",
      borderPrimary: "#e2e8f0",
      borderSecondary: "#cbd5e1",
      accentPrimary: "#0ea5e9",
      accentSecondary: "#3b82f6",
      success: "#059669",
      warning: "#d97706",
      error: "#dc2626",
      info: "#0284c7",
    },
    gradients: {
      primary: "linear-gradient(135deg, #ffffff 0%, #f8fafc 50%, #f1f5f9 100%)",
      secondary: "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #bae6fd 100%)",
      accent: "linear-gradient(135deg, #dbeafe 0%, #bfdbfe 50%, #93c5fd 100%)",
    },
  },
  dark: {
    name: "Dark Mode",
    emoji: "🌙",
    description: "Easy on the eyes",
    colors: {
      bgPrimary: "#0f172a",
      bgSecondary: "#1e293b",
      bgTertiary: "#334155",
      textPrimary: "#f8fafc",
      textSecondary: "#cbd5e1",
      textTertiary: "#94a3b8",
      borderPrimary: "#475569",
      borderSecondary: "#64748b",
      accentPrimary: "#0ea5e9",
      accentSecondary: "#8b5cf6",
      success: "#10b981",
      warning: "#f59e0b",
      error: "#ef4444",
      info: "#3b82f6",
    },
    gradients: {
      primary: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      secondary: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
      accent: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    },
  },
  midnight: {
    name: "Midnight",
    emoji: "🌌",
    description: "Deep space vibes",
    colors: {
      bgPrimary: "#0c0d14",
      bgSecondary: "#1a1b26",
      bgTertiary: "#24283b",
      textPrimary: "#c0caf5",
      textSecondary: "#9aa5ce",
      textTertiary: "#565f89",
      borderPrimary: "#3b4261",
      borderSecondary: "#545c7e",
      accentPrimary: "#7aa2f7",
      accentSecondary: "#bb9af7",
      success: "#9ece6a",
      warning: "#e0af68",
      error: "#f7768e",
      info: "#7dcfff",
    },
    gradients: {
      primary: "linear-gradient(135deg, #7aa2f7 0%, #bb9af7 100%)",
      secondary: "linear-gradient(135deg, #f7768e 0%, #ff9e64 100%)",
      accent: "linear-gradient(135deg, #7dcfff 0%, #2ac3de 100%)",
    },
  },
  cosmic: {
    name: "Cosmic",
    emoji: "���",
    description: "Interstellar experience",
    colors: {
      bgPrimary: "#0a0a0f",
      bgSecondary: "#1a0f2e",
      bgTertiary: "#2d1b4e",
      textPrimary: "#e6e6fa",
      textSecondary: "#b19cd9",
      textTertiary: "#8b5fbf",
      borderPrimary: "#4c2889",
      borderSecondary: "#6a3093",
      accentPrimary: "#a855f7",
      accentSecondary: "#ec4899",
      success: "#10b981",
      warning: "#f59e0b",
      error: "#ef4444",
      info: "#3b82f6",
    },
    gradients: {
      primary: "linear-gradient(135deg, #a855f7 0%, #ec4899 100%)",
      secondary: "linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%)",
      accent: "linear-gradient(135deg, #f97316 0%, #ef4444 100%)",
    },
  },
  ocean: {
    name: "Ocean",
    emoji: "🌊",
    description: "Calming blue depths",
    colors: {
      bgPrimary: "#0f1419",
      bgSecondary: "#1a2332",
      bgTertiary: "#2d3748",
      textPrimary: "#e2e8f0",
      textSecondary: "#a0aec0",
      textTertiary: "#718096",
      borderPrimary: "#4a5568",
      borderSecondary: "#2d3748",
      accentPrimary: "#4299e1",
      accentSecondary: "#38b2ac",
      success: "#68d391",
      warning: "#ed8936",
      error: "#fc8181",
      info: "#63b3ed",
    },
    gradients: {
      primary: "linear-gradient(135deg, #4299e1 0%, #38b2ac 100%)",
      secondary: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      accent: "linear-gradient(135deg, #38b2ac 0%, #319795 100%)",
    },
  },
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem("theme") as ThemeMode;
    return saved || "dark";
  });

  const [isSystemDarkMode, setIsSystemDarkMode] = useState(() => {
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  const [isTransitioning, setIsTransitioning] = useState(false);
  const [previewTheme, setPreviewTheme] = useState<ThemeMode | null>(null);

  // Resolve 'auto' theme to actual theme
  const actualTheme: Exclude<ThemeMode, "auto"> =
    previewTheme && previewTheme !== "auto"
      ? previewTheme
      : theme === "auto"
        ? isSystemDarkMode
          ? "dark"
          : "light"
        : (theme as Exclude<ThemeMode, "auto">);

  const themeConfig = THEME_PRESETS[actualTheme];

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e: MediaQueryListEvent) => {
      setIsSystemDarkMode(e.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  // Apply theme to DOM
  useEffect(() => {
    setIsTransitioning(true);
    const root = document.documentElement;

    // Remove all theme classes
    root.classList.remove(
      "theme-light",
      "theme-dark",
      "theme-midnight",
      "theme-cosmic",
      "theme-ocean",
    );

    // Add current theme class
    root.classList.add(`theme-${actualTheme}`);

    // Set CSS custom properties
    Object.entries(themeConfig.colors).forEach(([key, value]) => {
      root.style.setProperty(
        `--theme-${key.replace(/([A-Z])/g, "-$1").toLowerCase()}`,
        value,
      );
    });

    Object.entries(themeConfig.gradients).forEach(([key, value]) => {
      root.style.setProperty(`--theme-gradient-${key}`, value);
    });

    // Set data attribute for theme-specific styling
    root.setAttribute("data-theme", actualTheme);

    const timer = setTimeout(() => setIsTransitioning(false), 200);
    return () => clearTimeout(timer);
  }, [actualTheme, themeConfig]);

  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme);
    localStorage.setItem("theme", newTheme);
    setPreviewTheme(null); // Clear preview when setting actual theme
  };

  const toggleTheme = () => {
    const themes: ThemeMode[] = [
      "light",
      "dark",
      "midnight",
      "cosmic",
      "ocean",
    ];
    const currentIndex = themes.indexOf(actualTheme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
  };

  const handlePreviewTheme = (theme: ThemeMode) => {
    setPreviewTheme(theme);
  };

  const stopPreview = () => {
    setPreviewTheme(null);
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        actualTheme,
        setTheme,
        themeConfig,
        isSystemDarkMode,
        isTransitioning,
        toggleTheme,
        previewTheme: handlePreviewTheme,
        stopPreview,
        isPreviewMode: previewTheme !== null,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

export { THEME_PRESETS };
