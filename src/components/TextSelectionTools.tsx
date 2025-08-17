import React, { useState, useRef, useEffect, useMemo } from 'react';
import { MagicToolsManager, MagicTool } from '../config/magicToolsConfig';

interface TextSelection {
  text: string;
  startOffset: number;
  endOffset: number;
  containerElement: Element;
}

interface TextSelectionToolsProps {
  children: React.ReactNode;
  onRegenerateText?: (selectedText: string, context: string) => void;
  onRefineText?: (selectedText: string, action: string) => void;
  onCustomAction?: (selectedText: string, action: string, toolId: string) => void;
  isPremium?: boolean;
  isMagicSelectActive?: boolean;
  className?: string;
}

export const TextSelectionTools: React.FC<TextSelectionToolsProps> = ({
  children,
  onRegenerateText,
  onRefineText,
  onCustomAction,
  isPremium = false,
  isMagicSelectActive = false,
  className = '',
}) => {
  const [selection, setSelection] = useState<TextSelection | null>(null);
  const [showMagicTools, setShowMagicTools] = useState(false);
  const [toolsPosition, setToolsPosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const toolsRef = useRef<HTMLDivElement>(null);

  // Get available magic tools based on user's premium status
  const availableTools = useMemo(() => {
    return MagicToolsManager.getAvailableTools(isPremium);
  }, [isPremium]);

  // Modern icon mapping with better visuals
  const getIcon = (iconName: string) => {
    const iconClass = "w-4 h-4 stroke-current";

    switch (iconName) {
      case 'RefreshIcon':
        return <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7L21.015 9.348" /></svg>;
      case 'SparklesIcon':
        return <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" /></svg>;
      case 'EditIcon':
      case 'PencilIcon':
        return <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" /></svg>;
      case 'WandIcon':
        return <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" /></svg>;
      case 'ClipboardIcon':
        return <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 0 0 .75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 0 0-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0 1 12 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 0 1-.673-.38m0 0A2.18 2.18 0 0 1 3 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 0 1 3.413-.387m7.5 0V5.25A2.25 2.25 0 0 0 13.5 3h-3a2.25 2.25 0 0 0-2.25 2.25v.894m7.5 0a48.667 48.667 0 0 0-7.5 0M12 12.75h.008v.008H12v-.008Z" /></svg>;
      case 'LanguageIcon':
        return <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="m10.5 21 5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 0 1 6-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C11.176 10.658 7.69 15.08 3 17.502m9.334-12.138c.896.061 1.785.147 2.666.257m-4.589 8.495a18.023 18.023 0 0 1-3.827-5.802" /></svg>;
      case 'CheckCircleIcon':
        return <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" /></svg>;
      case 'ChartBarIcon':
        return <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" /></svg>;
      case 'EmojiIcon':
        return <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15.182 15.182a4.5 4.5 0 0 1-6.364 0M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Z" /></svg>;
      case 'ZapIcon':
        return <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3.75 13.5 10.5 8.25l2.25 4.5L21 3M12 18l-1.5-3L15 9l-6 10.5Z" /></svg>;
      case 'ExpandIcon':
        return <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" /></svg>;
      case 'CompressIcon':
        return <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 9V4.5M9 9H4.5M9 9 3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5 5.25 5.25" /></svg>;
      case 'TieIcon':
        return <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM4 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 10.374 21c-2.331 0-4.512-.645-6.374-1.766Z" /></svg>;
      case 'ChatIcon':
        return <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" /></svg>;
      default:
        return <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" /></svg>;
    }
  };

  // Handle text selection with premium UX - only on mouseup
  const handleTextSelection = () => {
    // Small delay to ensure selection is complete
    setTimeout(() => {
      const windowSelection = window.getSelection();

      if (!windowSelection || windowSelection.rangeCount === 0) {
        setShowMagicTools(false);
        setSelection(null);
        if (containerRef.current) {
          containerRef.current.classList.remove('selecting');
        }
        return;
      }

      const range = windowSelection.getRangeAt(0);
      const selectedText = range.toString().trim();

      // Only show magic tools when Magic Select is active
      if (!isMagicSelectActive) {
        return;
      }

      // Require minimum selection length
      if (selectedText.length < 2) {
        setShowMagicTools(false);
        setSelection(null);
        if (containerRef.current) {
          containerRef.current.classList.remove('selecting');
        }
        return;
      }

      // Check if selection is within our container
      const container = containerRef.current;
      if (!container || !container.contains(range.commonAncestorContainer)) {
        return;
      }

      console.log('🎯 Text selected:', selectedText);

      // Add selecting class for enhanced styling
      container.classList.add('selecting');

      // Get selection position for elegant tools positioning
      const rect = range.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();

      const newSelection = {
        text: selectedText,
        startOffset: range.startOffset,
        endOffset: range.endOffset,
        containerElement: range.commonAncestorContainer.parentElement || container,
      };

      // Position tools elegantly above selection, ensure it's visible
      const newToolsPosition = {
        x: Math.max(10, Math.min(rect.left + (rect.width / 2) - containerRect.left, containerRect.width - 240)),
        y: Math.max(10, rect.top - containerRect.top - 60), // Less space for smaller panel
      };

      console.log('🎯 Setting selection and showing tools');
      setSelection(newSelection);
      setToolsPosition(newToolsPosition);
      setShowMagicTools(true);
    }, 100); // Slightly longer delay to ensure user has let go
  };

  // Handle clicking outside to close tools
  const handleClickOutside = (event: MouseEvent) => {
    if (toolsRef.current && !toolsRef.current.contains(event.target as Node)) {
      setShowMagicTools(false);
      setSelection(null);
      window.getSelection()?.removeAllRanges();
    }
  };

  // Handle magic tool action
  const handleMagicTool = (tool: MagicTool) => {
    if (!selection) return;

    const context = getTextContext(selection);

    switch (tool.action) {
      case 'regenerate':
        onRegenerateText?.(selection.text, context);
        break;
      case 'refine':
        onRefineText?.(selection.text, tool.customAction || tool.id);
        break;
      case 'custom':
        onCustomAction?.(selection.text, tool.customAction || tool.id, tool.id);
        break;
    }

    setShowMagicTools(false);
    setSelection(null);
    window.getSelection()?.removeAllRanges();
  };

  // Get surrounding context for better regeneration
  const getTextContext = (selection: TextSelection) => {
    const element = selection.containerElement;
    const fullText = element.textContent || '';
    const beforeText = fullText.substring(0, fullText.indexOf(selection.text));
    const afterText = fullText.substring(fullText.indexOf(selection.text) + selection.text.length);
    
    return {
      before: beforeText.slice(-100), // Last 100 chars before
      after: afterText.slice(0, 100), // First 100 chars after
      full: fullText,
    };
  };

  useEffect(() => {
    console.log('🎯 TextSelectionTools: Adding event listeners');

    // Only use mouseup for better UX - menu appears only after user lets go
    document.addEventListener('mouseup', handleTextSelection);
    document.addEventListener('click', handleClickOutside);

    return () => {
      console.log('🎯 TextSelectionTools: Removing event listeners');
      document.removeEventListener('mouseup', handleTextSelection);
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isMagicSelectActive]); // Re-run when magic select state changes

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Content with magic/normal text selection capability */}
      <div
        className={`
          text-selectable transition-all duration-300
          ${isMagicSelectActive
            ? 'magic-select-mode premium-text-selectable magic-select-active'
            : 'standard-text-selectable'
          }
        `}
        style={{
          userSelect: 'text',
          WebkitUserSelect: 'text',
          MozUserSelect: 'text',
          msUserSelect: 'text',
          ...(isMagicSelectActive && {
            background: 'linear-gradient(45deg, rgba(139, 92, 246, 0.05), rgba(236, 72, 153, 0.05))',
            borderRadius: '8px',
            padding: '4px',
          }),
        }}
        onMouseUp={handleTextSelection}
        onTouchEnd={handleTextSelection}
      >
        {children}
      </div>

      {/* Magic Tools Floating Panel */}
      {showMagicTools && selection && (
        <div
          ref={toolsRef}
          className="absolute z-50 transform -translate-x-1/2"
          style={{
            left: toolsPosition.x,
            top: toolsPosition.y,
          }}
        >
          <div className="bg-slate-900/95 backdrop-blur-xl border border-slate-700/50 rounded-xl shadow-2xl p-3 min-w-[280px] animate-scale-in">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-2xl" />
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-600/30">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                {getIcon('SparklesIcon')}
              </div>
              <div className="flex-1">
                <span className="text-xs font-semibold text-white">Magic Tools</span>
                <div className="text-xs text-slate-400 truncate max-w-[160px]">
                  "{selection.text.length > 20 ? `${selection.text.slice(0, 20)}...` : selection.text}"
                </div>
              </div>
            </div>

            <div className="relative z-10 grid grid-cols-1 gap-1.5">
              {availableTools.map((tool) => (
                <button
                  key={tool.id}
                  onClick={() => handleMagicTool(tool)}
                  className="flex items-center gap-2 p-2 rounded-lg bg-slate-800/50 hover:bg-slate-700/70 border border-slate-700/30 hover:border-slate-600/50 transition-all duration-300 group magic-tool-button backdrop-blur-sm"
                >
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center border border-white/10"
                    style={{
                      background: `linear-gradient(135deg, ${tool.color}20, ${tool.color}10)`,
                      boxShadow: `0 0 15px ${tool.color}15`
                    }}
                  >
                    <div style={{ color: tool.color }} className="w-3.5 h-3.5">
                      {getIcon(tool.iconName)}
                    </div>
                  </div>
                  <div className="flex-1 text-left">
                    <div className="text-xs font-semibold text-white group-hover:text-slate-100 flex items-center gap-1.5 mb-0.5">
                      {tool.label}
                      {tool.requiresPremium && !isPremium && (
                        <span className="px-1.5 py-0.5 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-400 text-xs rounded-full font-bold border border-yellow-500/20">
                          PRO
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-400 group-hover:text-slate-300 leading-tight">
                      {tool.description}
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Tip */}
            <div className="relative z-10 mt-2 pt-2 border-t border-slate-700/30">
              <div className="text-xs text-slate-500 text-center flex items-center justify-center gap-1.5">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <span className="text-xs">Select text to access tools</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TextSelectionTools;
