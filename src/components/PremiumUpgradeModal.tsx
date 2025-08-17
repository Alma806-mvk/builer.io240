import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, Badge } from './ui/WorldClassComponents';
import { SparklesIcon } from './IconComponents';

interface PremiumUpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgrade?: () => void;
  featureName: string;
  featureDescription?: string;
}

export const PremiumUpgradeModal: React.FC<PremiumUpgradeModalProps> = ({
  isOpen,
  onClose,
  onUpgrade,
  featureName,
  featureDescription
}) => {
  const premiumFeatures = [
    "🚀 SEO Optimization Engine",
    "🧠 AI Boost Technology", 
    "🎯 Advanced Analytics",
    "📊 Performance Insights",
    "🔄 Unlimited Batch Generation",
    "🎨 Custom AI Personas",
    "📈 A/B Testing Tools",
    "🌍 Multi-language Support",
    "⚡ Priority Processing",
    "📱 Mobile App Access"
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-[var(--surface-secondary)] border border-[var(--border-primary)] rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="relative p-6 pb-4">
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 w-8 h-8 bg-[var(--surface-tertiary)] hover:bg-[var(--surface-quaternary)] rounded-lg flex items-center justify-center text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors"
                >
                  ✕
                </button>

                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <SparklesIcon className="w-8 h-8 text-white" />
                  </div>
                  
                  <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2">
                    Unlock Premium Features
                  </h2>
                  
                  <Badge variant="warning" size="sm" className="mb-4">
                    {featureName} requires Pro
                  </Badge>
                </div>
              </div>

              {/* Content */}
              <div className="px-6 pb-6">
                <div className="text-center mb-6">
                  <p className="text-[var(--text-secondary)] mb-4">
                    {featureDescription || `${featureName} is a premium feature that helps you create more engaging content with advanced AI capabilities.`}
                  </p>
                  
                  <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-400/20 rounded-xl p-4 mb-6">
                    <h3 className="font-semibold text-[var(--text-primary)] mb-3 flex items-center justify-center">
                      <SparklesIcon className="w-5 h-5 mr-2" />
                      What you'll get with Pro:
                    </h3>
                    
                    <div className="grid grid-cols-1 gap-2 text-sm text-[var(--text-secondary)]">
                      {premiumFeatures.slice(0, 6).map((feature, index) => (
                        <div key={`premium-feature-${feature.replace(/[^a-zA-Z0-9]/g, '-')}-${index}`} className="flex items-center text-left">
                          <span className="mr-2 text-emerald-400">✓</span>
                          {feature}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="space-y-3">
                  <Button
                    variant="primary"
                    onClick={onUpgrade}
                    fullWidth
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 shadow-lg"
                    icon={<SparklesIcon className="w-4 h-4" />}
                  >
                    Upgrade to Pro
                  </Button>
                  
                  <Button
                    variant="ghost"
                    onClick={onClose}
                    fullWidth
                    size="sm"
                  >
                    Maybe Later
                  </Button>
                </div>

                {/* Pricing hint */}
                <div className="text-center mt-4">
                  <p className="text-xs text-[var(--text-tertiary)]">
                    Starting at $9.99/month • Cancel anytime • 7-day free trial
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
