import React, { useState, useRef, useEffect } from "react";
import { Platform, ContentType } from "../../types";
import AdvancedSuggestionEngine from "./AdvancedSuggestionEngine";

interface SmartInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  platform: Platform;
  contentType: ContentType;
  targetAudience?: string;
  smartSuggestionsEnabled?: boolean;
  hasPremiumAccess?: boolean;
  style?: React.CSSProperties;
  rows?: number;
  disabled?: boolean;
}

const SmartInput: React.FC<SmartInputProps> = ({
  value,
  onChange,
  placeholder,
  platform,
  contentType,
  targetAudience,
  smartSuggestionsEnabled = true,
  hasPremiumAccess = false,
  style,
  rows = 4,
  disabled = false,
}) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [cursorPosition, setCursorPosition] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Track focus and input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    setCursorPosition(e.target.selectionStart || 0);

    // Show suggestions if user has typed enough, smart suggestions are enabled, has premium access, and content type is Idea
    if (
      smartSuggestionsEnabled &&
      hasPremiumAccess &&
      contentType === ContentType.Idea &&
      newValue.trim().length >= 2
    ) {
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleFocus = () => {
    if (
      smartSuggestionsEnabled &&
      hasPremiumAccess &&
      contentType === ContentType.Idea &&
      value.trim().length >= 2
    ) {
      setShowSuggestions(true);
    }
  };

  const handleBlur = (e: React.FocusEvent) => {
    // Delay hiding suggestions to allow clicks
    setTimeout(() => {
      if (!containerRef.current?.contains(document.activeElement)) {
        setShowSuggestions(false);
      }
    }, 150);
  };

  const handleSuggestionSelect = (suggestion: string) => {
    onChange(suggestion);
    setShowSuggestions(false);

    // Focus back on textarea
    setTimeout(() => {
      textareaRef.current?.focus();
      textareaRef.current?.setSelectionRange(
        suggestion.length,
        suggestion.length,
      );
    }, 0);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Let SmartSuggestions handle navigation when visible
    if (
      showSuggestions &&
      ["ArrowDown", "ArrowUp", "Enter", "Escape"].includes(e.key)
    ) {
      // SmartSuggestions will handle these
      return;
    }
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Enhanced Textarea */}
      <div className="relative">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          rows={rows}
          disabled={disabled}
          data-tour="input-area"
          style={{
            ...style,
            paddingRight: "3rem", // Space for indicator
          }}
          className={`w-full transition-all duration-200 ${
            showSuggestions ? "ring-2 ring-indigo-500/50" : ""
          }`}
        />

        {/* Smart indicator - only for Content Ideas */}
        {value.trim().length >= 2 && contentType === ContentType.Idea && (
          <div className="absolute top-3 right-3 flex items-center gap-1">
            <div
              className={`w-2 h-2 rounded-full transition-colors ${
                smartSuggestionsEnabled && hasPremiumAccess && showSuggestions
                  ? "bg-indigo-400 animate-pulse"
                  : smartSuggestionsEnabled && hasPremiumAccess
                    ? "bg-slate-500"
                    : "bg-slate-600"
              }`}
            ></div>
          </div>
        )}

        {/* Character count and smart status */}
        <div className="absolute bottom-2 right-3 flex items-center gap-2">
          <div className="text-xs text-slate-500">{value.length} chars</div>
        </div>
      </div>

      {/* Advanced Smart Suggestions */}
      <AdvancedSuggestionEngine
        input={value}
        platform={platform}
        contentType={contentType}
        onSuggestionSelect={handleSuggestionSelect}
        onClose={() => setShowSuggestions(false)}
        isVisible={showSuggestions}
        targetAudience={targetAudience}
        enabled={smartSuggestionsEnabled && hasPremiumAccess}
      />
    </div>
  );
};

export default SmartInput;
