import React from "react";
import { useSubscription } from "../context/SubscriptionContext";
import { SUBSCRIPTION_PLANS } from "../services/stripeService";

interface UsageWarningProps {
  onUpgrade: () => void;
}

export const UsageWarning: React.FC<UsageWarningProps> = ({ onUpgrade }) => {
  const { billingInfo } = useSubscription();

  if (!billingInfo || billingInfo.status === "active") {
    return null; // Don't show for premium users
  }

  const currentPlan =
    SUBSCRIPTION_PLANS.find((p) => p.id === "free") || SUBSCRIPTION_PLANS[0];
  const usedGenerations = billingInfo.usage?.generations || 0;
  const totalGenerations = currentPlan.limits.generations;
  const usagePercentage = (usedGenerations / totalGenerations) * 100;

  // Only show when user has used 50% or more of their limit
  if (usagePercentage < 50) {
    return null;
  }

  const isNearLimit = usagePercentage >= 80;
  const isAtLimit = usagePercentage >= 100;

  return (
    <div
      className={`mb-6 p-4 border rounded-2xl ${
        isAtLimit
          ? "bg-red-500/10 border-red-400/30"
          : isNearLimit
            ? "bg-amber-500/10 border-amber-400/30"
            : "bg-sky-500/10 border-sky-400/30"
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="text-2xl">
            {isAtLimit ? "🚫" : isNearLimit ? "⚠️" : "💡"}
          </div>
          <div>
            <h4
              className={`font-semibold ${
                isAtLimit
                  ? "text-red-300"
                  : isNearLimit
                    ? "text-amber-300"
                    : "text-sky-300"
              }`}
            >
              {isAtLimit
                ? "Generation Limit Reached"
                : isNearLimit
                  ? "Approaching Monthly Limit"
                  : "Upgrade for Unlimited"}
            </h4>
            <p className="text-slate-400 text-sm">
              You've used {usedGenerations} of {totalGenerations} free
              generations this month
            </p>
          </div>
        </div>

        <button
          onClick={onUpgrade}
          className={`px-4 py-2 rounded-xl font-semibold transition-all hover:scale-105 shadow-lg ${
            isAtLimit
              ? "bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-500 hover:to-pink-500"
              : "bg-gradient-to-r from-sky-600 to-purple-600 hover:from-sky-500 hover:to-purple-500"
          } text-white`}
        >
          {isAtLimit ? "Upgrade Now" : "Get Pro"}
        </button>
      </div>

      {/* Progress Bar */}
      <div className="mt-3">
        <div className="w-full bg-slate-700 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-500 ${
              isAtLimit
                ? "bg-gradient-to-r from-red-500 to-pink-500"
                : isNearLimit
                  ? "bg-gradient-to-r from-amber-500 to-orange-500"
                  : "bg-gradient-to-r from-sky-500 to-purple-500"
            }`}
            style={{ width: `${Math.min(usagePercentage, 100)}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-slate-400 mt-1">
          <span>{usedGenerations} used</span>
          <span>{totalGenerations} total</span>
        </div>
      </div>

      {isAtLimit && (
        <div className="mt-3 p-3 bg-slate-800/50 rounded-xl">
          <h5 className="text-white font-medium mb-2">
            🚀 Upgrade to Pro to unlock:
          </h5>
          <ul className="text-slate-300 text-sm space-y-1">
            <li>• 1,000 AI generations per month</li>
            <li>• Advanced premium templates</li>
            <li>• Batch content generation</li>
            <li>• Custom AI personas</li>
            <li>• SEO optimization tools</li>
          </ul>
        </div>
      )}
    </div>
  );
};
