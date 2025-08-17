import React from "react";

interface IconProps {
  className?: string;
}

// Fixed icon components with proper Unicode emoji characters
export const SparklesIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    className={`transition-all duration-200 ${props.className || ''}`}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <polygon points="12,2 15.09,8.26 22,9 17,14.74 18.18,21.02 12,17.77 5.82,21.02 7,14.74 2,9 8.91,8.26 12,2" />
  </svg>
);
export const ClipboardIcon: React.FC<IconProps> = ({ className = "" }) => (
  <span className={`emoji-icon ${className}`} role="img" aria-label="clipboard">📋</span>
);
export const LightBulbIcon: React.FC<IconProps> = ({ className = "" }) => (
  <span className={`emoji-icon ${className}`} role="img" aria-label="light bulb">💡</span>
);
export const FilmIcon: React.FC<IconProps> = ({ className = "" }) => (
  <span className={`emoji-icon ${className}`} role="img" aria-label="film">🎬</span>
);
export const TagIcon: React.FC<IconProps> = ({ className = "" }) => (
  <span className={`emoji-icon ${className}`} role="img" aria-label="tag">🏷️</span>
);
export const PhotoIcon: React.FC<IconProps> = ({ className = "" }) => (
  <span className={`emoji-icon ${className}`} role="img" aria-label="photo">📷</span>
);
export const TrashIcon: React.FC<IconProps> = ({ className = "" }) => (
  <span className={`emoji-icon ${className}`} role="img" aria-label="trash">🗑️</span>
);
export const RotateCcwIcon: React.FC<IconProps> = ({ className = "" }) => (
  <span className={`emoji-icon ${className}`} role="img" aria-label="rotate">🔄</span>
);
export const HashtagIcon: React.FC<IconProps> = ({ className = "" }) => (
  <span className={`emoji-icon ${className}`} role="img" aria-label="hashtag">#️⃣</span>
);
export const WandIcon: React.FC<IconProps> = ({ className = "" }) => (
  <span className={`emoji-icon ${className}`} role="img" aria-label="wand">🪄</span>
);
export const ListChecksIcon: React.FC<IconProps> = ({ className = "" }) => (
  <span className={`emoji-icon ${className}`} role="img" aria-label="check">✅</span>
);
export const UsersIcon: React.FC<IconProps> = ({ className = "" }) => (
  <span className={`emoji-icon ${className}`} role="img" aria-label="users">👥</span>
);
export const RefreshCwIcon: React.FC<IconProps> = ({ className = "" }) => (
  <span className={`emoji-icon ${className}`} role="img" aria-label="refresh">🔄</span>
);
export const SearchIcon: React.FC<IconProps> = ({ className = "" }) => (
  <span className={`emoji-icon ${className}`} role="img" aria-label="search">🔍</span>
);
export const CanvasIcon: React.FC<IconProps> = ({ className = "" }) => (
  <span className={`emoji-icon ${className}`} role="img" aria-label="canvas">🎨</span>
);
export const EditIcon: React.FC<IconProps> = ({ className = "" }) => (
  <span className={`emoji-icon ${className}`} role="img" aria-label="edit">✏️</span>
);
export const StarIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    width="24"
    height="24"
    className={`transition-all duration-200 ${props.className || ''}`}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <polygon points="12,2 15.09,8.26 22,9 17,14.74 18.18,21.02 12,17.77 5.82,21.02 7,14.74 2,9 8.91,8.26 12,2" />
  </svg>
);
export const FileTextIcon: React.FC<IconProps> = ({ className = "" }) => (
  <span className={`emoji-icon ${className}`} role="img" aria-label="file">📄</span>
);
export const HelpCircleIcon: React.FC<IconProps> = ({ className = "" }) => (
  <span className={`emoji-icon ${className}`} role="img" aria-label="help">❓</span>
);
export const Share2Icon: React.FC<IconProps> = ({ className = "" }) => (
  <span className={`emoji-icon ${className}`} role="img" aria-label="share">↗️</span>
);
export const KeyIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    className={`transition-all duration-200 ${props.className || ''}`}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <circle cx="8" cy="8" r="6" />
    <path d="M18.09 10.37A6 6 0 1 1 10.37 18.09L12 16.5l2.5-2.5 2.5 2.5L18.5 14l1.59-1.63z" />
  </svg>
);
export const FilmStripIcon: React.FC<IconProps> = ({ className = "" }) => (
  <span className={`emoji-icon ${className}`} role="img" aria-label="film strip">🎞️</span>
);
export const RepeatIcon: React.FC<IconProps> = ({ className = "" }) => (
  <span className={`emoji-icon ${className}`} role="img" aria-label="repeat">🔁</span>
);
export const ColumnsIcon: React.FC<IconProps> = ({ className = "" }) => (
  <span className={`emoji-icon ${className}`} role="img" aria-label="columns">��</span>
);
export const SaveIcon: React.FC<IconProps> = ({ className = "" }) => (
  <span className={`emoji-icon ${className}`} role="img" aria-label="save">💾</span>
);
export const BookOpenIcon: React.FC<IconProps> = ({ className = "" }) => (
  <span className={`emoji-icon ${className}`} role="img" aria-label="book">📖</span>
);
export const CheckCircleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    width="24"
    height="24"
    className={`transition-all duration-200 ${props.className || ''}`}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22,4 12,14.01 9,11.01" />
  </svg>
);
export const XCircleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    width="24"
    height="24"
    className={`transition-all duration-200 ${props.className || ''}`}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <circle cx="12" cy="12" r="10" />
    <path d="15 9l-6 6" />
    <path d="9 9l6 6" />
  </svg>
);
export const ChevronDownIcon: React.FC<IconProps> = ({ className = "" }) => (
  <span className={`emoji-icon ${className}`} role="img" aria-label="down">⬇️</span>
);
export const ChevronUpIcon: React.FC<IconProps> = ({ className = "" }) => (
  <span className={`emoji-icon ${className}`} role="img" aria-label="up">⬆️</span>
);
export const PlusCircleIcon: React.FC<IconProps> = ({ className = "" }) => (
  <span className={`emoji-icon ${className}`} role="img" aria-label="plus">➕</span>
);
export const MinusCircleIcon: React.FC<IconProps> = ({ className = "" }) => (
  <span className={`emoji-icon ${className}`} role="img" aria-label="minus">➖</span>
);
export const BrainIcon: React.FC<IconProps> = ({ className = "" }) => (
  <span className={`emoji-icon ${className}`} role="img" aria-label="brain">🧠</span>
);
export const LinkIcon: React.FC<IconProps> = ({ className = "" }) => (
  <span className={`emoji-icon ${className}`} role="img" aria-label="link">🔗</span>
);
export const ArrowUpRightIcon: React.FC<IconProps> = ({ className = "" }) => (
  <span className={`emoji-icon ${className}`} role="img" aria-label="arrow up right">↗️</span>
);
export const ArrowDownLeftIcon: React.FC<IconProps> = ({ className = "" }) => (
  <span className={`emoji-icon ${className}`} role="img" aria-label="arrow down left">↙️</span>
);
export const SlidersHorizontalIcon: React.FC<IconProps> = ({ className = "" }) => (
  <span className={`emoji-icon ${className}`} role="img" aria-label="settings">⚙️</span>
);
export const MessageSquareIcon: React.FC<IconProps> = ({ className = "" }) => (
  <span className={`emoji-icon ${className}`} role="img" aria-label="message">💬</span>
);
export const GlobeAltIcon: React.FC<IconProps> = ({ className = "" }) => (
  <span className={`emoji-icon ${className}`} role="img" aria-label="globe">🌐</span>
);
export const UserCircleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    className={`transition-all duration-200 ${props.className || ''}`}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);
export const ClipboardDocumentListIcon: React.FC<IconProps> = ({ className = "" }) => (
  <span className={`emoji-icon ${className}`} role="img" aria-label="clipboard">📋</span>
);
export const QuestionMarkCircleIcon: React.FC<IconProps> = ({ className = "" }) => (
  <span className={`emoji-icon ${className}`} role="img" aria-label="question">❓</span>
);
export const SearchCircleIcon: React.FC<IconProps> = ({ className = "" }) => (
  <span className={`emoji-icon ${className}`} role="img" aria-label="search">🔍</span>
);
export const PlayCircleIcon: React.FC<IconProps> = ({ className = "" }) => (
  <span className={`emoji-icon ${className}`} role="img" aria-label="play">▶️</span>
);
export const LanguageIcon: React.FC<IconProps> = ({ className = "" }) => (
  <span className={`emoji-icon ${className}`} role="img" aria-label="language">🌐</span>
);
export const ScaleIcon: React.FC<IconProps> = ({ className = "" }) => (
  <span className={`emoji-icon ${className}`} role="img" aria-label="scale">⚖️</span>
);
export const ViewfinderCircleIcon: React.FC<IconProps> = ({ className = "" }) => (
  <span className={`emoji-icon ${className}`} role="img" aria-label="viewfinder">🔍</span>
);
export const ChatBubbleLeftRightIcon: React.FC<IconProps> = ({ className = "" }) => (
  <span className={`emoji-icon ${className}`} role="img" aria-label="chat">💬</span>
);
export const MicrophoneIcon: React.FC<IconProps> = ({ className = "" }) => (
  <span className={`emoji-icon ${className}`} role="img" aria-label="microphone">🎤</span>
);
export const PinIcon: React.FC<IconProps> = ({ className = "" }) => (
  <span className={`emoji-icon ${className}`} role="img" aria-label="pin">📌</span>
);
export const SmileIcon: React.FC<IconProps> = ({ className = "" }) => (
  <span className={`emoji-icon ${className}`} role="img" aria-label="smile">😊</span>
);
export const StickyNoteIcon: React.FC<IconProps> = ({ className = "" }) => (
  <span className={`emoji-icon ${className}`} role="img" aria-label="sticky note">📝</span>
);
export const TypeToolIcon: React.FC<IconProps> = ({ className = "" }) => (
  <span className={`emoji-icon ${className}`} role="img" aria-label="text">✏️</span>
);
export const ShapesIcon: React.FC<IconProps> = ({ className = "" }) => (
  <span className={`emoji-icon ${className}`} role="img" aria-label="shapes">🔷</span>
);
export const PenToolIcon: React.FC<IconProps> = ({ className = "" }) => (
  <span className={`emoji-icon ${className}`} role="img" aria-label="pen">✒️</span>
);
export const FrameIcon: React.FC<IconProps> = ({ className = "" }) => (
  <span className={`emoji-icon ${className}`} role="img" aria-label="frame">🖼️</span>
);
export const ArrowUpTrayIcon: React.FC<IconProps> = ({ className = "" }) => (
  <span className={`emoji-icon ${className}`} role="img" aria-label="upload">⬆️</span>
);
export const RectangleIcon: React.FC<IconProps> = ({ className = "" }) => (
  <span className={`emoji-icon ${className}`} role="img" aria-label="rectangle">⬜</span>
);
export const CircleIcon: React.FC<IconProps> = ({ className = "" }) => (
  <span className={`emoji-icon ${className}`} role="img" aria-label="circle">⭕</span>
);
export const TriangleIcon: React.FC<IconProps> = ({ className = "" }) => (
  <span className={`emoji-icon ${className}`} role="img" aria-label="triangle">🔺</span>
);
export const RightArrowIcon: React.FC<IconProps> = ({ className = "" }) => (
  <span className={`emoji-icon ${className}`} role="img" aria-label="right arrow">➡️</span>
);
export const BoldIcon: React.FC<IconProps> = ({ className = "" }) => (
  <span className={className} style={{ fontWeight: 'bold' }}>B</span>
);
export const ItalicIcon: React.FC<IconProps> = ({ className = "" }) => (
  <span className={className} style={{ fontStyle: 'italic' }}>I</span>
);
export const UnderlineIcon: React.FC<IconProps> = ({ className = "" }) => (
  <span className={className} style={{ textDecoration: 'underline' }}>U</span>
);
export const FontIcon: React.FC<IconProps> = ({ className = "" }) => (
  <span className={className} style={{ fontFamily: 'serif' }}>F</span>
);
export const CalendarDaysIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    className={`transition-all duration-200 ${props.className || ''}`}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);
export const StarShapeIcon: React.FC<IconProps> = ({ className = "" }) => (
  <span className={`emoji-icon ${className}`} role="img" aria-label="star">⭐</span>
);
export const SpeechBubbleShapeIcon: React.FC<IconProps> = ({ className = "" }) => (
  <span className={`emoji-icon ${className}`} role="img" aria-label="speech bubble">💬</span>
);
export const TrendingUpIcon: React.FC<IconProps> = ({ className = "" }) => (
  <span className={`emoji-icon ${className}`} role="img" aria-label="trending up">📈</span>
);
export const TrendingDownIcon: React.FC<IconProps> = ({ className = "" }) => (
  <span className={`emoji-icon ${className}`} role="img" aria-label="trending down">📉</span>
);
export const CameraIcon: React.FC<IconProps> = ({ className = "" }) => (
  <span className={`emoji-icon ${className}`} role="img" aria-label="camera">📷</span>
);
export const DownloadIcon: React.FC<IconProps> = ({ className = "" }) => (
  <span className={`emoji-icon ${className}`} role="img" aria-label="download">⬇️</span>
);
export const CompassIcon: React.FC<IconProps> = ({ className = "" }) => (
  <span className={`emoji-icon ${className}`} role="img" aria-label="compass">🧭</span>
);
export const EyeIcon: React.FC<IconProps> = ({ className = "" }) => (
  <span className={`emoji-icon ${className}`} role="img" aria-label="eye">👁️</span>
);
export const ChevronLeftIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    width="24"
    height="24"
    className={`transition-all duration-200 ${props.className || ''}`}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <polyline points="15 18 9 12 15 6" />
  </svg>
);
export const ChevronRightIcon: React.FC<IconProps> = ({ className = "" }) => (
  <span className={`emoji-icon ${className}`} role="img" aria-label="right">➡️</span>
);
export const TableIcon: React.FC<IconProps> = ({ className = "" }) => (
  <span className={`emoji-icon ${className}`} role="img" aria-label="table">📊</span>
);
export const ScissorsIcon: React.FC<IconProps> = ({ className = "" }) => (
  <span className={`emoji-icon ${className}`} role="img" aria-label="scissors">✂️</span>
);
export const CreditCardIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    width="24"
    height="24"
    className={`transition-all duration-200 ${props.className || ''}`}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
    <line x1="1" y1="10" x2="23" y2="10" />
  </svg>
);

