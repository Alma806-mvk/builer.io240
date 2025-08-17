import React, { useState } from "react";
import {
  ChatBubbleLeftRightIcon,
  BugAntIcon,
  LightBulbIcon,
  QuestionMarkCircleIcon,
  BookOpenIcon,
  XMarkIcon,
  PaperAirplaneIcon,
  HeartIcon,
  ExclamationTriangleIcon,
} from "./IconComponents";
import { FeedbackService } from "../services/feedbackService";
import { useAuth } from "../context/AuthContext";
import Documentation from "./Documentation";

interface FeedbackWidgetProps {
  className?: string;
}

type FeedbackType = "bug" | "suggestion" | "question" | "other";

const FeedbackWidget: React.FC<FeedbackWidgetProps> = ({ className = "" }) => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"main" | "feedback" | "contact">(
    "main",
  );
  const [feedbackType, setFeedbackType] = useState<FeedbackType>("suggestion");
  const [feedbackText, setFeedbackText] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [showDocumentation, setShowDocumentation] = useState(false);

  const handleSubmitFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const result = await FeedbackService.submitFeedback({
        type: feedbackType,
        message: feedbackText,
        email: email || user?.email || undefined,
        userId: user?.uid,
      });

      if (result.success) {
        setSubmitted(true);
        setFeedbackText("");
        setEmail("");

        // Reset after 3 seconds
        setTimeout(() => {
          setSubmitted(false);
          setActiveTab("main");
        }, 3000);
      } else {
        setSubmitError("Failed to submit feedback. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
      setSubmitError("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const quickActions = [
    {
      icon: <BugAntIcon className="h-5 w-5" />,
      label: "Report Bug",
      description: "Found something broken?",
      action: () => {
        setFeedbackType("bug");
        setActiveTab("feedback");
      },
      color: "from-red-500 to-red-600",
    },
    {
      icon: <LightBulbIcon className="h-5 w-5" />,
      label: "Suggest Feature",
      description: "Share your ideas",
      action: () => {
        setFeedbackType("suggestion");
        setActiveTab("feedback");
      },
      color: "from-yellow-500 to-yellow-600",
    },
    {
      icon: <QuestionMarkCircleIcon className="h-5 w-5" />,
      label: "Get Help",
      description: "Need assistance?",
      action: () => {
        setFeedbackType("question");
        setActiveTab("feedback");
      },
      color: "from-blue-500 to-blue-600",
    },
    {
      icon: <BookOpenIcon className="h-5 w-5" />,
      label: "Documentation",
      description: "Learn how to use CreateGen",
      action: () => {
        setShowDocumentation(true);
      },
      color: "from-purple-500 to-purple-600",
    },
  ];

  const feedbackTypes = [
    {
      value: "bug",
      label: "Bug Report",
      icon: <BugAntIcon className="h-4 w-4" />,
      color: "text-red-400",
    },
    {
      value: "suggestion",
      label: "Feature Request",
      icon: <LightBulbIcon className="h-4 w-4" />,
      color: "text-yellow-400",
    },
    {
      value: "question",
      label: "Question",
      icon: <QuestionMarkCircleIcon className="h-4 w-4" />,
      color: "text-blue-400",
    },
    {
      value: "other",
      label: "Other",
      icon: <ChatBubbleLeftRightIcon className="h-4 w-4" />,
      color: "text-slate-400",
    },
  ];

  if (!isOpen) {
    return (
      <div className={`fixed bottom-20 right-20 z-50 ${className}`}>
        <button
          onClick={() => setIsOpen(true)}
          className="group relative w-14 h-14 bg-gradient-to-r from-sky-600 to-purple-600 hover:from-sky-500 hover:to-purple-500 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 flex items-center justify-center"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-sky-400/20 to-purple-400/20 rounded-full animate-pulse"></div>
          <ChatBubbleLeftRightIcon className="h-6 w-6 relative z-10" />

          {/* Tooltip */}
          <div className="absolute bottom-16 right-0 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            <div className="bg-slate-800 text-white text-sm px-3 py-2 rounded-lg shadow-lg whitespace-nowrap">
              Help & Feedback
              <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-slate-800"></div>
            </div>
          </div>
        </button>
      </div>
    );
  }

  return (
    <div className={`fixed bottom-20 right-20 z-50 ${className}`}>
      <div className="w-80 bg-slate-800/95 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-700/50">
          <div className="flex items-center space-x-2">
            {activeTab === "main" && (
              <>
                <ChatBubbleLeftRightIcon className="h-5 w-5 text-sky-400" />
                <span className="font-semibold text-white">
                  Help & Feedback
                </span>
              </>
            )}
            {activeTab === "feedback" && (
              <>
                <button
                  onClick={() => setActiveTab("main")}
                  className="p-1 text-slate-400 hover:text-white transition-colors"
                >
                  ←
                </button>
                <span className="font-semibold text-white">Send Feedback</span>
              </>
            )}
          </div>
          <button
            onClick={() => {
              setIsOpen(false);
              setActiveTab("main");
              setSubmitted(false);
            }}
            className="p-1 text-slate-400 hover:text-white transition-colors"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          {activeTab === "main" && (
            <div className="space-y-3">
              <p className="text-slate-300 text-sm mb-4">
                How can we help you today?
              </p>

              {quickActions.map((action, index) => (
                <button
                  key={index}
                  onClick={action.action}
                  className="w-full p-3 bg-slate-700/50 hover:bg-slate-700/80 border border-slate-600/50 hover:border-slate-500/70 rounded-xl transition-all duration-200 flex items-center space-x-3 group"
                >
                  <div
                    className={`p-2 bg-gradient-to-r ${action.color} rounded-lg flex-shrink-0`}
                  >
                    <div className="text-white">{action.icon}</div>
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-white group-hover:text-sky-300 transition-colors">
                      {action.label}
                    </div>
                    <div className="text-sm text-slate-400">
                      {action.description}
                    </div>
                  </div>
                </button>
              ))}

              {/* Quick Links */}
              <div className="pt-4 border-t border-slate-700/50 space-y-2">
                <a
                  href="mailto:creategenstudio@gmail.com"
                  className="flex items-center space-x-2 text-sm text-slate-400 hover:text-sky-400 transition-colors"
                >
                  <span>✉️</span>
                  <span>creategenstudio@gmail.com</span>
                </a>
                <div className="flex items-center space-x-2 text-sm text-slate-400">
                  <HeartIcon className="h-4 w-4 text-red-400" />
                  <span>Made with love for creators</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === "feedback" && !submitted && (
            <form onSubmit={handleSubmitFeedback} className="space-y-4">
              {/* Error Message */}
              {submitError && (
                <div className="p-3 bg-red-900/30 border border-red-500/50 rounded-lg">
                  <p className="text-red-400 text-sm">{submitError}</p>
                </div>
              )}
              {/* Feedback Type Selection */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  What type of feedback is this?
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {feedbackTypes.map((type) => (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() =>
                        setFeedbackType(type.value as FeedbackType)
                      }
                      className={`p-2 border rounded-lg transition-all duration-200 flex items-center space-x-2 text-sm ${
                        feedbackType === type.value
                          ? "border-sky-500 bg-sky-500/10 text-sky-400"
                          : "border-slate-600 bg-slate-700/30 text-slate-400 hover:border-slate-500"
                      }`}
                    >
                      <div className={type.color}>{type.icon}</div>
                      <span>{type.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Feedback Message */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  {feedbackType === "bug"
                    ? "Describe the bug"
                    : feedbackType === "suggestion"
                      ? "Describe your idea"
                      : feedbackType === "question"
                        ? "What do you need help with?"
                        : "Tell us more"}
                </label>
                <textarea
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent resize-none"
                  rows={4}
                  placeholder={
                    feedbackType === "bug"
                      ? "Steps to reproduce the issue..."
                      : feedbackType === "suggestion"
                        ? "I would love to see..."
                        : feedbackType === "question"
                          ? "I need help with..."
                          : "Please describe..."
                  }
                  required
                />
              </div>

              {/* Email (Optional) */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Email {user ? "(from your account)" : "(optional)"}
                </label>
                <input
                  type="email"
                  value={email || user?.email || ""}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  placeholder={user?.email || "your@email.com"}
                  disabled={!!user?.email && !email}
                />
                <p className="text-xs text-slate-500 mt-1">
                  {user
                    ? "We'll use your account email unless you specify a different one"
                    : "We'll only use this to follow up on your feedback"}
                </p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting || !feedbackText.trim()}
                className="w-full px-4 py-2 bg-gradient-to-r from-sky-600 to-purple-600 hover:from-sky-500 hover:to-purple-500 disabled:from-slate-600 disabled:to-slate-600 text-white rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <PaperAirplaneIcon className="h-4 w-4" />
                    <span>Send Feedback</span>
                  </>
                )}
              </button>
            </form>
          )}

          {activeTab === "feedback" && submitted && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  ✓
                </div>
              </div>
              <h3 className="text-white font-semibold mb-2">Thank you!</h3>
              <p className="text-slate-400 text-sm">
                Your feedback has been sent. We appreciate you helping us
                improve CreateGen Studio!
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Documentation Modal */}
      <Documentation
        isOpen={showDocumentation}
        onClose={() => setShowDocumentation(false)}
      />
    </div>
  );
};

export default FeedbackWidget;
