import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  SparklesIcon,
  ChatBubbleLeftRightIcon,
  LightBulbIcon,
  ChartBarIcon,
  RocketLaunchIcon,
  BeakerIcon,
  CogIcon,
  UserIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  StarIcon,
  BoltIcon,
  BrainIcon,
  HeartIcon,
  EyeIcon,
  ChartPieIcon,
  FilmIcon,
  PhotoIcon,
  MapIcon,
  CalendarIcon,
  TrendingUpIcon,
  MagnifyingGlassIcon,
  BookOpenIcon,
  AcademicCapIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';

const IntelligentAIAssistantDemo: React.FC = () => {
  const [activeFeature, setActiveFeature] = useState(0);
  const [showComparison, setShowComparison] = useState(false);

  const features = [
    {
      title: "Human-like Understanding",
      icon: BrainIcon,
      description: "Understands context, intent, and provides personalized responses like a real support person",
      example: "Instead of generic answers, I understand 'My thumbnails aren't getting clicks' means you need CTR optimization strategies.",
      color: "from-purple-500 to-blue-500"
    },
    {
      title: "Complete App Knowledge",
      icon: AcademicCapIcon,
      description: "Knows every feature, button, workflow, and best practice across all 11 tools",
      example: "I can walk you through the exact steps to create viral content using Generator → Thumbnails → Strategy → Calendar.",
      color: "from-blue-500 to-cyan-500"
    },
    {
      title: "Contextual Guidance",
      icon: MapIcon,
      description: "Provides specific, step-by-step instructions based on what you're trying to achieve",
      example: "Creating a YouTube video? I'll guide you through research → script → thumbnail → optimization → publishing.",
      color: "from-green-500 to-emerald-500"
    },
    {
      title: "Problem Solving",
      icon: CogIcon,
      description: "Diagnoses issues and provides exact solutions, not just suggestions",
      example: "Canvas not loading? I know it needs WebGL - here's how to enable it in your specific browser.",
      color: "from-orange-500 to-amber-500"
    },
    {
      title: "Strategic Insights",
      icon: ChartBarIcon,
      description: "Analyzes your performance and provides actionable optimization strategies",
      example: "Your Tuesday videos get 45% more engagement - let's optimize your posting schedule around this data.",
      color: "from-red-500 to-pink-500"
    },
    {
      title: "Workflow Automation",
      icon: BoltIcon,
      description: "Creates custom workflows and connects tools for maximum efficiency",
      example: "I'll set up an automated workflow: Trends → Generator → Thumbnails → Calendar for consistent content creation.",
      color: "from-indigo-500 to-purple-500"
    }
  ];

  const beforeAfter = {
    before: {
      title: "Generic AI Assistant",
      features: [
        "❌ Generic responses",
        "❌ Limited tool knowledge", 
        "❌ No context understanding",
        "❌ Basic troubleshooting",
        "❌ One-size-fits-all advice"
      ],
      example: {
        question: "How do I get more views?",
        answer: "Try creating better content and optimizing your SEO. Use relevant keywords and engaging thumbnails."
      }
    },
    after: {
      title: "Intelligent AI Support Specialist",
      features: [
        "✅ Human-like understanding",
        "✅ Complete platform expertise",
        "✅ Context-aware responses", 
        "✅ Specific problem solving",
        "✅ Personalized strategies"
      ],
      example: {
        question: "How do I get more views?",
        answer: "Let's analyze your specific situation! First, check YT Stats to see your current CTR and retention rates. If CTR is below 8%, we need better thumbnails - I'll show you the exact formula that gets 12%+ CTR. If retention is low, let's analyze your video hooks in Generator. What's your current niche and average views per video?"
      }
    }
  };

  const useCases = [
    {
      icon: FilmIcon,
      title: "Video Creation",
      description: "Complete guidance from idea to published video",
      workflow: ["Research trends", "Generate script", "Create thumbnail", "Optimize strategy", "Schedule release"]
    },
    {
      icon: ChartPieIcon,
      title: "Performance Analysis", 
      description: "Deep dive into your metrics with actionable insights",
      workflow: ["Analyze YT Stats", "Compare competitors", "Identify opportunities", "Create optimization plan", "Track improvements"]
    },
    {
      icon: PhotoIcon,
      title: "Thumbnail Optimization",
      description: "Design thumbnails that actually get clicks",
      workflow: ["Analyze current CTR", "Research successful designs", "Create variations", "A/B test results", "Scale winners"]
    },
    {
      icon: RocketLaunchIcon,
      title: "Channel Growth",
      description: "Strategic planning for sustainable channel growth",
      workflow: ["Set clear goals", "Analyze competition", "Plan content strategy", "Optimize workflows", "Monitor progress"]
    }
  ];

  return (
    <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-600/50 rounded-2xl p-8 shadow-2xl">
      {/* Header */}
      <div className="text-center mb-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex justify-center mb-4"
        >
          <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center shadow-2xl">
            <SparklesIcon className="w-10 h-10 text-white" />
          </div>
        </motion.div>
        
        <h2 className="text-3xl font-bold text-white mb-3">
          🚀 Meet Your New AI Support Specialist
        </h2>
        <p className="text-slate-300 text-lg leading-relaxed max-w-3xl mx-auto">
          We've completely rebuilt the AI assistant to be <strong>10x more intelligent and helpful</strong>. 
          It now understands context, knows every feature, and responds like a real human expert.
        </p>
      </div>

      {/* Key Features Showcase */}
      <div className="mb-8">
        <h3 className="text-xl font-bold text-white mb-6 text-center">
          ✨ What Makes It 10x Better
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`bg-gradient-to-br ${feature.color} opacity-90 hover:opacity-100 rounded-xl p-6 cursor-pointer transition-all duration-300 hover:scale-105`}
                onClick={() => setActiveFeature(index)}
              >
                <div className="flex items-center gap-3 mb-3">
                  <IconComponent className="w-6 h-6 text-white" />
                  <h4 className="font-semibold text-white">{feature.title}</h4>
                </div>
                <p className="text-white/90 text-sm leading-relaxed mb-3">
                  {feature.description}
                </p>
                <div className="bg-white/20 rounded-lg p-3">
                  <p className="text-white/80 text-xs italic">
                    "{feature.example}"
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Before vs After Comparison */}
      <div className="mb-8">
        <div className="flex items-center justify-center gap-4 mb-6">
          <h3 className="text-xl font-bold text-white">Before vs After</h3>
          <button
            onClick={() => setShowComparison(!showComparison)}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition-colors"
          >
            {showComparison ? 'Hide' : 'Show'} Comparison
          </button>
        </div>

        <AnimatePresence>
          {showComparison && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="grid md:grid-cols-2 gap-6"
            >
              {/* Before */}
              <div className="bg-slate-700/50 rounded-xl p-6 border border-red-500/30">
                <h4 className="text-lg font-bold text-red-400 mb-4 flex items-center gap-2">
                  <ExclamationTriangleIcon className="w-5 h-5" />
                  {beforeAfter.before.title}
                </h4>
                <ul className="space-y-2 mb-6">
                  {beforeAfter.before.features.map((feature, index) => (
                    <li key={index} className="text-slate-300 text-sm">{feature}</li>
                  ))}
                </ul>
                <div className="bg-slate-800/50 rounded-lg p-4">
                  <p className="text-white font-medium text-sm mb-2">Q: {beforeAfter.before.example.question}</p>
                  <p className="text-slate-400 text-sm italic">A: {beforeAfter.before.example.answer}</p>
                </div>
              </div>

              {/* After */}
              <div className="bg-slate-700/50 rounded-xl p-6 border border-green-500/30">
                <h4 className="text-lg font-bold text-green-400 mb-4 flex items-center gap-2">
                  <CheckCircleIcon className="w-5 h-5" />
                  {beforeAfter.after.title}
                </h4>
                <ul className="space-y-2 mb-6">
                  {beforeAfter.after.features.map((feature, index) => (
                    <li key={index} className="text-slate-300 text-sm">{feature}</li>
                  ))}
                </ul>
                <div className="bg-slate-800/50 rounded-lg p-4">
                  <p className="text-white font-medium text-sm mb-2">Q: {beforeAfter.after.example.question}</p>
                  <p className="text-green-300 text-sm italic">A: {beforeAfter.after.example.answer}</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Use Cases */}
      <div className="mb-8">
        <h3 className="text-xl font-bold text-white mb-6 text-center">
          🎯 Perfect For These Workflows
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {useCases.map((useCase, index) => {
            const IconComponent = useCase.icon;
            return (
              <div key={index} className="bg-slate-700/30 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                    <IconComponent className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">{useCase.title}</h4>
                    <p className="text-slate-400 text-sm">{useCase.description}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  {useCase.workflow.map((step, stepIndex) => (
                    <div key={stepIndex} className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-purple-600/20 border border-purple-500/30 rounded-full flex items-center justify-center">
                        <span className="text-purple-300 text-xs font-bold">{stepIndex + 1}</span>
                      </div>
                      <span className="text-slate-300 text-sm">{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Key Improvements */}
      <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-purple-500/30 rounded-xl p-6 mb-8">
        <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
          <StarIcon className="w-5 h-5 text-yellow-400" />
          Key Improvements You'll Notice
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-300">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <CheckCircleIcon className="w-4 h-4 text-green-400" />
              <span>Understands what you actually want to achieve</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircleIcon className="w-4 h-4 text-green-400" />
              <span>Provides exact steps with button names and locations</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircleIcon className="w-4 h-4 text-green-400" />
              <span>Asks follow-up questions to help better</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircleIcon className="w-4 h-4 text-green-400" />
              <span>Connects tools together for complete workflows</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <CheckCircleIcon className="w-4 h-4 text-green-400" />
              <span>Troubleshoots issues with specific solutions</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircleIcon className="w-4 h-4 text-green-400" />
              <span>Analyzes your performance and suggests improvements</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircleIcon className="w-4 h-4 text-green-400" />
              <span>Remembers conversation context</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircleIcon className="w-4 h-4 text-green-400" />
              <span>Shows genuine enthusiasm to help you succeed</span>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="text-center">
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-6">
          <h4 className="text-white font-bold text-lg mb-3">
            🎉 Ready to Experience the New AI Assistant?
          </h4>
          <p className="text-purple-100 mb-4">
            Look for the floating purple button in the bottom-right corner of your screen.
            Ask it anything about CreateGen Studio - you'll be amazed by how helpful it is!
          </p>
          <div className="flex items-center justify-center gap-4 text-sm text-purple-200">
            <div className="flex items-center gap-2">
              <HeartIcon className="w-4 h-4" />
              <span>Human-like responses</span>
            </div>
            <div className="flex items-center gap-2">
              <BrainIcon className="w-4 h-4" />
              <span>Complete app knowledge</span>
            </div>
            <div className="flex items-center gap-2">
              <RocketLaunchIcon className="w-4 h-4" />
              <span>Actionable guidance</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntelligentAIAssistantDemo;
