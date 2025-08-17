import React from "react";

interface PremiumStatusIndicatorProps {
  selectedTemplate?: any;
  selectedPersona?: any;
  seoConfig?: any;
  aiBoostEnabled?: boolean;
  isPremium?: boolean;
}

export const PremiumStatusIndicator: React.FC<PremiumStatusIndicatorProps> = ({
  selectedTemplate,
  selectedPersona,
  seoConfig,
  aiBoostEnabled,
  isPremium,
}) => {
  if (!isPremium) return null;

  const activeFeatures = [];

  if (selectedTemplate) {
    activeFeatures.push({
      name: "Template",
      value: selectedTemplate.name,
      icon: "📝",
    });
  }

  if (selectedPersona) {
    activeFeatures.push({
      name: "AI Persona",
      value: selectedPersona.name,
      icon: "🎭",
    });
  }

  if (seoConfig) {
    activeFeatures.push({
      name: "SEO Optimized",
      value: `${seoConfig.primaryKeywords?.length || 0} keywords`,
      icon: "📈",
    });
  }

  if (aiBoostEnabled) {
    activeFeatures.push({
      name: "AI Boost",
      value: "Active",
      icon: "🧠",
    });
  }

  if (activeFeatures.length === 0) return null;

  return (
    <div className="mb-4 p-4 bg-gradient-to-r from-sky-500/10 to-purple-500/10 border border-sky-400/20 rounded-2xl">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-6 h-6 bg-gradient-to-r from-sky-500 to-purple-500 rounded-full flex items-center justify-center">
          <span className="text-white text-xs font-bold">✨</span>
        </div>
        <h4 className="text-white font-semibold">Premium Features Active</h4>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {activeFeatures.map((feature, index) => (
          <div
            key={index}
            className="flex items-center gap-2 p-2 bg-slate-700/30 rounded-lg"
          >
            <span className="text-lg">{feature.icon}</span>
            <div>
              <div className="text-sky-300 text-sm font-medium">
                {feature.name}
              </div>
              <div className="text-slate-400 text-xs">{feature.value}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-3 text-center">
        <span className="text-emerald-400 text-xs font-medium">
          🚀 Enhanced AI generation active
        </span>
      </div>
    </div>
  );
};