// Better aligned credit icon using simple text/symbol
export const CreditIcon: React.FC<IconProps> = ({ className = "" }) => (
  <div
    className={`inline-flex items-center justify-center font-bold ${className}`}
    style={{ fontSize: "10px", lineHeight: "1" }}
  >
    C
  </div>
);
export const EnvelopeIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    className={`transition-all duration-200 ${props.className || ''}`}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);
export const ChartBarIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    width="24"
    height="24"
    className={`transition-all duration-200 ${props.className || ''}`}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <line x1="12" y1="20" x2="12" y2="10" />
    <line x1="18" y1="20" x2="18" y2="4" />
    <line x1="6" y1="20" x2="6" y2="16" />
  </svg>
);
export const ExclamationTriangleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    className={`transition-all duration-200 ${props.className || ''}`}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);
export const ShieldCheckIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    width="24"
    height="24"
    className={`transition-all duration-200 ${props.className || ''}`}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="9 12l2 2 4-4" />
  </svg>
);
export const FilterIcon: React.FC<IconProps> = ({ className = "" }) => (
  <span className={`emoji-icon ${className}`} role="img" aria-label="filter">🔍</span>
);
export const ClockIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    width="24"
    height="24"
    className={`transition-all duration-200 ${props.className || ''}`}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <circle cx="12" cy="12" r="10" />
    <polyline points="12,6 12,12 16,14" />
  </svg>
);
export const LockClosedIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    className={`transition-all duration-200 ${props.className || ''}`}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <circle cx="12" cy="16" r="1" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);
export const SortAscendingIcon: React.FC<IconProps> = ({ className = "" }) => (
  <span className={`emoji-icon ${className}`} role="img" aria-label="sort ascending">⬆️</span>
);
export const SortDescendingIcon: React.FC<IconProps> = ({ className = "" }) => (
  <span className={`emoji-icon ${className}`} role="img" aria-label="sort descending">⬇️</span>
);
export const EyeSlashIcon: React.FC<IconProps> = ({ className = "" }) => (
  <span className={`emoji-icon ${className}`} role="img" aria-label="hide">🙈</span>
);
export const ShareIcon: React.FC<IconProps> = ({ className = "" }) => (
  <span className={`emoji-icon ${className}`} role="img" aria-label="share">📤</span>
);
export const RefreshIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    className={`transition-all duration-200 ${props.className || ''}`}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <polyline points="23 4 23 10 17 10" />
    <polyline points="1 20 1 14 7 14" />
    <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15" />
  </svg>
);
export const BoltIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    width="24"
    height="24"
    className={`transition-all duration-200 ${props.className || ''}`}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);
