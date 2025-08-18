import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Sparkles, ArrowRight, Layers } from 'lucide-react';
import { promptExamples, promptCategories, getExamplesByCategory, type PromptExample } from '../data/promptExamples';
import '../styles/promptCarousel.css';
import '../utils/testPromptCarousel';

// Import all the Lucide icons we need
import * as LucideIcons from 'lucide-react';

interface PromptExamplesCarouselProps {
  onSelectPrompt: (prompt: string) => void;
  onToggleGuided: () => void;
  className?: string;
}

export const PromptExamplesCarousel: React.FC<PromptExamplesCarouselProps> = ({
  onSelectPrompt,
  onToggleGuided,
  className = ''
}) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showTooltip, setShowTooltip] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const filteredExamples = getExamplesByCategory(selectedCategory);

  // Check scroll position to show/hide navigation arrows
  const checkScrollPosition = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  useEffect(() => {
    checkScrollPosition();
    const scrollElement = scrollRef.current;
    if (scrollElement) {
      scrollElement.addEventListener('scroll', checkScrollPosition);
      return () => scrollElement.removeEventListener('scroll', checkScrollPosition);
    }
  }, [filteredExamples]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 320;
      const newScrollLeft = scrollRef.current.scrollLeft + 
        (direction === 'left' ? -scrollAmount : scrollAmount);
      
      scrollRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
    }
  };

  const handlePromptSelect = (example: PromptExample) => {
    onSelectPrompt(example.prompt);
    setShowTooltip(example.id);
    setTimeout(() => setShowTooltip(null), 1500);
  };

  // Helper function to get Lucide icon component
  const getIconComponent = (iconName: string) => {
    const IconComponent = (LucideIcons as any)[iconName];
    return IconComponent || LucideIcons.Circle;
  };

  return (
    <div className={`relative ${className}`}>
      {/* Professional Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-500/20 to-purple-600/20 border border-blue-500/30 rounded-xl">
            <Sparkles className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-[var(--text-primary)] tracking-tight">
              Quick Start Templates
            </h3>
            <p className="text-sm text-[var(--text-tertiary)] mt-0.5">
              Click any template to get started instantly
            </p>
          </div>
        </div>
        
        {/* Toggle to Guided Mode */}
        <button
          onClick={onToggleGuided}
          className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-600/10 to-blue-600/10 hover:from-purple-600/20 hover:to-blue-600/20 border border-purple-500/20 hover:border-purple-500/40 rounded-xl text-purple-300 hover:text-purple-200 font-medium text-sm transition-all duration-200"
        >
          <Layers className="w-4 h-4" />
          <span>Guided Builder</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      {/* Professional Category Filter */}
      <div className="flex items-center space-x-2 mb-6 overflow-x-auto scrollbar-hide">
        {promptCategories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`category-filter-button flex-shrink-0 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
              selectedCategory === category
                ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40 shadow-lg shadow-blue-500/10'
                : 'bg-[var(--surface-secondary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-primary)] hover:border-[var(--border-accent)] hover:bg-[var(--surface-tertiary)]'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Professional Carousel Container */}
      <div className="relative group">
        {/* Navigation Arrows */}
        {canScrollLeft && (
          <button
            onClick={() => scroll('left')}
            className="carousel-nav-button absolute left-0 top-1/2 -translate-y-1/2 z-20 p-3 bg-[var(--surface-primary)]/95 hover:bg-[var(--surface-primary)] border border-[var(--border-primary)] rounded-full shadow-xl backdrop-blur-sm transition-all duration-200 opacity-0 group-hover:opacity-100 hover:scale-110"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-5 h-5 text-[var(--text-primary)]" />
          </button>
        )}

        {canScrollRight && (
          <button
            onClick={() => scroll('right')}
            className="carousel-nav-button absolute right-0 top-1/2 -translate-y-1/2 z-20 p-3 bg-[var(--surface-primary)]/95 hover:bg-[var(--surface-primary)] border border-[var(--border-primary)] rounded-full shadow-xl backdrop-blur-sm transition-all duration-200 opacity-0 group-hover:opacity-100 hover:scale-110"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-5 h-5 text-[var(--text-primary)]" />
          </button>
        )}

        {/* Professional Template Cards */}
        <div
          ref={scrollRef}
          className="prompt-carousel-container flex space-x-4 overflow-x-auto scrollbar-hide pb-2"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {filteredExamples.map((example, index) => {
            const IconComponent = getIconComponent(example.icon);
            
            return (
              <div
                key={example.id}
                className="prompt-carousel-card relative flex-shrink-0 w-80 group/card"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <button
                  onClick={() => handlePromptSelect(example)}
                  className="prompt-card-mobile prompt-card-hover w-full p-6 bg-gradient-to-br from-[var(--surface-secondary)] to-[var(--surface-tertiary)]/50 hover:from-[var(--surface-tertiary)] hover:to-[var(--surface-secondary)] border border-[var(--border-primary)] hover:border-[var(--border-accent)] rounded-2xl transition-all duration-300 text-left group-hover/card:shadow-2xl group-hover/card:shadow-blue-500/5 group-hover/card:scale-[1.02] group-hover/card:-translate-y-1"
                >
                  {/* Card Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-500/20 to-purple-600/20 border border-blue-500/30 rounded-lg group-hover/card:shadow-lg group-hover/card:shadow-blue-500/20 transition-all duration-300">
                        <IconComponent className="w-5 h-5 text-blue-400" />
                      </div>
                      <div>
                        <h4 className="prompt-title-mobile text-sm font-semibold text-[var(--text-primary)] tracking-tight">
                          {example.title}
                        </h4>
                        <span className="text-xs text-[var(--text-tertiary)] font-medium">
                          {example.category}
                        </span>
                      </div>
                    </div>
                    
                    {/* Platform Badge */}
                    {example.platform && (
                      <div className="px-2 py-1 bg-[var(--surface-primary)]/60 border border-[var(--border-secondary)] rounded-md">
                        <span className="text-xs text-[var(--text-tertiary)] font-medium capitalize">
                          {example.platform}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  {/* Prompt Preview */}
                  <p className="prompt-text-mobile text-sm text-[var(--text-secondary)] leading-relaxed mb-4">
                    "{example.prompt}"
                  </p>
                  
                  {/* Action Hint */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[var(--text-tertiary)]">
                      Click to use template
                    </span>
                    <div className="flex items-center space-x-1 text-blue-400 opacity-0 group-hover/card:opacity-100 transition-all duration-200">
                      <span className="text-xs font-medium">Use</span>
                      <ArrowRight className="w-3 h-3" />
                    </div>
                  </div>
                </button>

                {/* Success Feedback */}
                {showTooltip === example.id && (
                  <div className="absolute top-3 right-3 bg-emerald-500 text-white text-xs px-3 py-1.5 rounded-lg animate-fade-in shadow-lg">
                    ✓ Template Added!
                  </div>
                )}
              </div>
            );
          })}

          {/* Empty State */}
          {filteredExamples.length === 0 && (
            <div className="flex-shrink-0 w-full p-12 text-center">
              <div className="flex items-center justify-center w-16 h-16 bg-[var(--surface-secondary)] border border-[var(--border-primary)] rounded-2xl mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-[var(--text-tertiary)]" />
              </div>
              <h4 className="text-lg font-medium text-[var(--text-primary)] mb-2">
                No templates found
              </h4>
              <p className="text-sm text-[var(--text-tertiary)]">
                Try selecting a different category or use the guided builder.
              </p>
            </div>
          )}
        </div>

        {/* Professional Fade Edges */}
        <div className="prompt-carousel-fade-edge absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-[var(--surface-primary)] to-transparent pointer-events-none z-10" />
        <div className="prompt-carousel-fade-edge absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[var(--surface-primary)] to-transparent pointer-events-none z-10" />
      </div>

      {/* Professional Footer Stats */}
      <div className="flex items-center justify-between mt-6 p-4 bg-[var(--surface-secondary)]/50 border border-[var(--border-primary)] rounded-xl">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
            <span className="text-sm font-medium text-[var(--text-secondary)]">
              {filteredExamples.length} templates
            </span>
          </div>
          <div className="w-px h-4 bg-[var(--border-primary)]"></div>
          <span className="text-sm text-[var(--text-tertiary)]">
            Professional-grade prompts
          </span>
        </div>
        
        <div className="flex items-center space-x-2 text-[var(--text-tertiary)]">
          <Layers className="w-4 h-4" />
          <span className="text-sm">
            Need more control? Try guided builder →
          </span>
        </div>
      </div>
    </div>
  );
};

export default PromptExamplesCarousel;
