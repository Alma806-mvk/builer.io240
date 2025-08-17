import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  SparklesIcon,
  PlayCircleIcon,
  CheckCircleIcon,
  RightArrowIcon,
  XCircleIcon,
  StarIcon,
  BoltIcon,
  PenToolIcon,
  ChartBarIcon,
  UsersIcon,
  LightBulbIcon,
} from "./IconComponents";
import { useAuth } from "../context/AuthContext";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../config/firebase";

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  action?: string;
  completed: boolean;
}

interface CleanOnboardingProps {
  onComplete: () => void;
  onSkip: () => void;
}

export const CleanOnboarding: React.FC<CleanOnboardingProps> = ({
  onComplete,
  onSkip,
}) => {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [isCompleting, setIsCompleting] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);

  const roles = [
    {
      id: "creator",
      label: "Content Creator",
      icon: "🎨",
      color: "from-purple-500 to-pink-500",
    },
    {
      id: "marketer",
      label: "Digital Marketer",
      icon: "📊",
      color: "from-blue-500 to-cyan-500",
    },
    {
      id: "business",
      label: "Business Owner",
      icon: "🏢",
      color: "from-green-500 to-emerald-500",
    },
    {
      id: "agency",
      label: "Agency/Team",
      icon: "👥",
      color: "from-orange-500 to-red-500",
    },
    {
      id: "other",
      label: "Other",
      icon: "✨",
      color: "from-gray-500 to-slate-500",
    },
  ];

  const goals = [
    { id: "save-time", label: "Save time on content creation", icon: "⏰" },
    { id: "grow-audience", label: "Grow my audience", icon: "📈" },
    { id: "improve-quality", label: "Improve content quality", icon: "✨" },
    { id: "increase-engagement", label: "Increase engagement", icon: "💬" },
    { id: "generate-ideas", label: "Generate fresh ideas", icon: "💡" },
    { id: "scale-production", label: "Scale content production", icon: "🚀" },
  ];

  const steps: OnboardingStep[] = [
    {
      id: "welcome",
      title: "Welcome to CreateGen Studio!",
      description: "Your AI-powered content creation assistant",
      icon: <SparklesIcon className="h-8 w-8" />,
      completed: true,
    },
    {
      id: "role",
      title: "What best describes you?",
      description: "We'll customize your experience based on your role",
      icon: <UsersIcon className="h-8 w-8" />,
      completed: selectedRole !== "",
    },
    {
      id: "goals",
      title: "What are your main goals?",
      description: "Select all that apply to personalize your dashboard",
      icon: <StarIcon className="h-8 w-8" />,
      completed: selectedGoals.length > 0,
    },
    {
      id: "ready",
      title: "You're all set!",
      description: "Let's create some amazing content together",
      icon: <CheckCircleIcon className="h-8 w-8" />,
      completed: true,
    },
  ];

  const handleGoalToggle = (goalId: string) => {
    setSelectedGoals((prev) =>
      prev.includes(goalId)
        ? prev.filter((id) => id !== goalId)
        : [...prev, goalId],
    );
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = async () => {
    if (!user) return;

    setIsCompleting(true);

    try {
      // Save onboarding data to Firestore
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        onboardingCompleted: true,
        onboardingData: {
          role: selectedRole,
          goals: selectedGoals,
          completedAt: new Date(),
        },
        isNewUser: false,
      });

      // Small delay for smooth UX
      setTimeout(() => {
        onComplete();
      }, 1000);
    } catch (error) {
      console.error("Error completing onboarding:", error);
      // Still complete onboarding even if save fails
      onComplete();
    }
  };

  const progress = ((currentStep + 1) / steps.length) * 100;

  if (showWelcome) {
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-slate-900 rounded-2xl border border-slate-700 shadow-2xl max-w-2xl w-full overflow-hidden"
        >
          {/* Header */}
          <div className="relative bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-center">
            <button
              onClick={onSkip}
              className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors"
            >
              <XCircleIcon className="h-5 w-5" />
            </button>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-6xl mb-4"
            >
              🎉
            </motion.div>

            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-3xl font-bold text-white mb-2"
            >
              Welcome to CreateGen Studio!
            </motion.h1>

            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-indigo-100 text-lg"
            >
              The AI-powered content creation platform that helps you create
              amazing content 10x faster
            </motion.p>
          </div>

          {/* Features Preview */}
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-center"
              >
                <div className="w-12 h-12 bg-indigo-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <BoltIcon className="h-6 w-6 text-indigo-400" />
                </div>
                <h3 className="text-white font-semibold mb-1">AI-Powered</h3>
                <p className="text-slate-400 text-sm">
                  Generate content with advanced AI in seconds
                </p>
              </motion.div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-center"
              >
                <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <PenToolIcon className="h-6 w-6 text-green-400" />
                </div>
                <h3 className="text-white font-semibold mb-1">
                  Multi-Platform
                </h3>
                <p className="text-slate-400 text-sm">
                  Create for Instagram, TikTok, YouTube & more
                </p>
              </motion.div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="text-center"
              >
                <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <ChartBarIcon className="h-6 w-6 text-purple-400" />
                </div>
                <h3 className="text-white font-semibold mb-1">Analytics</h3>
                <p className="text-slate-400 text-sm">
                  Track performance and optimize your content
                </p>
              </motion.div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setShowWelcome(false)}
                className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-all flex items-center justify-center gap-2"
              >
                <PlayCircleIcon className="h-5 w-5" />
                Get Started (2 min setup)
              </button>

              <button
                onClick={onSkip}
                className="flex-1 bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Skip for now
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        key={currentStep}
        initial={{ x: 300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: -300, opacity: 0 }}
        className="bg-slate-900 rounded-2xl border border-slate-700 shadow-2xl max-w-lg w-full overflow-hidden"
      >
        {/* Progress Bar */}
        <div className="h-1 bg-slate-700">
          <motion.div
            className="h-1 bg-gradient-to-r from-indigo-500 to-purple-500"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {/* Header */}
        <div className="p-6 pb-4">
          <button
            onClick={onSkip}
            className="float-right text-slate-400 hover:text-white transition-colors"
          >
            <XCircleIcon className="h-5 w-5" />
          </button>

          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-indigo-500/20 rounded-full flex items-center justify-center">
              {steps[currentStep].icon}
            </div>
            <div>
              <div className="text-sm text-slate-400">
                Step {currentStep + 1} of {steps.length}
              </div>
              <h2 className="text-xl font-bold text-white">
                {steps[currentStep].title}
              </h2>
            </div>
          </div>

          <p className="text-slate-400">{steps[currentStep].description}</p>
        </div>

        {/* Content */}
        <div className="px-6 pb-6">
          <AnimatePresence mode="wait">
            {currentStep === 1 && (
              <motion.div
                key="role"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-3"
              >
                {roles.map((role) => (
                  <button
                    key={role.id}
                    onClick={() => setSelectedRole(role.id)}
                    className={`w-full p-4 rounded-lg border-2 transition-all text-left flex items-center gap-3 ${
                      selectedRole === role.id
                        ? "border-indigo-500 bg-indigo-500/10"
                        : "border-slate-600 hover:border-slate-500 bg-slate-800/50"
                    }`}
                  >
                    <span className="text-2xl">{role.icon}</span>
                    <span className="text-white font-medium">{role.label}</span>
                  </button>
                ))}
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div
                key="goals"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-3"
              >
                {goals.map((goal) => (
                  <button
                    key={goal.id}
                    onClick={() => handleGoalToggle(goal.id)}
                    className={`w-full p-4 rounded-lg border-2 transition-all text-left flex items-center gap-3 ${
                      selectedGoals.includes(goal.id)
                        ? "border-indigo-500 bg-indigo-500/10"
                        : "border-slate-600 hover:border-slate-500 bg-slate-800/50"
                    }`}
                  >
                    <span className="text-xl">{goal.icon}</span>
                    <span className="text-white font-medium">{goal.label}</span>
                    {selectedGoals.includes(goal.id) && (
                      <CheckCircleIcon className="h-5 w-5 text-indigo-400 ml-auto" />
                    )}
                  </button>
                ))}
              </motion.div>
            )}

            {currentStep === 3 && (
              <motion.div
                key="ready"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-center py-8"
              >
                <div className="text-6xl mb-4">🚀</div>
                <h3 className="text-2xl font-bold text-white mb-3">
                  You're ready to create!
                </h3>
                <p className="text-slate-400 mb-6">
                  Based on your selections, we've customized your experience as
                  a{" "}
                  <span className="text-indigo-400 font-semibold">
                    {roles.find((r) => r.id === selectedRole)?.label}
                  </span>
                </p>

                <div className="bg-slate-800 rounded-lg p-4 mb-6">
                  <h4 className="text-white font-medium mb-2">
                    🎁 Welcome Bonus
                  </h4>
                  <p className="text-slate-300 text-sm">
                    You've received 10 free AI generations to get started!
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="bg-slate-800/50 p-6 flex justify-between items-center">
          <button
            onClick={() => setCurrentStep((prev) => Math.max(0, prev - 1))}
            disabled={currentStep === 0}
            className="text-slate-400 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Back
          </button>

          <button
            onClick={handleNext}
            disabled={
              (currentStep === 1 && !selectedRole) ||
              (currentStep === 2 && selectedGoals.length === 0) ||
              isCompleting
            }
            className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-semibold py-2 px-6 rounded-lg transition-colors flex items-center gap-2"
          >
            {isCompleting ? (
              "Setting up..."
            ) : currentStep === steps.length - 1 ? (
              "Start Creating"
            ) : (
              <>
                Next
                <RightArrowIcon className="h-4 w-4" />
              </>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default CleanOnboarding;