export const DocumentTextIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    width="24"
    height="24"
    className={`transition-all duration-200 ${props.className || ''}`}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14,2 14,8 20,8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <polyline points="10,9 9,9 8,9" />
  </svg>
);
export const ColorSwatchIcon: React.FC<IconProps> = ({ className = "" }) => (
  <span className={`emoji-icon ${className}`} role="img" aria-label="color">🎨</span>
);
export const PaintBrushIcon: React.FC<IconProps> = ({ className = "" }) => (
  <span className={`emoji-icon ${className}`} role="img" aria-label="brush">🖌️</span>
);
export const CursorArrowRaysIcon: React.FC<IconProps> = ({ className = "" }) => (
  <span className={`emoji-icon ${className}`} role="img" aria-label="cursor">🖱️</span>
);
export const SwatchIcon: React.FC<IconProps> = ({ className = "" }) => (
  <span className={`emoji-icon ${className}`} role="img" aria-label="swatch">🎨</span>
);
export const AdjustmentsHorizontalIcon: React.FC<IconProps> = ({ className = "" }) => (
  <span className={`emoji-icon ${className}`} role="img" aria-label="adjustments">⚙️</span>
);
export const MenuIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
    />
  </svg>
);

export const LaptopIcon: React.FC<IconProps> = ({ className = "" }) => (
  <span className={`emoji-icon ${className}`} role="img" aria-label="laptop">💻</span>
);

