import React from "react";

interface IconProps {
  className?: string;
  size?: number;
}

// Cross-platform consistent emoji replacements using SVG and web fonts
export const EmojiIcons = {
  // Business & Professional
  briefcase: ({ className = "", size = 16 }: IconProps) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M10 2v2H8a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-2V2h-4zm2 2v2h2V4h-2zm-4 4h8v8H8V8zm1 2v4h6v-4H9z" />
    </svg>
  ),

  sparkles: ({ className = "", size = 16 }: IconProps) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M12 2l1.5 4.5L18 8l-4.5 1.5L12 14l-1.5-4.5L6 8l4.5-1.5L12 2zm6 16l1 3 3-1-3-1-1-3-1 3-3 1 3 1 1 3z" />
    </svg>
  ),

  building: ({ className = "", size = 16 }: IconProps) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M6 2h12v20H6V2zm2 2v16h8V4H8zm1 2h2v2H9V6zm4 0h2v2h-2V6zm-4 4h2v2H9v-2zm4 0h2v2h-2v-2zm-4 4h2v2H9v-2zm4 0h2v2h-2v-2z" />
    </svg>
  ),

  palette: ({ className = "", size = 16 }: IconProps) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c1.38 0 2.5-1.12 2.5-2.5 0-.61-.23-1.15-.59-1.56-.36-.41-.59-.95-.59-1.56 0-1.38 1.12-2.5 2.5-2.5h2.95C19.36 14.38 22 11.74 22 8.5 22 4.91 18.09 2 12 2zm-5.5 9c-.83 0-1.5-.67-1.5-1.5S5.67 8 6.5 8 8 8.67 8 9.5 7.33 11 6.5 11zm3-4C8.67 7 8 6.33 8 5.5S8.67 4 9.5 4s1.5.67 1.5 1.5S10.33 7 9.5 7zm5 0c-.83 0-1.5-.67-1.5-1.5S13.67 4 14.5 4s1.5.67 1.5 1.5S15.33 7 14.5 7zm3 4c-.83 0-1.5-.67-1.5-1.5S16.67 8 17.5 8s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
    </svg>
  ),

  chart: ({ className = "", size = 16 }: IconProps) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M5 9.2h3V19H5zM10.6 5h2.8v14h-2.8zm5.6 8H19v6h-2.8z" />
    </svg>
  ),

  // Technology & Development
  bug: ({ className = "", size = 16 }: IconProps) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M14 12h-4v-2h4m-2-6a6 6 0 0 1 6 6v2h2v2h-2v2a6 6 0 0 1-6 6 6 6 0 0 1-6-6v-2H4v-2h2v-2a6 6 0 0 1 6-6m0 2a4 4 0 0 0-4 4v6a4 4 0 0 0 4 4 4 4 0 0 0 4-4V8a4 4 0 0 0-4-4z" />
    </svg>
  ),

  star: ({ className = "", size = 16 }: IconProps) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  ),

  target: ({ className = "", size = 16 }: IconProps) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm0-14c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
    </svg>
  ),

  fire: ({ className = "", size = 16 }: IconProps) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M13.5.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C5.21 7.51 4 10.62 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8C20 8.61 17.41 3.8 13.5.67zM11.71 19c-1.78 0-3.22-1.4-3.22-3.14 0-1.62 1.05-2.76 2.81-3.12 1.77-.36 3.6-1.21 4.62-2.58.39 1.29.62 2.65.62 4.04 0 2.65-2.15 4.8-4.83 4.8z" />
    </svg>
  ),

  // Status & Priority
  checkCircle: ({ className = "", size = 16 }: IconProps) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
    </svg>
  ),

  warning: ({ className = "", size = 16 }: IconProps) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
    </svg>
  ),

  bolt: ({ className = "", size = 16 }: IconProps) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M11 21h-1l1-7H7.5c-.88 0-.33-.75-.31-.78L13 2.24c.16-.13.36-.07.36.14v5.86h3.5c.88 0 .33.75.31.78L11 21z" />
    </svg>
  ),

  // Communication & Social
  document: ({ className = "", size = 16 }: IconProps) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
    </svg>
  ),

  book: ({ className = "", size = 16 }: IconProps) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4z" />
    </svg>
  ),

  trendingUp: ({ className = "", size = 16 }: IconProps) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z" />
    </svg>
  ),

  // Text formatting and tools
  pen: ({ className = "", size = 16 }: IconProps) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z" />
    </svg>
  ),

  brush: ({ className = "", size = 16 }: IconProps) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M7,14C5.89,14 5,13.1 5,12C5,10.89 5.89,10 7,10C8.1,10 9,10.89 9,12A2,2 0 0,1 7,14M12.65,10C11.83,7.67 9.61,6 7,6A6,6 0 0,0 1,12A6,6 0 0,0 7,18C7.34,18 7.67,17.97 8,17.9C8.03,17.64 8.05,17.37 8.05,17.1C8.05,16.29 7.96,15.5 7.79,14.75C7.54,14.89 7.28,15 7,15C6.45,15 6,14.55 6,14C6,13.45 6.45,13 7,13C7.55,13 8,13.45 8,14C8,14.28 7.89,14.54 7.75,14.79C7.5,15.96 7.05,16.29 7.05,17.1C7.05,17.37 7.03,17.64 7,17.9C7.67,17.97 7.34,18 7,18A6,6 0 0,0 13,12C13,11.41 12.94,10.83 12.84,10.27C12.77,10.14 12.71,10.07 12.65,10M16.5,17C15.83,17 15.26,16.69 14.87,16.2C14.33,15.54 14.04,14.68 14.04,13.75C14.04,12.82 14.33,11.96 14.87,11.3C15.26,10.81 15.83,10.5 16.5,10.5C17.17,10.5 17.74,10.81 18.13,11.3C18.67,11.96 18.96,12.82 18.96,13.75C18.96,14.68 18.67,15.54 18.13,16.2C17.74,16.69 17.17,17 16.5,17M16.5,9C15.44,9 14.5,9.46 13.83,10.24C13,11.22 12.5,12.43 12.5,13.75C12.5,15.07 13,16.28 13.83,17.26C14.5,18.04 15.44,18.5 16.5,18.5C17.56,18.5 18.5,18.04 19.17,17.26C20,16.28 20.5,15.07 20.5,13.75C20.5,12.43 20,11.22 19.17,10.24C18.5,9.46 17.56,9 16.5,9Z" />
    </svg>
  ),

  // Programming languages
  coffee: ({ className = "", size = 16 }: IconProps) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M2,21V19H20V21H2M20,8V5H18V8H20M20,3A2,2 0 0,1 22,5V8A2,2 0 0,1 20,10H18V13A4,4 0 0,1 14,17H8A4,4 0 0,1 4,13V3H20M16,5H6V13A2,2 0 0,0 8,15H14A2,2 0 0,0 16,13V5Z" />
    </svg>
  ),

  diamond: ({ className = "", size = 16 }: IconProps) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M6,2L2,8L12,22L22,8L18,2H6M6.5,4H8.5L10,7H7L6.5,4M9.5,4H14.5L16,7H8L9.5,4M15.5,4H17.5L17,7H14L15.5,4M8.5,9H11V18.5L8.5,9M13,9H15.5L13,18.5V9M5,9H6.5L9,18.5L5,9M17.5,9H19L15,18.5L17.5,9Z" />
    </svg>
  ),

  // Arrows and directions
  arrowUp: ({ className = "", size = 16 }: IconProps) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M13,20H11V8L5.5,13.5L4.08,12.08L12,4.16L19.92,12.08L18.5,13.5L13,8V20Z" />
    </svg>
  ),

  arrowDown: ({ className = "", size = 16 }: IconProps) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M11,4H13V16L18.5,10.5L19.92,11.92L12,19.84L4.08,11.92L5.5,10.5L11,16V4Z" />
    </svg>
  ),

  arrowRight: ({ className = "", size = 16 }: IconProps) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M4,11V13H16L10.5,18.5L11.92,19.92L19.84,12L11.92,4.08L10.5,5.5L16,11H4Z" />
    </svg>
  ),

  // Database and storage
  database: ({ className = "", size = 16 }: IconProps) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M12,3C7.58,3 4,4.79 4,7V17C4,19.21 7.58,21 12,21C16.42,21 20,19.21 20,17V7C20,4.79 16.42,3 12,3M18,17C18,17.5 15.87,19 12,19C8.13,19 6,17.5 6,17V14.77C7.61,15.55 9.72,16 12,16C14.28,16 16.39,15.55 18,14.77V17M18,12.45C16.7,13.4 14.42,14 12,14C9.58,14 7.3,13.4 6,12.45V9.64C7.47,10.47 9.61,11 12,11C14.39,11 16.53,10.47 18,9.64V12.45M18,7C18,7.5 15.87,9 12,9C8.13,9 6,7.5 6,7C6,6.5 8.13,5 12,5C15.87,5 18,6.5 18,7Z" />
    </svg>
  ),

  // Mobile and devices
  mobile: ({ className = "", size = 16 }: IconProps) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M17,19H7V5H17M17,1H7C5.89,1 5,1.89 5,3V21A2,2 0 0,0 7,23H17A2,2 0 0,0 19,21V3C19,1.89 18.1,1 17,1Z" />
    </svg>
  ),

  // Money and finance
  dollar: ({ className = "", size = 16 }: IconProps) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M11.8,10.9C9.53,10.31 8.8,9.7 8.8,8.75C8.8,7.66 9.81,6.9 11.5,6.9C13.28,6.9 13.94,7.75 14,9H16.21C16.14,7.28 15.09,5.7 13,5.19V3H10V5.16C8.06,5.58 6.5,6.84 6.5,8.77C6.5,11.08 8.41,12.23 11.2,12.9C13.7,13.5 14.2,14.38 14.2,15.31C14.2,16 13.71,17.1 11.5,17.1C9.44,17.1 8.63,16.18 8.5,15H6.32C6.44,17.19 8.08,18.42 10,18.83V21H13V18.85C14.95,18.5 16.5,17.35 16.5,15.3C16.5,12.46 14.07,11.5 11.8,10.9Z" />
    </svg>
  ),

  rocket: ({ className = "", size = 16 }: IconProps) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M2.81,14.12L5.64,11.29L8.17,10.79C11.39,6.41 17.55,4.22 19.78,4.22C19.78,6.45 17.59,12.61 13.21,15.83L12.71,18.36L9.88,21.19C9.29,21.78 8.28,21.78 7.69,21.19L2.81,16.31C2.22,15.72 2.22,14.71 2.81,14.12M7.68,7.68C6.9,6.9 6.9,5.66 7.68,4.88C8.46,4.1 9.7,4.1 10.48,4.88C11.26,5.66 11.26,6.9 10.48,7.68C9.7,8.46 8.46,8.46 7.68,7.68M10.27,17.73L18.36,12.71L21.19,9.88C21.78,9.29 21.78,8.28 21.19,7.69L16.31,2.81C15.72,2.22 14.71,2.22 14.12,2.81L11.29,5.64L6.27,13.73C5.68,14.32 5.68,15.33 6.27,15.92L10.27,17.73Z" />
    </svg>
  ),

  // Tools
  wrench: ({ className = "", size = 16 }: IconProps) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M22.7,19L13.6,9.9C14.5,7.6 14,4.9 12.1,3C10.1,1 7.1,0.6 4.7,1.7L9,6L6,9L1.6,4.7C0.4,7.1 0.9,10.1 2.9,12.1C4.8,14 7.5,14.5 9.8,13.6L18.9,22.7C19.3,23.1 19.9,23.1 20.3,22.7L22.6,20.4C23.1,20 23.1,19.3 22.7,19Z" />
    </svg>
  ),

  // Security
  shield: ({ className = "", size = 16 }: IconProps) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M10,17L6,13L7.41,11.59L10,14.17L16.59,7.58L18,9L10,17Z" />
    </svg>
  ),
};

