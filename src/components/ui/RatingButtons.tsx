import React, { useState } from 'react';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { motion } from 'framer-motion';

interface RatingButtonsProps {
  rating?: 1 | -1 | 0;
  onRating: (rating: 1 | -1 | 0) => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showTooltip?: boolean;
}

export const RatingButtons: React.FC<RatingButtonsProps> = ({
  rating = 0,
  onRating,
  disabled = false,
  size = 'md',
  showTooltip = true,
}) => {
  const [isHovered, setIsHovered] = useState<'up' | 'down' | null>(null);

  const sizeClasses = {
    sm: 'w-7 h-7 p-1.5',
    md: 'w-8 h-8 p-2',
    lg: 'w-10 h-10 p-2.5',
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  const handleThumbsUp = () => {
    if (disabled) return;
    onRating(rating === 1 ? 0 : 1);
  };

  const handleThumbsDown = () => {
    if (disabled) return;
    onRating(rating === -1 ? 0 : -1);
  };

  return (
    <div className="flex items-center gap-1">
      {/* Thumbs Up Button */}
      <motion.button
        onClick={handleThumbsUp}
        onMouseEnter={() => setIsHovered('up')}
        onMouseLeave={() => setIsHovered(null)}
        disabled={disabled}
        className={`
          ${sizeClasses[size]}
          relative
          rounded-lg
          transition-all duration-200
          disabled:opacity-40 disabled:cursor-not-allowed
          ${rating === 1 
            ? 'bg-green-500/20 text-green-400 border border-green-500/30 shadow-sm shadow-green-500/20' 
            : 'bg-slate-700/50 text-slate-400 border border-slate-600/50 hover:bg-green-500/10 hover:text-green-400 hover:border-green-500/30'
          }
          ${isHovered === 'up' && rating !== 1 ? 'scale-105' : ''}
        `}
        whileTap={{ scale: 0.95 }}
        whileHover={{ scale: rating === 1 ? 1 : 1.05 }}
      >
        <ThumbsUp className={`${iconSizes[size]} transition-transform duration-200`} />
        
        {/* Tooltip */}
        {showTooltip && isHovered === 'up' && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: -8 }}
            exit={{ opacity: 0, y: -5 }}
            className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 bg-slate-900 text-white text-xs rounded-md whitespace-nowrap shadow-lg z-50"
          >
            {rating === 1 ? 'Remove rating' : 'Good content'}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-l-2 border-r-2 border-t-2 border-slate-900 border-l-transparent border-r-transparent" />
          </motion.div>
        )}
      </motion.button>

      {/* Thumbs Down Button */}
      <motion.button
        onClick={handleThumbsDown}
        onMouseEnter={() => setIsHovered('down')}
        onMouseLeave={() => setIsHovered(null)}
        disabled={disabled}
        className={`
          ${sizeClasses[size]}
          relative
          rounded-lg
          transition-all duration-200
          disabled:opacity-40 disabled:cursor-not-allowed
          ${rating === -1 
            ? 'bg-red-500/20 text-red-400 border border-red-500/30 shadow-sm shadow-red-500/20' 
            : 'bg-slate-700/50 text-slate-400 border border-slate-600/50 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30'
          }
          ${isHovered === 'down' && rating !== -1 ? 'scale-105' : ''}
        `}
        whileTap={{ scale: 0.95 }}
        whileHover={{ scale: rating === -1 ? 1 : 1.05 }}
      >
        <ThumbsDown className={`${iconSizes[size]} transition-transform duration-200`} />
        
        {/* Tooltip */}
        {showTooltip && isHovered === 'down' && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: -8 }}
            exit={{ opacity: 0, y: -5 }}
            className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 bg-slate-900 text-white text-xs rounded-md whitespace-nowrap shadow-lg z-50"
          >
            {rating === -1 ? 'Remove rating' : 'Needs improvement'}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-l-2 border-r-2 border-t-2 border-slate-900 border-l-transparent border-r-transparent" />
          </motion.div>
        )}
      </motion.button>
    </div>
  );
};

export default RatingButtons;