export const GiftIcon: React.FC<IconProps> = ({ className = "" }) => (
  <span className={`emoji-icon ${className}`} role="img" aria-label="gift">🎁</span>
);

export const XMarkIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    className={`transition-all duration-200 ${props.className || ''}`}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="18 6 6 6" />
    <path d="6 6 6 6" />
  </svg>
);

export const BugAntIcon: React.FC<IconProps> = ({ className = "" }) => (
  <span className={`emoji-icon ${className}`} role="img" aria-label="bug">🐛</span>
);

export const PaperAirplaneIcon: React.FC<IconProps> = ({ className = "" }) => (
  <span className={`emoji-icon ${className}`} role="img" aria-label="send">✈️</span>
);

export const HeartIcon: React.FC<IconProps> = ({ className = "" }) => (
  <span className={`emoji-icon ${className}`} role="img" aria-label="heart">❤️</span>
);

export const ChatBubbleLeftIcon: React.FC<IconProps> = ({ className = "" }) => (
  <span className={`emoji-icon ${className}`} role="img" aria-label="chat">💬</span>
);

export const PlusIcon: React.FC<IconProps> = ({ className = "" }) => (
  <span className={`emoji-icon ${className}`} role="img" aria-label="plus">➕</span>
);

export const ArrowUpIcon: React.FC<IconProps> = ({ className = "" }) => (
  <span className={`emoji-icon ${className}`} role="img" aria-label="up">⬆️</span>
);

