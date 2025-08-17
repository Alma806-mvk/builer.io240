import React, { useState, useRef, useEffect } from "react";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";
import {
  DocumentTextIcon,
  VideoCameraIcon,
  TagIcon,
  PlayIcon,
  PhotoIcon,
  ClipboardDocumentListIcon,
  PuzzlePieceIcon,
  MagnifyingGlassIcon,
  FilmIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/solid";

interface GenerateOption {
  id: string;
  label: string;
  icon: React.ReactNode;
  description?: string;
}

interface GenerateDropdownProps {
  onOptionSelect: (optionId: string, originalIdea: string) => void;
  originalIdea: string;
  disabled?: boolean;
}

const generateOptions: GenerateOption[] = [
  {
    id: "content-idea",
    label: "Content Idea",
    icon: <DocumentTextIcon className="w-4 h-4" />,
    description: "Generate a new content idea",
  },
  {
    id: "script",
    label: "Script",
    icon: <VideoCameraIcon className="w-4 h-4" />,
    description: "Create a full video/audio script",
  },
  {
    id: "title-headline",
    label: "Title/Headline",
    icon: <TagIcon className="w-4 h-4" />,
    description: "Generate compelling titles and headlines",
  },
  {
    id: "video-hook",
    label: "Engaging Video Hook",
    icon: <PlayIcon className="w-4 h-4" />,
    description: "Create attention-grabbing opening hooks",
  },
  {
    id: "thumbnail-concept",
    label: "Thumbnail Concept",
    icon: <PhotoIcon className="w-4 h-4" />,
    description: "Design thumbnail concepts and ideas",
  },
  {
    id: "content-brief",
    label: "Content Brief",
    icon: <ClipboardDocumentListIcon className="w-4 h-4" />,
    description: "Create detailed content briefs",
  },
  {
    id: "polls-quizzes",
    label: "Polls & Quizzes",
    icon: <PuzzlePieceIcon className="w-4 h-4" />,
    description: "Generate interactive content",
  },
  {
    id: "content-gap-finder",
    label: "Content Gap Finder (via Search)",
    icon: <MagnifyingGlassIcon className="w-4 h-4" />,
    description: "Find content gaps in your niche",
  },
  {
    id: "micro-video-script",
    label: "Micro-Video Script",
    icon: <FilmIcon className="w-4 h-4" />,
    description: "Create short-form video scripts",
  },
  {
    id: "ab-test-variations",
    label: "A/B Test Variations",
    icon: <ArrowPathIcon className="w-4 h-4" />,
    description: "Generate multiple content variations",
  },
];

export const GenerateDropdown: React.FC<GenerateDropdownProps> = ({
  onOptionSelect,
  originalIdea,
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleOptionClick = (optionId: string) => {
    onOptionSelect(optionId, originalIdea);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled}
        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:from-gray-600 disabled:to-gray-600 text-white text-sm font-medium rounded-lg transition-all duration-200 disabled:cursor-not-allowed"
      >
        <span>Generate</span>
        {isOpen ? (
          <ChevronUpIcon className="w-4 h-4" />
        ) : (
          <ChevronDownIcon className="w-4 h-4" />
        )}
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-80 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl z-50 max-h-96 overflow-y-auto">
          <div className="p-3 border-b border-slate-700">
            <h3 className="text-sm font-semibold text-white">Generate:</h3>
          </div>
          <div className="p-2">
            {generateOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => handleOptionClick(option.id)}
                className="w-full flex items-start gap-3 p-3 rounded-lg hover:bg-slate-700/50 transition-colors text-left group"
              >
                <div className="flex-shrink-0 p-2 bg-slate-700 rounded-md group-hover:bg-slate-600 transition-colors">
                  {option.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-white group-hover:text-emerald-300 transition-colors">
                    {option.label}
                  </div>
                  {option.description && (
                    <div className="text-xs text-slate-400 mt-1">
                      {option.description}
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default GenerateDropdown;