// Text-based emoji alternatives with proper sizing
export const TextEmoji = {
  checkmark: ({ className = "" }: IconProps) => (
    <span className={`inline-block text-green-500 font-bold ${className}`}>
      ✓
    </span>
  ),
  cross: ({ className = "" }: IconProps) => (
    <span className={`inline-block text-red-500 font-bold ${className}`}>
      ���
    </span>
  ),
  arrow: ({
    className = "",
    direction = "right",
  }: IconProps & { direction?: "up" | "down" | "left" | "right" }) => {
    const arrows = { up: "↑", down: "↓", left: "←", right: "→" };
    return (
      <span className={`inline-block ${className}`}>{arrows[direction]}</span>
    );
  },
  star: ({ className = "" }: IconProps) => (
    <span className={`inline-block text-yellow-500 ${className}`}>★</span>
  ),
  bullet: ({ className = "" }: IconProps) => (
    <span className={`inline-block ${className}`}>•</span>
  ),
};

// Professional status indicators
export const StatusIndicators = {
  priority: {
    low: ({ className = "" }: IconProps) => (
      <div className={`inline-flex items-center gap-1 ${className}`}>
        <div className="w-2 h-2 rounded-full bg-green-500"></div>
        <span className="text-xs text-green-600">Low</span>
      </div>
    ),
    medium: ({ className = "" }: IconProps) => (
      <div className={`inline-flex items-center gap-1 ${className}`}>
        <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
        <span className="text-xs text-yellow-600">Medium</span>
      </div>
    ),
    high: ({ className = "" }: IconProps) => (
      <div className={`inline-flex items-center gap-1 ${className}`}>
        <div className="w-2 h-2 rounded-full bg-red-500"></div>
        <span className="text-xs text-red-600">High</span>
      </div>
    ),
    urgent: ({ className = "" }: IconProps) => (
      <div className={`inline-flex items-center gap-1 ${className}`}>
        <div className="w-2 h-2 rounded-full bg-red-700 animate-pulse"></div>
        <span className="text-xs text-red-700 font-semibold">Urgent</span>
      </div>
    ),
    critical: ({ className = "" }: IconProps) => (
      <div className={`inline-flex items-center gap-1 ${className}`}>
        <div className="w-2 h-2 rounded-full bg-red-900 animate-pulse"></div>
        <span className="text-xs text-white bg-red-900 px-1 rounded">
          Critical
        </span>
      </div>
    ),
  },

  status: {
    todo: ({ className = "" }: IconProps) => (
      <div className={`inline-flex items-center gap-1 ${className}`}>
        <div className="w-2 h-2 rounded-full bg-gray-400"></div>
        <span className="text-xs text-gray-600">To Do</span>
      </div>
    ),
    inProgress: ({ className = "" }: IconProps) => (
      <div className={`inline-flex items-center gap-1 ${className}`}>
        <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
        <span className="text-xs text-blue-600">In Progress</span>
      </div>
    ),
    review: ({ className = "" }: IconProps) => (
      <div className={`inline-flex items-center gap-1 ${className}`}>
        <div className="w-2 h-2 rounded-full bg-orange-500"></div>
        <span className="text-xs text-orange-600">Review</span>
      </div>
    ),
    done: ({ className = "" }: IconProps) => (
      <div className={`inline-flex items-center gap-1 ${className}`}>
        <div className="w-2 h-2 rounded-full bg-green-500"></div>
        <span className="text-xs text-green-600">Done</span>
      </div>
    ),
    blocked: ({ className = "" }: IconProps) => (
      <div className={`inline-flex items-center gap-1 ${className}`}>
        <div className="w-2 h-2 rounded-full bg-red-500"></div>
        <span className="text-xs text-red-600">Blocked</span>
      </div>
    ),
  },
};
