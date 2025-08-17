import React, { useState, useRef, useEffect, useMemo } from 'react';
import { MagicToolsManager, MagicTool } from '../config/magicToolsConfig';
import { useCredits } from '../context/CreditContext';
import { CREDIT_COSTS } from '../types/credits';

interface TextSelection {
  text: string;
  startOffset: number;
  endOffset: number;
  containerElement: Element;
}

interface EnhancedTextSelectionToolsProps {
  children: React.ReactNode;
  onRegenerateText?: (selectedText: string, context: string, options?: any) => Promise<string>;
  onRefineText?: (selectedText: string, action: string) => Promise<string>;
  onCustomAction?: (selectedText: string, action: string, toolId: string) => Promise<string>;
  isPremium?: boolean;
  isMagicSelectActive?: boolean;
  className?: string;
}

export const EnhancedTextSelectionTools: React.FC<EnhancedTextSelectionToolsProps> = ({
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
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [previewData, setPreviewData] = useState<{
    original: string;
    processed: string;
    action: string;
    toolLabel: string;
  } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const toolsRef = useRef<HTMLDivElement>(null);
  const { canAfford, deductCredits, credits } = useCredits();

  // Get available magic tools based on user's premium status
  const availableTools = useMemo(() => {
    return MagicToolsManager.getAvailableTools(isPremium);
  }, [isPremium]);

  // Modern icon components with app design system
  const getIcon = (iconName: string) => {
    const iconClass = "w-4 h-4";

    switch (iconName) {
      case 'RefreshIcon':
        return (
          <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" 
              d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7L21.015 9.348" />
          </svg>
        );
      case 'SparklesIcon':
        return (
          <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" 
              d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" />
          </svg>
        );
      case 'ExpandIcon':
        return (
          <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" 
              d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
          </svg>
        );
      case 'CompressIcon':
        return (
          <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" 
              d="M9 9V4.5M9 9H4.5M9 9 3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5 5.25 5.25" />
          </svg>
        );
      case 'TieIcon':
        return (
          <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" 
              d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
          </svg>
        );
      case 'ChatIcon':
        return (
          <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" 
              d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9 8.25Z" />
          </svg>
        );
      case 'EmojiIcon':
        return (
          <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" 
              d="M15.182 15.182a4.5 4.5 0 0 1-6.364 0M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Z" />
          </svg>
        );
      case 'CheckCircleIcon':
        return (
          <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" 
              d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
          </svg>
        );
      case 'ChartBarIcon':
        return (
          <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" 
              d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
          </svg>
        );
      case 'LanguageIcon':
        return (
          <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" 
              d="m10.5 21 5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 0 1 6-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C11.176 10.658 7.69 15.08 3 17.502m9.334-12.138c.896.061 1.785.147 2.666.257m-4.589 8.495a18.023 18.023 0 0 1-3.827-5.802" />
          </svg>
        );
      default:
        return (
          <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" 
              d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" />
          </svg>
        );
    }
  };

  // Handle text selection - only on mouseup
  const handleTextSelection = () => {
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

      // Check if selection is within excluded elements (titles, headings, etc.)
      const selectedElement = range.commonAncestorContainer.nodeType === Node.TEXT_NODE
        ? range.commonAncestorContainer.parentElement
        : range.commonAncestorContainer as Element;

      // Function to check if element or its parents should be excluded from magic select
      const isExcludedElement = (element: Element | null): boolean => {
        if (!element) return false;

        // First check data attributes (most reliable)
        if (element.dataset?.magicSelectable === 'false') {
          return true;
        }

        // Check if it's a heading element
        if (['H1', 'H2', 'H3', 'H4', 'H5', 'H6'].includes(element.tagName)) {
          return true;
        }

        // Check content type data attribute
        const contentType = element.dataset?.contentType;
        if (contentType && ['heading', 'idea-title', 'sources', 'actions'].includes(contentType)) {
          return true;
        }

        // Check if it has classes that indicate it's a title or header
        const classesToExclude = [
          'title', 'heading', 'header', 'idea-header', 'section-title',
          'content-title', 'output-title', 'idea-title', 'no-magic-select'
        ];

        if (element.className && typeof element.className === 'string') {
          const hasExcludedClass = classesToExclude.some(cls =>
            element.className.toLowerCase().includes(cls)
          );
          if (hasExcludedClass) return true;
        }

        // Check if the text content matches idea patterns (fallback)
        const textContent = element.textContent || '';
        const ideaPatterns = [
          /^\s*🎯\s*\*\*IDEA\s*#\d+/i,
          /^\s*IDEA\s*#?\d+/i,
          /^\s*\*\*IDEA\s*#?\d+/i,
          /^\s*#\s*IDEA\s*\d+/i,
          /^\s*Idea\s*\d+/i,
          /^\s*\d+\.\s*IDEA/i,
        ];

        if (ideaPatterns.some(pattern => pattern.test(textContent))) {
          return true;
        }

        return false;
      };

      // Check if the selection or any parent element should be excluded
      let elementToCheck = selectedElement;
      while (elementToCheck && elementToCheck !== container) {
        if (isExcludedElement(elementToCheck)) {
          console.log('🎯 Selection blocked - element excluded:', {
            selectedText,
            elementTag: elementToCheck.tagName,
            elementClass: elementToCheck.className,
            magicSelectable: elementToCheck.dataset?.magicSelectable,
            contentType: elementToCheck.dataset?.contentType
          });
          setShowMagicTools(false);
          setSelection(null);
          return;
        }
        elementToCheck = elementToCheck.parentElement;
      }

      // Additional check: if selected text itself looks like a title
      if (isExcludedElement(selectedElement)) {
        console.log('🎯 Selection blocked - selected element is a title:', selectedText);
        setShowMagicTools(false);
        setSelection(null);
        return;
      }

      // Check if we're in an explicitly allowed content area
      const isInContentArea = (element: Element | null): boolean => {
        if (!element) return false;

        // Look for parent elements that indicate this is main content
        let currentElement = element;
        while (currentElement && currentElement !== container) {
          const className = currentElement.className || '';
          const dataAttrs = currentElement.dataset || {};

          // Check for explicitly allowed content areas
          if (
            dataAttrs.contentArea === 'true' ||
            dataAttrs.magicSelectableContainer === 'true' ||
            className.includes('styled-text-output') ||
            className.includes('generated-content') ||
            className.includes('main-content') ||
            className.includes('content-body')
          ) {
            return true;
          }

          // If we hit an explicitly non-selectable area, stop
          if (
            dataAttrs.magicSelectable === 'false' ||
            dataAttrs.contentType === 'sources' ||
            dataAttrs.contentType === 'actions' ||
            className.includes('no-magic-select') ||
            className.includes('title-area') ||
            className.includes('header-area')
          ) {
            return false;
          }

          currentElement = currentElement.parentElement;
        }

        // If we're in a styled-text-output area, allow by default
        if (container?.querySelector('.styled-text-output')?.contains(element)) {
          return true;
        }

        return false; // Default to NOT allowing selection if no explicit content area found
      };

      // Check if selection is in an allowed content area
      if (!isInContentArea(selectedElement)) {
        console.log('🎯 Selection blocked - not in allowed content area:', {
          selectedText,
          elementTag: selectedElement?.tagName,
          elementClass: selectedElement?.className,
          contentArea: selectedElement?.dataset?.contentArea,
          magicSelectableContainer: selectedElement?.dataset?.magicSelectableContainer
        });
        setShowMagicTools(false);
        setSelection(null);
        return;
      }

      // Add selecting class for enhanced styling
      container.classList.add('selecting');

      // Get selection position for tools positioning
      const rect = range.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();

      const newSelection = {
        text: selectedText,
        startOffset: range.startOffset,
        endOffset: range.endOffset,
        containerElement: range.commonAncestorContainer.parentElement || container,
      };

      // Position tools next to selection (fixed positioning relative to viewport)
      const newToolsPosition = {
        x: Math.max(10, Math.min(rect.left + (rect.width / 2), window.innerWidth - 320)),
        y: Math.max(10, rect.top - 80),
      };

      console.log('🎯 Setting position:', newToolsPosition, 'for selection:', selectedText);
      setSelection(newSelection);
      setToolsPosition(newToolsPosition);
      setShowMagicTools(true);
    }, 100);
  };

  // Handle magic tool action with credit check and preview
  const handleMagicTool = async (tool: MagicTool) => {
    if (!selection) return;

    console.log('🎯 Magic tool clicked:', tool.label, 'for text:', selection.text);

    // Check if user has credits
    if (!canAfford('content_generation', 1)) {
      alert('Insufficient credits! You need 1 credit to use this feature.');
      return;
    }

    setIsProcessing(true);
    const context = getTextContext(selection);
    console.log('🎯 Text context:', context);

    try {
      let result = '';
      
      // Deduct credit first
      const creditDeducted = await deductCredits('content_generation', 1, `Magic Tool: ${tool.label}`);
      if (!creditDeducted) {
        alert('Failed to deduct credits. Please try again.');
        setIsProcessing(false);
        return;
      }

      // Process based on tool action
      switch (tool.action) {
        case 'regenerate':
          if (onRegenerateText) {
            result = await onRegenerateText(selection.text, context);
          }
          break;
        case 'refine':
          if (onRefineText) {
            result = await onRefineText(selection.text, tool.customAction || tool.id);
          }
          break;
        case 'custom':
          if (onCustomAction) {
            result = await onCustomAction(selection.text, tool.customAction || tool.id, tool.id);
          }
          break;
      }

      console.log('🎯 Generated result:', result, 'type:', typeof result);

      if (result && result.trim && result.trim()) {
        // Show preview
        setPreviewData({
          original: selection.text,
          processed: result,
          action: tool.customAction || tool.id,
          toolLabel: tool.label
        });
        setShowPreview(true);
        setShowMagicTools(false);
      } else {
        console.log('🎯 No result or empty result received:', result);
        alert('No result generated. Please try again with different text.');
      }
    } catch (error) {
      console.error('Magic tool error:', error);
      alert(`Failed to process text: ${error.message}. Please try again.`);
    } finally {
      setIsProcessing(false);
    }
  };

  // Get surrounding context for better processing
  const getTextContext = (selection: TextSelection) => {
    const element = selection.containerElement;
    const fullText = element.textContent || '';
    const beforeText = fullText.substring(0, fullText.indexOf(selection.text));
    const afterText = fullText.substring(fullText.indexOf(selection.text) + selection.text.length);
    
    return {
      before: beforeText.slice(-100),
      after: afterText.slice(0, 100),
      full: fullText,
    };
  };

  // Handle applying the preview
  const handleApplyPreview = () => {
    if (!previewData || !selection) return;

    // Replace the selected text with processed text
    const container = selection.containerElement;
    const fullText = container.textContent || '';
    const beforeText = fullText.substring(0, fullText.indexOf(selection.text));
    const afterText = fullText.substring(fullText.indexOf(selection.text) + selection.text.length);
    
    container.textContent = beforeText + previewData.processed + afterText;
    
    // Clear states
    setShowPreview(false);
    setPreviewData(null);
    setSelection(null);
    window.getSelection()?.removeAllRanges();
  };

  // Handle preview rejection
  const handleRejectPreview = () => {
    setShowPreview(false);
    setPreviewData(null);
    // Keep selection for potential retry
  };

  // Handle clicking outside to close tools
  const handleClickOutside = (event: MouseEvent) => {
    if (toolsRef.current && !toolsRef.current.contains(event.target as Node)) {
      setShowMagicTools(false);
      setSelection(null);
      window.getSelection()?.removeAllRanges();
    }
  };

  useEffect(() => {
    // Only use mouseup for better UX
    document.addEventListener('mouseup', handleTextSelection);
    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('mouseup', handleTextSelection);
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isMagicSelectActive]);

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Content with magic text selection capability */}
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
      >
        {children}
      </div>

      {/* Magic Tools Floating Panel */}
      {showMagicTools && selection && !showPreview && (
        <div
          ref={toolsRef}
          className="fixed z-50 transform -translate-x-1/2"
          style={{
            left: toolsPosition.x,
            top: toolsPosition.y,
          }}
        >
          <div className="bg-slate-900/95 backdrop-blur-xl border border-slate-700/50 rounded-xl shadow-2xl p-3 min-w-[300px] animate-scale-in">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl" />
            
            {/* Header */}
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-600/30 relative z-10">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                {getIcon('SparklesIcon')}
              </div>
              <div className="flex-1">
                <span className="text-xs font-semibold text-white">Magic Tools</span>
                <div className="text-xs text-slate-400 truncate max-w-[160px]">
                  "{selection.text.length > 20 ? `${selection.text.slice(0, 20)}...` : selection.text}"
                </div>
              </div>
              <div className="text-xs text-yellow-400 font-medium">
                {credits?.totalCredits || 0} ⚡
              </div>
            </div>

            {/* Tools */}
            <div className="relative z-10 grid grid-cols-1 gap-1.5">
              {availableTools.map((tool) => {
                const canUseFeature = canAfford('content_generation', 1);
                
                return (
                  <button
                    key={tool.id}
                    onClick={() => handleMagicTool(tool)}
                    disabled={isProcessing || !canUseFeature}
                    className={`flex items-center gap-2 p-2 rounded-lg border transition-all duration-300 group backdrop-blur-sm ${
                      canUseFeature 
                        ? 'bg-slate-800/50 hover:bg-slate-700/70 border-slate-700/30 hover:border-slate-600/50' 
                        : 'bg-slate-800/30 border-slate-700/20 opacity-60 cursor-not-allowed'
                    }`}
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
                        <span className="px-1.5 py-0.5 bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-300 text-xs rounded-full font-bold border border-blue-500/20">
                          1⚡
                        </span>
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
                );
              })}
            </div>

            {/* Credit info */}
            <div className="relative z-10 mt-2 pt-2 border-t border-slate-700/30">
              <div className="text-xs text-slate-500 text-center flex items-center justify-center gap-1.5">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <span className="text-xs">Each action costs 1 credit</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {showPreview && previewData && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 rounded-xl border border-slate-700 max-w-4xl w-full max-h-[80vh] overflow-hidden shadow-2xl">
            {/* Header */}
            <div className="p-4 border-b border-slate-700 bg-gradient-to-r from-purple-500/10 to-pink-500/10">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                {getIcon('SparklesIcon')}
                Preview: {previewData.toolLabel}
              </h3>
              <p className="text-sm text-slate-400 mt-1">Review the changes before applying</p>
            </div>

            {/* Content */}
            <div className="p-4 space-y-4 overflow-y-auto max-h-[60vh]">
              {/* Before */}
              <div>
                <h4 className="text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
                  <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                  Original
                </h4>
                <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/30">
                  <p className="text-slate-200 text-sm leading-relaxed">{previewData.original}</p>
                </div>
              </div>

              {/* After */}
              <div>
                <h4 className="text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Enhanced
                </h4>
                <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-lg p-3 border border-purple-500/30">
                  <p className="text-white text-sm leading-relaxed">{previewData.processed}</p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="p-4 border-t border-slate-700 flex gap-3 justify-end">
              <button
                onClick={handleRejectPreview}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors text-sm font-medium"
              >
                Reject
              </button>
              <button
                onClick={handleApplyPreview}
                className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-lg transition-all text-sm font-medium shadow-lg"
              >
                Apply Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedTextSelectionTools;
