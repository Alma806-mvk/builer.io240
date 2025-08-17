import React from "react";
import {
  SparklesIcon,
  GiftIcon,
  ArrowUpRightIcon,
  XMarkIcon,
} from "./IconComponents";

interface FreeCreditsPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSignUp: () => void;
}

const FreeCreditsPopup: React.FC<FreeCreditsPopupProps> = ({
  isOpen,
  onClose,
  onSignUp,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop with blur effect */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Popup Content */}
      <div className="relative bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-xl rounded-3xl border border-slate-600/50 p-8 max-w-md w-full mx-4 shadow-2xl transform animate-scale-in">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-full transition-all duration-200"
        >
          <XMarkIcon className="h-5 w-5" />
        </button>

        {/* Gift Icon with Animation */}
        <div className="text-center mb-6">
          <div className="relative inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-sky-500 to-purple-600 rounded-2xl mb-4 animate-bounce-subtle">
            <GiftIcon className="h-10 w-10 text-white" />
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center animate-pulse">
              <SparklesIcon className="h-3 w-3 text-white" />
            </div>
          </div>
        </div>

        {/* Main Message */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white mb-3 leading-tight">
            <span className="bg-gradient-to-r from-sky-400 to-purple-400 bg-clip-text text-transparent">
              You have 25 free AI credits waiting!
            </span>
          </h2>
          <p className="text-slate-300 text-base leading-relaxed">
            Sign up now to claim your free credits and start creating amazing
            content with our AI-powered tools.
          </p>
        </div>

        {/* Features List */}
        <div className="space-y-3 mb-8">
          <div className="flex items-center gap-3 text-slate-300">
            <div className="w-2 h-2 bg-gradient-to-r from-sky-400 to-purple-400 rounded-full animate-pulse"></div>
            <span className="text-sm">25 free AI generations per month</span>
          </div>
          <div className="flex items-center gap-3 text-slate-300">
            <div className="w-2 h-2 bg-gradient-to-r from-sky-400 to-purple-400 rounded-full animate-pulse delay-100"></div>
            <span className="text-sm">Access to all content types</span>
          </div>
          <div className="flex items-center gap-3 text-slate-300">
            <div className="w-2 h-2 bg-gradient-to-r from-sky-400 to-purple-400 rounded-full animate-pulse delay-200"></div>
            <span className="text-sm">No credit card required</span>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="space-y-3">
          <button
            onClick={onSignUp}
            className="w-full group relative px-6 py-4 bg-gradient-to-r from-sky-600 to-purple-600 hover:from-sky-500 hover:to-purple-500 text-white rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 overflow-hidden shadow-lg hover:shadow-xl"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-sky-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative flex items-center justify-center gap-3">
              <SparklesIcon className="h-5 w-5 animate-pulse" />
              <span>Claim Your Free Credits</span>
              <ArrowUpRightIcon className="h-4 w-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-200" />
            </div>
          </button>

          <button
            onClick={onClose}
            className="w-full px-6 py-3 text-slate-400 hover:text-white font-medium transition-colors duration-200"
          >
            Maybe later
          </button>
        </div>

        {/* Trust Indicators */}
        <div className="text-center mt-6 pt-6 border-t border-slate-700/50">
          <p className="text-xs text-slate-500">
            ✨ Instant access • 🔒 No spam • 🚀 Cancel anytime
          </p>
        </div>
      </div>
    </div>
  );
};

export default FreeCreditsPopup;
