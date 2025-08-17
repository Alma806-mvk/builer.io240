import React, { useEffect } from "react";
import {
  SparklesIcon,
  ColumnsIcon,
  SearchCircleIcon,
  PlayCircleIcon,
  PhotoIcon,
  CompassIcon,
  CalendarDaysIcon,
  TrendingUpIcon,
  ListChecksIcon,
  GlobeAltIcon,
  UserCircleIcon,
  ChevronDownIcon,
  CreditCardIcon,
  LaptopIcon,
  FilmIcon,
  HashtagIcon,
  ArrowUpRightIcon,
  UsersIcon,
  ShieldCheckIcon,
  StarIcon,
  BrainIcon,
  LightBulbIcon,
  ClipboardIcon,
  TagIcon,
  TrashIcon,
  RotateCcwIcon,
  WandIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "./IconComponents";

interface IconPreloaderProps {
  onPreloadComplete?: () => void;
}

/**
 * IconPreloader - Preloads all essential tab and UI icons for instant rendering
 * This component renders all icons invisibly to force emoji font loading
 */
export const IconPreloader: React.FC<IconPreloaderProps> = ({
  onPreloadComplete,
}) => {
  useEffect(() => {
    // Force font loading by accessing emoji font properties
    const preloadFont = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (ctx) {
        // Test render key emojis to force font loading
        ctx.font =
          '16px "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji"';
        ctx.fillText("📊🔍▶️📷🧭📅📈✅🌐✨", 0, 16);
      }
    };

    // Add slight delay to avoid blocking initial page render
    const timer = setTimeout(() => {
      preloadFont();
      onPreloadComplete?.();
    }, 100);

    return () => clearTimeout(timer);
  }, [onPreloadComplete]);

  // Hidden container that forces emoji rendering without affecting layout
  return (
    <div
      className="fixed -top-full -left-full opacity-0 pointer-events-none"
      aria-hidden="true"
      style={{
        position: "absolute",
        left: "-9999px",
        top: "-9999px",
        width: "1px",
        height: "1px",
        overflow: "hidden",
      }}
    >
      {/* Main tab icons - these are the most critical for fast loading */}
      <div className="preload-main-tabs">
        <SparklesIcon />
        <ColumnsIcon />
        <SearchCircleIcon />
        <PlayCircleIcon />
        <PhotoIcon />
        <CompassIcon />
        <CalendarDaysIcon />
        <TrendingUpIcon />
        <ListChecksIcon />
        <GlobeAltIcon />
      </div>

      {/* Secondary UI icons used throughout the app */}
      <div className="preload-ui-icons">
        <UserCircleIcon />
        <ChevronDownIcon />
        <CreditCardIcon />
        <LaptopIcon />
        <StarIcon />
        <BrainIcon />
        <LightBulbIcon />
        <FilmIcon />
        <HashtagIcon />
        <ArrowUpRightIcon />
        <UsersIcon />
        <ShieldCheckIcon />
      </div>

      {/* Common action icons */}
      <div className="preload-action-icons">
        <ClipboardIcon />
        <TagIcon />
        <TrashIcon />
        <RotateCcwIcon />
        <WandIcon />
        <CheckCircleIcon />
        <XCircleIcon />
      </div>
    </div>
  );
};

export default IconPreloader;
