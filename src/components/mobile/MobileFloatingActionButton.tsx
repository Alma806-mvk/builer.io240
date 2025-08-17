import React, { useState } from 'react';
import { PlusIcon, SparklesIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';

interface QuickAction {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  action: () => void;
  color: string;
}

interface MobileFloatingActionButtonProps {
  onQuickGenerate?: () => void;
  onCreateContent?: () => void;
  onOpenCanvas?: () => void;
  onGenerateImage?: () => void;
}

const MobileFloatingActionButton: React.FC<MobileFloatingActionButtonProps> = ({
  onQuickGenerate,
  onCreateContent,
  onOpenCanvas,
  onGenerateImage,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const quickActions: QuickAction[] = [
    {
      id: 'quick-generate',
      label: 'Quick Generate',
      icon: SparklesIcon,
      action: () => {
        onQuickGenerate?.();
        setIsExpanded(false);
      },
      color: 'from-sky-500 to-blue-600',
    },
    {
      id: 'create-content',
      label: 'New Content',
      icon: PlusIcon,
      action: () => {
        onCreateContent?.();
        setIsExpanded(false);
      },
      color: 'from-purple-500 to-pink-600',
    },
  ];

  const handleMainAction = () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
    
    if (isExpanded) {
      setIsExpanded(false);
    } else {
      // Default action - quick generate
      if (onQuickGenerate) {
        onQuickGenerate();
      } else {
        setIsExpanded(true);
      }
    }
  };

  const handleQuickAction = (action: () => void) => {
    if ('vibrate' in navigator) {
      navigator.vibrate(75);
    }
    action();
  };

  return (
    <>
      {/* Backdrop */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-998"
            onClick={() => setIsExpanded(false)}
          />
        )}
      </AnimatePresence>

      {/* Quick Actions */}
      <AnimatePresence>
        {isExpanded && (
          <div className="fixed bottom-32 right-4 z-999 space-y-3">
            {quickActions.map((action, index) => (
              <motion.button
                key={action.id}
                initial={{ scale: 0, opacity: 0, x: 20 }}
                animate={{ 
                  scale: 1, 
                  opacity: 1, 
                  x: 0,
                  transition: { delay: index * 0.1 }
                }}
                exit={{ 
                  scale: 0, 
                  opacity: 0, 
                  x: 20,
                  transition: { delay: (quickActions.length - index - 1) * 0.05 }
                }}
                onClick={() => handleQuickAction(action.action)}
                className={`flex items-center space-x-3 bg-gradient-to-r ${action.color} text-white px-4 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 min-w-0`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <action.icon className="h-5 w-5 flex-shrink-0" />
                <span className="font-medium text-sm whitespace-nowrap">{action.label}</span>
              </motion.button>
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* Main FAB */}
      <motion.button
        onClick={handleMainAction}
        className="mobile-fab"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        animate={{
          rotate: isExpanded ? 45 : 0,
        }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        aria-label={isExpanded ? "Close quick actions" : "Quick generate content"}
      >
        <AnimatePresence mode="wait">
          {isExpanded ? (
            <motion.div
              key="close"
              initial={{ scale: 0, rotate: -90 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 90 }}
              transition={{ duration: 0.2 }}
            >
              <XMarkIcon className="h-6 w-6 text-white" />
            </motion.div>
          ) : (
            <motion.div
              key="spark"
              initial={{ scale: 0, rotate: 90 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: -90 }}
              transition={{ duration: 0.2 }}
            >
              <SparklesIcon className="h-6 w-6 text-white" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </>
  );
};

export default MobileFloatingActionButton;
