import React from "react";
import { useCredits } from "../context/CreditContext";
import { useSubscription } from "../context/SubscriptionContext";
import {
  SparklesIcon,
  ExclamationTriangleIcon,
} from "./IconComponents";
import { CreditCardIcon } from "./ProfessionalIcons";

interface CreditDisplayProps {
  className?: string;
  showDetails?: boolean;
  size?: "small" | "medium" | "large";
}

const CreditDisplay: React.FC<CreditDisplayProps> = ({
  className = "",
  showDetails = false,
  size = "medium",
}) => {
  const { credits, loading } = useCredits();
  const { billingInfo } = useSubscription();

  if (loading) {
    return (
      <div className={`animate-pulse ${className}`}>
        <div className="h-8 bg-slate-700/50 rounded-lg"></div>
      </div>
    );
  }

  if (!credits) return null;

  // Enterprise users have unlimited credits
  const isUnlimited = billingInfo?.subscription?.planId === "enterprise";

  const sizeClasses = {
    small: "text-sm px-3 py-1.5",
    medium: "text-base px-4 py-2",
    large: "text-lg px-6 py-3",
  };

  const iconSizes = {
    small: "h-4 w-4",
    medium: "h-5 w-5",
    large: "h-6 w-6",
  };

  if (isUnlimited) {
    return (
      <div
        data-tour="credits-display"
        className={`inline-flex items-center gap-2 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-400/30 rounded-xl ${sizeClasses[size]} ${className}`}
      >
        <SparklesIcon className={`${iconSizes[size]} text-yellow-400`} />
        <span className="font-semibold text-yellow-300">Unlimited</span>
        {showDetails && (
          <span className="text-yellow-200 text-xs opacity-80">Enterprise</span>
        )}
      </div>
    );
  }

  const getColorScheme = () => {
    if (credits.totalCredits === 0) {
      return {
        bg: "from-red-500/20 to-pink-500/20",
        border: "border-red-400/30",
        text: "text-red-300",
        icon: "text-red-400",
      };
    } else if (credits.totalCredits <= 5) {
      return {
        bg: "from-amber-500/20 to-orange-500/20",
        border: "border-amber-400/30",
        text: "text-amber-300",
        icon: "text-amber-400",
      };
    } else {
      return {
        bg: "from-sky-500/20 to-purple-500/20",
        border: "border-sky-400/30",
        text: "text-sky-300",
        icon: "text-sky-400",
      };
    }
  };

  const colors = getColorScheme();

  return (
    <div
      data-tour="credits-display"
      className={`inline-flex items-center bg-gradient-to-r ${colors.bg} border ${colors.border} rounded-xl ${sizeClasses[size]} ${className}`}
    >
      <div className="flex items-center">
        {credits.totalCredits <= 5 ? (
          <ExclamationTriangleIcon
            className={`${iconSizes[size]} ${colors.icon} flex-shrink-0`}
          />
        ) : (
          <CreditCardIcon
            className={`${iconSizes[size]} ${colors.icon} flex-shrink-0`}
          />
        )}
        <span className={`font-semibold ${colors.text} ml-1`}>
          {credits.totalCredits.toLocaleString()}
        </span>
      </div>

      {showDetails ? (
        <div className={`text-xs ${colors.text} opacity-80 space-y-0.5 ml-2`}>
          <div>Credits</div>
          {credits.subscriptionCredits > 0 && (
            <div className="text-xs opacity-60">
              Sub: {credits.subscriptionCredits}
            </div>
          )}
          {credits.purchasedCredits > 0 && (
            <div className="text-xs opacity-60">
              Purchased: {credits.purchasedCredits}
            </div>
          )}
          {credits.bonusCredits > 0 && (
            <div className="text-xs opacity-60">
              Bonus: {credits.bonusCredits}
            </div>
          )}
        </div>
      ) : (
        <span className={`text-xs ${colors.text} opacity-80 ml-2`}>
          {credits.totalCredits === 1 ? "Credit" : "Credits"}
        </span>
      )}

      {credits.totalCredits <= 5 && size !== "small" && (
        <div className="ml-1 w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
      )}
    </div>
  );
};

export default CreditDisplay;