export const ArrowDownIcon: React.FC<IconProps> = ({ className = "" }) => (
  <span className={`emoji-icon ${className}`} role="img" aria-label="down">⬇️</span>
);

// Professional Canvas Toolbar Icons (SVG-based)
export const MindMapIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M6.75 12H4.5m.386-6.364 1.591 1.591"
    />
    <circle cx="12" cy="12" r="3" />
    <circle cx="12" cy="3" r="1.5" />
    <circle cx="21" cy="12" r="1.5" />
    <circle cx="12" cy="21" r="1.5" />
    <circle cx="3" cy="12" r="1.5" />
  </svg>
);

export const ChartIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z"
    />
  </svg>
);

export const KanbanIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 0 1 0 3.75H5.625a1.875 1.875 0 0 1 0-3.75Z"
    />
    <rect
      x="4"
      y="9"
      width="4"
      height="2"
      rx="0.5"
      fill="currentColor"
      opacity="0.6"
    />
    <rect
      x="10"
      y="9"
      width="4"
      height="2"
      rx="0.5"
      fill="currentColor"
      opacity="0.6"
    />
    <rect
      x="16"
      y="9"
      width="4"
      height="2"
      rx="0.5"
      fill="currentColor"
      opacity="0.6"
    />
    <rect
      x="4"
      y="13"
      width="4"
      height="2"
      rx="0.5"
      fill="currentColor"
      opacity="0.4"
    />
    <rect
      x="10"
      y="13"
      width="4"
      height="2"
      rx="0.5"
      fill="currentColor"
      opacity="0.4"
    />
  </svg>
);

