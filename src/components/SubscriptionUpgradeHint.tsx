import React from "react";
import { useSubscription } from "../context/SubscriptionContext";

// Icons
const LockIcon = ({ className = "" }) => <span className={className}>🔒</span>;
const ArrowUpIcon = ({ className = "" }) => (
  <span className={className}>⬆️</span>
);
const StarIcon = ({ className = "" }) => <span className={className}>⭐</span>;
const BoltIcon = ({ className = "" }) => <span className={className}>⚡</span>;

interface SubscriptionUpgradeHintProps {
  feature: string;
  requiredPlan: "pro" | "business";
  featureDescription: string;
  onUpgrade?: () => void;
  className?: string;
}

export const SubscriptionUpgradeHint: React.FC<
  SubscriptionUpgradeHintProps
> = ({
  feature,
  requiredPlan,
  featureDescription,
  onUpgrade,
  className = "",
}) => {
  const { billingInfo, canUseFeature } = useSubscription();

  const currentPlan = billingInfo?.subscription?.planId || "free";
  const planNames = {
    free: "Creator Free",
    pro: "Creator Pro",
    business: "Agency Pro",
  };

  const requiredPlanName =
    requiredPlan === "pro" ? "Creator Pro" : "Agency Pro";
  const currentPlanName =
    planNames[currentPlan as keyof typeof planNames] || "Creator Free";

  // Don't show if user already has access
  if (canUseFeature(feature)) {
    return null;
  }

  const getUpgradeMessage = () => {
    if (currentPlan === "free") {
      return `Upgrade to ${requiredPlanName} to unlock ${feature}`;
    } else if (currentPlan === "pro" && requiredPlan === "business") {
      return `Upgrade to Agency Pro to unlock ${feature}`;
    }
    return `${requiredPlanName} required for ${feature}`;
  };

  const getUpgradeButtonText = () => {
    if (currentPlan === "free") {
      return `Get ${requiredPlanName}`;
    } else if (currentPlan === "pro" && requiredPlan === "business") {
      return "Upgrade to Agency Pro";
    }
    return `Upgrade Plan`;
  };

  return (
    <div
      className={`bg-gradient-to-r from-slate-800/80 to-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-xl p-4 shadow-lg ${className}`}
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-400/30 rounded-xl flex items-center justify-center flex-shrink-0">
          <LockIcon className="text-xl text-amber-400" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <h4 className="text-white font-semibold text-sm">{feature}</h4>
            <div className="px-2 py-1 bg-gradient-to-r from-sky-500/20 to-purple-500/20 border border-sky-400/30 rounded-full">
              <span className="text-sky-300 text-xs font-medium">
                {requiredPlanName}
              </span>
            </div>
          </div>

          <p className="text-slate-400 text-xs mb-3 leading-relaxed">
            {featureDescription}
          </p>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs">
              <div className="flex items-center gap-1">
                <span className="text-slate-500">Current:</span>
                <span className="text-slate-300 font-medium">
                  {currentPlanName}
                </span>
              </div>
              <ArrowUpIcon className="text-amber-400" />
              <div className="flex items-center gap-1">
                <span className="text-slate-500">Need:</span>
                <span className="text-sky-300 font-medium">
                  {requiredPlanName}
                </span>
              </div>
            </div>

            <button
              onClick={onUpgrade}
              className="px-3 py-1.5 bg-gradient-to-r from-sky-600 to-purple-600 hover:from-sky-500 hover:to-purple-500 text-white text-xs font-semibold rounded-lg transition-all hover:scale-105 shadow-md flex items-center gap-1"
            >
              <BoltIcon />
              {getUpgradeButtonText()}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionUpgradeHint;
