import React from 'react';
import { SparklesIcon, TrendingUpIcon, PenToolIcon } from './IconComponents';

interface FeatureCard {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  gradient: string;
}

const ResponsiveFeatureCards: React.FC = () => {
  const features: FeatureCard[] = [
    {
      icon: SparklesIcon,
      title: "AI Content Generation",
      description: "Create viral posts, captions, and strategies with advanced AI",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: TrendingUpIcon,
      title: "Performance Analytics",
      description: "Track trends and optimize your content for maximum engagement",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: PenToolIcon,
      title: "Visual Design Studio",
      description: "Design stunning graphics and thumbnails with our built-in editor",
      gradient: "from-orange-500 to-red-500"
    }
  ];

  return (
    <div className="feature-cards-wrapper">
      {/* Desktop Layout (Preserved) */}
      <div className="hidden md:grid md:grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto px-6">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <div
              key={index}
              className="group relative bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 hover:border-blue-500/50 transition-all duration-300 hover:transform hover:scale-105"
            >
              {/* Gradient Background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-300`}></div>
              
              {/* Icon */}
              <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-xl mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <Icon className="h-8 w-8 text-white" />
              </div>
              
              {/* Content */}
              <h3 className="text-xl font-bold text-white mb-4 group-hover:text-blue-400 transition-colors">
                {feature.title}
              </h3>
              <p className="text-slate-300 leading-relaxed group-hover:text-slate-200 transition-colors">
                {feature.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden space-y-6 px-4">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          const actionButtons = [
            { text: "500+ TEMPLATES", className: "bg-blue-500 hover:bg-blue-600" },
            { text: "REAL-TIME DATA", className: "bg-purple-500 hover:bg-purple-600" },
            { text: "PRO TOOLS", className: "bg-orange-500 hover:bg-orange-600" }
          ];

          return (
            <div key={index} className="bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
              {/* Icon */}
              <div className={`inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br ${feature.gradient} rounded-xl mb-4`}>
                <Icon className="h-6 w-6 text-white" />
              </div>

              {/* Title */}
              <h3 className="text-xl font-bold text-white mb-3">
                {feature.title}
              </h3>

              {/* Description */}
              <p className="text-slate-300 text-sm leading-relaxed mb-6">
                {feature.description}
              </p>

              {/* Action Button */}
              <button className={`${actionButtons[index].className} text-white font-semibold text-xs px-4 py-2 rounded-full transition-colors duration-200`}>
                {actionButtons[index].text}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ResponsiveFeatureCards;