export const TableIconSVG: React.FC<React.SVGProps<SVGSVGElement>> = (
  props,
) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 0 1-1.125-1.125M3.375 19.5h17.25a1.125 1.125 0 0 0 1.125-1.125M3.375 19.5v-15.75M20.625 19.5v-15.75M3.375 4.5a1.125 1.125 0 0 1 1.125-1.125h15.75a1.125 1.125 0 0 1 1.125 1.125M3.375 4.5h17.25M3.375 4.5v3h17.25v-3M3.375 10.5h17.25M10.5 19.5V7.5M14.25 19.5V7.5"
    />
  </svg>
);

export const CodeBlockIcon: React.FC<React.SVGProps<SVGSVGElement>> = (
  props,
) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5"
    />
  </svg>
);

export const ConnectorIcon: React.FC<React.SVGProps<SVGSVGElement>> = (
  props,
) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244"
    />
    <circle cx="8" cy="8" r="2" fill="currentColor" opacity="0.6" />
    <circle cx="16" cy="16" r="2" fill="currentColor" opacity="0.6" />
  </svg>
);

export const TextToolIcon: React.FC<React.SVGProps<SVGSVGElement>> = (
  props,
) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"
    />
  </svg>
);

export const ShapeToolIcon: React.FC<React.SVGProps<SVGSVGElement>> = (
  props,
) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M5.25 7.5A2.25 2.25 0 0 1 7.5 5.25h9a2.25 2.25 0 0 1 2.25 2.25v9a2.25 2.25 0 0 1-2.25 2.25h-9a2.25 2.25 0 0 1-2.25-2.25v-9Z"
    />
    <circle
      cx="16"
      cy="8"
      r="2"
      stroke="currentColor"
      strokeWidth="1.5"
      fill="none"
    />
    <path
      d="M12 16 L8 12 L12 8"
      stroke="currentColor"
      strokeWidth="1.5"
      fill="none"
    />
  </svg>
);

// Add missing icons for theme toggle
export const CheckIcon: React.FC<IconProps> = ({ className = "" }) => (
  <span className={`emoji-icon ${className}`} role="img" aria-label="check">✓</span>
);
export const ArrowRightIcon: React.FC<IconProps> = ({ className = "" }) => (
  <span className={`emoji-icon ${className}`} role="img" aria-label="right">→</span>
);
export const CopyIcon: React.FC<IconProps> = ({ className = "" }) => (
  <span className={`emoji-icon ${className}`} role="img" aria-label="copy">📋</span>
);

export const CogIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
    />
  </svg>
);

export const SunIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M6.75 12H4.5m.386-6.364 1.591 1.591"
    />
    <circle
      cx="12"
      cy="12"
      r="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const MoonIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"
    />
  </svg>
);

export const ComputerDesktopIcon: React.FC<React.SVGProps<SVGSVGElement>> = (
  props,
) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25a2.25 2.25 0 012.25-2.25h13.5a2.25 2.25 0 012.25 2.25z"
    />
  </svg>
);

// Additional icons needed for the enhanced generator
export const AdjustmentsIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75"
    />
  </svg>
);

export const TemplateIcon: React.FC<IconProps> = ({ className = "" }) => (
  <span className={`emoji-icon ${className}`} role="img" aria-label="template">📄</span>
);

export const PersonIcon: React.FC<IconProps> = ({ className = "" }) => (
  <span className={`emoji-icon ${className}`} role="img" aria-label="person">👤</span>
);

export const ImageIcon: React.FC<IconProps> = ({ className = "" }) => (
  <span className={`emoji-icon ${className}`} role="img" aria-label="image">🖼️</span>
);

export const VideoIcon: React.FC<IconProps> = ({ className = "" }) => (
  <span className={`emoji-icon ${className}`} role="img" aria-label="video">🎬</span>
);

export const SEOIcon: React.FC<IconProps> = ({ className = "" }) => (
  <span className={`emoji-icon ${className}`} role="img" aria-label="seo">🔍</span>
);

export const AnalyticsIcon: React.FC<IconProps> = ({ className = "" }) => (
  <span className={`emoji-icon ${className}`} role="img" aria-label="analytics">📈</span>
);

