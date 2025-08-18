import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Sparkles, Copy } from 'lucide-react';
import { promptExamples, promptCategories, getExamplesByCategory, type PromptExample } from '../data/promptExamples';
import '../styles/promptCarousel.css';

interface PromptExamplesCarouselProps {
  onSelectPrompt: (prompt: string) => void;
  className?: string;
}

export const PromptExamplesCarousel: React.FC<PromptExamplesCarouselProps> = ({
  onSelectPrompt,
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
      const scrollAmount = 320; // Width of approximately one card
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
    // Add a subtle visual feedback
    setShowTooltip(example.id);
    setTimeout(() => setShowTooltip(null), 1000);
  };

  return (
    <div className={`relative ${className}`}>
      {/* Header with Category Filter */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-violet-400" />
          <h3 className="text-sm font-medium text-[var(--text-primary)]">
            Prompt Examples
          </h3>
        </div>
        
        {/* Category Filter Pills */}
        <div className="category-filter-mobile flex space-x-1 overflow-x-auto scrollbar-hide">
          {promptCategories.slice(0, 6).map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`category-filter-button category-pill-small px-3 py-1 text-xs font-medium rounded-full transition-all whitespace-nowrap ${
                selectedCategory === category
                  ? 'bg-violet-500/20 text-violet-300 border border-violet-500/30'
                  : 'bg-[var(--surface-tertiary)] text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] border border-transparent hover:border-[var(--border-secondary)]'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Carousel Container */}
      <div className="relative group">
        {/* Left Arrow */}
        {canScrollLeft && (
          <button
            onClick={() => scroll('left')}
            className="carousel-nav-button absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-[var(--surface-primary)]/80 hover:bg-[var(--surface-primary)] border border-[var(--border-primary)] rounded-full shadow-lg backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-4 h-4 text-[var(--text-primary)]" />
          </button>
        )}

        {/* Right Arrow */}
        {canScrollRight && (
          <button
            onClick={() => scroll('right')}
            className="carousel-nav-button absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-[var(--surface-primary)]/80 hover:bg-[var(--surface-primary)] border border-[var(--border-primary)] rounded-full shadow-lg backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-4 h-4 text-[var(--text-primary)]" />
          </button>
        )}

        {/* Scrollable Examples */}
        <div
          ref={scrollRef}
          className="prompt-carousel-container flex space-x-3 overflow-x-auto scrollbar-hide pb-2"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {filteredExamples.map((example) => (
            <div
              key={example.id}
              className="prompt-carousel-card relative flex-shrink-0 w-80 group/card"
            >
              <button
                onClick={() => handlePromptSelect(example)}
                className="prompt-card-mobile prompt-card-hover w-full p-4 bg-[var(--surface-secondary)] hover:bg-[var(--surface-tertiary)] border border-[var(--border-primary)] hover:border-[var(--border-accent)] rounded-lg transition-all duration-200 text-left group-hover/card:shadow-lg group-hover/card:scale-[1.02]"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{example.icon}</span>
                    <h4 className="prompt-title-mobile text-sm font-medium text-[var(--text-primary)] truncate">
                      {example.title}
                    </h4>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span className="text-xs px-2 py-1 bg-[var(--surface-tertiary)] text-[var(--text-tertiary)] rounded-full">
                      {example.category}
                    </span>
                  </div>
                </div>
                
                <p className="prompt-text-mobile text-xs text-[var(--text-secondary)] line-clamp-3 leading-relaxed">
                  {example.prompt}
                </p>
                
                {/* Hover overlay with action hint */}
                <div className="absolute inset-0 bg-gradient-to-t from-violet-500/10 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity rounded-lg pointer-events-none">
                  <div className="absolute bottom-3 right-3 flex items-center space-x-1 text-xs text-violet-300">
                    <Copy className="w-3 h-3" />
                    <span>Click to use</span>
                  </div>
                </div>
              </button>

              {/* Success tooltip */}
              {showTooltip === example.id && (
                <div className="absolute top-2 right-2 bg-emerald-500 text-white text-xs px-2 py-1 rounded-full animate-fade-in animate-pulse-glow">
                  ✓ Added!
                </div>
              )}
            </div>
          ))}

          {/* Empty state */}
          {filteredExamples.length === 0 && (
            <div className="flex-shrink-0 w-full p-8 text-center text-[var(--text-tertiary)]">
              <Sparkles className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No examples found for this category.</p>
            </div>
          )}
        </div>

        {/* Fade edges for visual indication of scrollability */}
        <div className="prompt-carousel-fade-edge absolute left-0 top-0 bottom-0 w-4 bg-gradient-to-r from-[var(--surface-primary)] to-transparent pointer-events-none z-[5]" />
        <div className="prompt-carousel-fade-edge absolute right-0 top-0 bottom-0 w-4 bg-gradient-to-l from-[var(--surface-primary)] to-transparent pointer-events-none z-[5]" />
      </div>

      {/* Quick Stats */}
      <div className="flex items-center justify-between mt-3 text-xs text-[var(--text-tertiary)]">
        <span>{filteredExamples.length} examples available</span>
        <span className="flex items-center space-x-1">
          <span>💡</span>
          <span>Click any example to load it into your prompt</span>
        </span>
      </div>
    </div>
  );
};

export default PromptExamplesCarousel;
