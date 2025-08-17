import React, { useState } from 'react';
import { WandIcon, SparklesIcon } from './IconComponents';

interface MagicSelectToggleProps {
  isActive: boolean;
  onToggle: (active: boolean) => void;
  className?: string;
}

export const MagicSelectToggle: React.FC<MagicSelectToggleProps> = ({
  isActive,
  onToggle,
  className = '',
}) => {
  return (
    <button
      onClick={() => onToggle(!isActive)}
      className={`
        flex items-center gap-2 px-3 py-2 rounded-lg font-medium text-sm
        transition-all duration-300 group relative overflow-hidden
        ${isActive 
          ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/25' 
          : 'bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 hover:text-white border border-slate-600/50'
        }
        ${className}
      `}
      title={isActive ? "Magic Select: ON - Enhanced text selection" : "Magic Select: OFF - Normal selection"}
    >
      {/* Icon with animation */}
      <div className={`transition-all duration-300 ${isActive ? 'scale-110' : 'scale-100'}`}>
        {isActive ? (
          <SparklesIcon className="w-4 h-4" />
        ) : (
          <WandIcon className="w-4 h-4" />
        )}
      </div>
      
      {/* Text */}
      <span className="relative z-10">
        Magic Select
      </span>
      
      {/* Status indicator */}
      <div className={`
        px-1.5 py-0.5 rounded-md text-xs font-bold transition-all duration-300
        ${isActive 
          ? 'bg-white/20 text-white' 
          : 'bg-slate-600/50 text-slate-400'
        }
      `}>
        {isActive ? 'ON' : 'OFF'}
      </div>
      
      {/* Glow effect when active */}
      {isActive && (
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/50 to-pink-600/50 blur-xl -z-10 animate-pulse" />
      )}
      
      {/* Hover shimmer effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 animate-shimmer" />
      </div>
    </button>
  );
};

export default MagicSelectToggle;