export const BulbIcon: React.FC<IconProps> = ({ className = "" }) => (
  <span className={`emoji-icon ${className}`} role="img" aria-label="bulb">💡</span>
);

export const PlayIcon: React.FC<IconProps> = ({ className = "" }) => (
  <span className={`emoji-icon ${className}`} role="img" aria-label="play">▶️</span>
);

export const PauseIcon: React.FC<IconProps> = ({ className = "" }) => (
  <span className={`emoji-icon ${className}`} role="img" aria-label="pause">⏸️</span>
);

export const BookmarkIcon: React.FC<IconProps> = ({ className = "" }) => (
  <span className={`emoji-icon ${className}`} role="img" aria-label="bookmark">🔖</span>
);

export const GlobeIcon: React.FC<IconProps> = ({ className = "" }) => (
  <span className={`emoji-icon ${className}`} role="img" aria-label="globe">🌐</span>
);

export const ColorPaletteIcon: React.FC<IconProps> = ({ className = "" }) => (
  <span className={`emoji-icon ${className}`} role="img" aria-label="palette">🎨</span>
);

export const SoundIcon: React.FC<IconProps> = ({ className = "" }) => (
  <span className={`emoji-icon ${className}`} role="img" aria-label="sound">🔊</span>
);

export const VideoCameraIcon: React.FC<IconProps> = ({ className = "" }) => (
  <span className={`emoji-icon ${className}`} role="img" aria-label="video camera">📹</span>
);

export const AcademicCapIcon: React.FC<IconProps> = ({ className = "" }) => (
  <span className={`emoji-icon ${className}`} role="img" aria-label="education">🎓</span>
);

export const RadioIcon: React.FC<IconProps> = ({ className = "" }) => (
  <span className={`emoji-icon ${className}`} role="img" aria-label="radio">📻</span>
);

export const RocketLaunchIcon: React.FC<IconProps> = ({ className = "" }) => (
  <span className={`emoji-icon ${className}`} role="img" aria-label="rocket">🚀</span>
);

export const SmartTemplateIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    className={`transition-all duration-200 ${props.className || ''}`}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
    <path d="M7 7h4"/>
    <path d="M7 12h10"/>
    <path d="M7 17h6"/>
    <rect x="15" y="7" width="2" height="2" fill="currentColor"/>
  </svg>
);

export const AIPersonaIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    className={`transition-all duration-200 ${props.className || ''}`}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2Z"/>
    <path d="M21 9v6c0 1.1-.9 2-2 2s-2-.9-2-2V9c0-1.1.9-2 2-2s2 .9 2 2Z"/>
    <path d="M7 9v6c0 1.1-.9 2-2 2s-2-.9-2-2V9c0-1.1.9-2 2-2s2 .9 2 2Z"/>
    <path d="M12 6v2"/>
    <path d="M12 8c-2.5 0-4.5 2-4.5 4.5V17c0 1.1.9 2 2 2h5c1.1 0 2-.9 2-2v-4.5C16.5 10 14.5 8 12 8Z"/>
    <circle cx="10" cy="15" r="1" fill="currentColor"/>
    <circle cx="14" cy="15" r="1" fill="currentColor"/>
  </svg>
);

export const VoiceInputIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    className={`transition-all duration-200 ${props.className || ''}`}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M12 2a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/>
    <path d="M19 10v1a7 7 0 0 1-14 0v-1"/>
    <path d="M12 18v4"/>
    <path d="M8 22h8"/>
    <circle cx="17" cy="8" r="2" fill="currentColor" opacity="0.5"/>
    <circle cx="19" cy="6" r="1" fill="currentColor" opacity="0.3"/>
  </svg>
);

export const OptimizePromptIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    className={`transition-all duration-200 ${props.className || ''}`}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8Z"/>
    <circle cx="18" cy="6" r="2" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.6"/>
    <circle cx="6" cy="18" r="1.5" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.6"/>
  </svg>
);

export const ResultsIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    className={`transition-all duration-200 ${props.className || ''}`}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14,2 14,8 20,8"/>
    <line x1="16" y1="13" x2="8" y2="13"/>
    <line x1="16" y1="17" x2="8" y2="17"/>
    <polyline points="10,9 9,9 8,9"/>
    <circle cx="9" cy="13" r="1" fill="currentColor"/>
    <circle cx="9" cy="17" r="1" fill="currentColor"/>
  </svg>
);
