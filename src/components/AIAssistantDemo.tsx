import React from 'react';
import { motion } from 'framer-motion';
import {
  SparklesIcon,
  ChatBubbleLeftRightIcon,
  LightBulbIcon,
  ChartBarIcon,
  RocketLaunchIcon,
  BeakerIcon,
} from '@heroicons/react/24/outline';

const AIAssistantDemo: React.FC = () => {
  return (
    <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-600/50 rounded-2xl p-6 shadow-2xl">
      <div className="text-center mb-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex justify-center mb-4"
        >
          <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
            <SparklesIcon className="w-8 h-8 text-white" />
          </div>
        </motion.div>
        
        <h2 className="text-2xl font-bold text-white mb-2">🚀 AI Studio Assistant</h2>
        <p className="text-slate-300">Your personal content strategist is now live!</p>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-700/30 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-2">
              <ChatBubbleLeftRightIcon className="w-5 h-5 text-blue-400" />
              <h3 className="font-semibold text-white">Conversational AI</h3>
            </div>
            <p className="text-slate-300 text-sm">
              Ask questions about your content strategy, app features, or get creative ideas
            </p>
          </div>

          <div className="bg-slate-700/30 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-2">
              <ChartBarIcon className="w-5 h-5 text-green-400" />
              <h3 className="font-semibold text-white">Performance Analysis</h3>
            </div>
            <p className="text-slate-300 text-sm">
              Get insights on your content performance and optimization suggestions
            </p>
          </div>

          <div className="bg-slate-700/30 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-2">
              <LightBulbIcon className="w-5 h-5 text-yellow-400" />
              <h3 className="font-semibold text-white">Smart Suggestions</h3>
            </div>
            <p className="text-slate-300 text-sm">
              Personalized recommendations based on your projects and activity
            </p>
          </div>

          <div className="bg-slate-700/30 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-2">
              <RocketLaunchIcon className="w-5 h-5 text-purple-400" />
              <h3 className="font-semibold text-white">Workflow Optimization</h3>
            </div>
            <p className="text-slate-300 text-sm">
              Get tips to improve your content creation workflow and efficiency
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-xl p-4">
          <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
            <BeakerIcon className="w-5 h-5" />
            Features Implemented
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-slate-300">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-400 rounded-full"></span>
              <span>Floating AI assistant bubble</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-400 rounded-full"></span>
              <span>Studio Hub sidebar integration</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-400 rounded-full"></span>
              <span>Context-aware responses</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-400 rounded-full"></span>
              <span>Intelligent content suggestions</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-400 rounded-full"></span>
              <span>Performance analysis insights</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-400 rounded-full"></span>
              <span>Tiered access by subscription</span>
            </div>
          </div>
        </div>

        <div className="text-center">
          <p className="text-slate-400 text-sm">
            🎯 <strong>Ready to use!</strong> Look for the purple floating button or check the Studio Hub sidebar
          </p>
        </div>
      </div>
    </div>
  );
};

export default AIAssistantDemo;
