import { CanvasItem } from "../types";

// Text element rendering utilities
export const getTextElementStyles = (item: CanvasItem): React.CSSProperties => {
  const baseStyle: React.CSSProperties = {
    fontFamily: item.fontFamily || "Inter, sans-serif",
    fontSize: item.fontSize || "14px",
    fontWeight: item.fontWeight || "normal",
    fontStyle: item.fontStyle || "normal",
    textDecoration: item.textDecoration || "none",
    color: item.textColor || "#FFFFFF",
    backgroundColor: item.backgroundColor || "transparent",
    textAlign: (item.textAlign as any) || "left",
    lineHeight: item.lineHeight || 1.5,
    letterSpacing: item.letterSpacing || "normal",
    textTransform: item.textTransform || "none",
    border: `${item.borderWidth || "0px"} ${item.borderStyle || "solid"} ${item.borderColor || "#374151"}`,
    borderRadius: item.borderRadius || "4px",
    padding: item.padding || "8px",
    boxShadow: item.boxShadow || "none",
    opacity: item.opacity || 1,
    transform: `rotate(${item.rotation || 0}deg)`,
  };

  // Apply text shadow if specified
  if (item.textShadow) {
    baseStyle.textShadow = item.textShadow;
  }

  return baseStyle;
};

// Code block rendering utilities
export const getCodeBlockStyles = (item: CanvasItem): React.CSSProperties => {
  const getThemeColors = (theme: string) => {
    const themes = {
      dark: {
        bg: "#1F2937",
        text: "#F9FAFB",
        header: "#374151",
        comment: "#9CA3AF",
        keyword: "#60A5FA",
        string: "#34D399",
        number: "#F59E0B",
      },
      light: {
        bg: "#FFFFFF",
        text: "#1F2937",
        header: "#F3F4F6",
        comment: "#6B7280",
        keyword: "#3B82F6",
        string: "#059669",
        number: "#D97706",
      },
      github: {
        bg: "#F6F8FA",
        text: "#24292E",
        header: "#E1E4E8",
        comment: "#6A737D",
        keyword: "#D73A49",
        string: "#032F62",
        number: "#005CC5",
      },
      vscode: {
        bg: "#1E1E1E",
        text: "#D4D4D4",
        header: "#2D2D30",
        comment: "#6A9955",
        keyword: "#569CD6",
        string: "#CE9178",
        number: "#B5CEA8",
      },
      sublime: {
        bg: "#272822",
        text: "#F8F8F2",
        header: "#3E3D32",
        comment: "#75715E",
        keyword: "#F92672",
        string: "#E6DB74",
        number: "#AE81FF",
      },
      atom: {
        bg: "#282C34",
        text: "#ABB2BF",
        header: "#21252B",
        comment: "#5C6370",
        keyword: "#C678DD",
        string: "#98C379",
        number: "#D19A66",
      },
      monokai: {
        bg: "#2D2A2E",
        text: "#FCFCFA",
        header: "#403E41",
        comment: "#727072",
        keyword: "#FF6188",
        string: "#FFD866",
        number: "#AB9DF2",
      },
      solarized: {
        bg: "#002B36",
        text: "#839496",
        header: "#073642",
        comment: "#586E75",
        keyword: "#268BD2",
        string: "#2AA198",
        number: "#D33682",
      },
    };
    return themes[theme as keyof typeof themes] || themes.dark;
  };

  const themeColors = getThemeColors(item.codeTheme || "dark");

  return {
    backgroundColor: themeColors.bg,
    color: themeColors.text,
    fontFamily: "Courier New, Monaco, monospace",
    fontSize: item.fontSize || "12px",
    border: `1px solid ${item.borderColor || "#374151"}`,
    borderRadius: "8px",
    overflow: "hidden",
  };
};

// Connector rendering utilities
export const getConnectorPath = (item: CanvasItem): string => {
  const width = item.width || 150;
  const height = item.height || 8;
  const connectorType = item.connectorType || "straight";

  switch (connectorType) {
    case "curved":
      return `M 0 ${height / 2} Q ${width / 2} ${height / 4} ${width} ${height / 2}`;
    case "elbow":
      return `M 0 ${height / 2} L ${width / 2} ${height / 2} L ${width / 2} ${height / 4} L ${width} ${height / 4}`;
    default:
      return `M 0 ${height / 2} L ${width} ${height / 2}`;
  }
};

export const getConnectorStroke = (item: CanvasItem): string => {
  const style = item.connectorStyle || "solid";
  switch (style) {
    case "dashed":
      return "8 4";
    case "dotted":
      return "2 2";
    default:
      return "none";
  }
};

// Chart data utilities
export const generateChartData = (item: CanvasItem) => {
  const chartType = item.chartType || "bar";
  const dataPoints = item.chartDataPoints || [
    { label: "Jan", value: 65 },
    { label: "Feb", value: 75 },
    { label: "Mar", value: 80 },
    { label: "Apr", value: 70 },
    { label: "May", value: 85 },
  ];

  const scheme = item.chartColorScheme || "blue";
  const colorSchemes = {
    blue: ["#3B82F6", "#60A5FA", "#93C5FD", "#DBEAFE"],
    green: ["#10B981", "#34D399", "#6EE7B7", "#D1FAE5"],
    purple: ["#8B5CF6", "#A78BFA", "#C4B5FD", "#EDE9FE"],
    red: ["#EF4444", "#F87171", "#FCA5A5", "#FEE2E2"],
    orange: ["#F59E0B", "#FBBF24", "#FCD34D", "#FEF3C7"],
    pink: ["#EC4899", "#F472B6", "#F9A8D4", "#FCE7F3"],
  };

  return {
    data: dataPoints,
    colors:
      colorSchemes[scheme as keyof typeof colorSchemes] || colorSchemes.blue,
    type: chartType,
  };
};

// Shape utilities
export const getShapeStyles = (item: CanvasItem): React.CSSProperties => {
  const variant = item.shapeVariant || "rectangle";
  const baseStyles: React.CSSProperties = {
    backgroundColor: item.backgroundColor || "#3B82F6",
    border: `${item.borderWidth || "1px"} ${item.borderStyle || "solid"} ${item.borderColor || "#2563EB"}`,
    opacity: item.opacity || 1,
    transform: `rotate(${item.rotation || 0}deg)`,
  };

  switch (variant) {
    case "circle":
      return { ...baseStyles, borderRadius: "50%" };
    case "ellipse":
      return { ...baseStyles, borderRadius: "50%" };
    default:
      return { ...baseStyles, borderRadius: item.borderRadius || "4px" };
  }
};

// Table utilities
export const getTableStyles = (item: CanvasItem) => {
  const theme = item.tableTheme || "default";
  const themes = {
    default: {
      primary: "#F8FAFC",
      secondary: "#E2E8F0",
      accent: "#3B82F6",
      text: "#1E293B",
    },
    blue: {
      primary: "#DBEAFE",
      secondary: "#BFDBFE",
      accent: "#3B82F6",
      text: "#1E3A8A",
    },
    green: {
      primary: "#D1FAE5",
      secondary: "#A7F3D0",
      accent: "#10B981",
      text: "#064E3B",
    },
    purple: {
      primary: "#EDE9FE",
      secondary: "#DDD6FE",
      accent: "#8B5CF6",
      text: "#581C87",
    },
    red: {
      primary: "#FEE2E2",
      secondary: "#FECACA",
      accent: "#EF4444",
      text: "#7F1D1D",
    },
  };

  return themes[theme as keyof typeof themes] || themes.default;
};

// Kanban card utilities
export const getKanbanCardStyles = (item: CanvasItem) => {
  const priority = item.kanbanPriority || "medium";
  const status = item.kanbanStatus || "todo";

  const priorityColors = {
    low: { bg: "#F0FDF4", border: "#BBF7D0", text: "#166534" },
    medium: { bg: "#FFFBEB", border: "#FED7AA", text: "#9A3412" },
    high: { bg: "#FEF2F2", border: "#FECACA", text: "#991B1B" },
    critical: { bg: "#7F1D1D", border: "#DC2626", text: "#FFFFFF" },
  };

  const statusColors = {
    todo: { bg: "#F8FAFC", border: "#E2E8F0" },
    "in-progress": { bg: "#DBEAFE", border: "#3B82F6" },
    review: { bg: "#FEF3C7", border: "#F59E0B" },
    done: { bg: "#D1FAE5", border: "#10B981" },
    blocked: { bg: "#FEE2E2", border: "#EF4444" },
  };

  return {
    priority:
      priorityColors[priority as keyof typeof priorityColors] ||
      priorityColors.medium,
    status:
      statusColors[status as keyof typeof statusColors] || statusColors.todo,
  };
};

// Mind map utilities
export const getMindMapNodeStyles = (item: CanvasItem): React.CSSProperties => {
  const nodeType = item.mindMapNodeType || "main";
  const shape = item.mindMapShape || "ellipse";

  const nodeTypeStyles = {
    central: {
      fontSize: "16px",
      fontWeight: "bold",
      padding: "16px",
      backgroundColor: item.backgroundColor || "#8B5CF6",
      borderWidth: "3px",
    },
    main: {
      fontSize: "14px",
      fontWeight: "600",
      padding: "12px",
      backgroundColor: item.backgroundColor || "#A78BFA",
      borderWidth: "2px",
    },
    branch: {
      fontSize: "12px",
      fontWeight: "normal",
      padding: "8px",
      backgroundColor: item.backgroundColor || "#C4B5FD",
      borderWidth: "1px",
    },
  };

  const shapeStyles =
    shape === "circle"
      ? { borderRadius: "50%" }
      : shape === "rectangle"
        ? { borderRadius: "4px" }
        : { borderRadius: "16px" }; // ellipse

  return {
    ...nodeTypeStyles[nodeType as keyof typeof nodeTypeStyles],
    ...shapeStyles,
    border: `${nodeTypeStyles[nodeType as keyof typeof nodeTypeStyles].borderWidth} solid ${item.borderColor || "#7C3AED"}`,
    color: item.textColor || "#FFFFFF",
    textAlign: "center" as const,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transform: `rotate(${item.rotation || 0}deg)`,
    opacity: item.opacity || 1,
  };
};
