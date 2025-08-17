import React from "react";
import { useCredits } from "../context/CreditContext";
import { useSubscription } from "../context/SubscriptionContext";
import {
  CreditCardIcon,
  AlertIcon,
} from "./ProfessionalIcons";

const HeaderCreditDisplay: React.FC = () => {
  const { credits, loading } = useCredits();
  const { billingInfo } = useSubscription();

  if (loading || !credits) {
    return (
      <div className="animate-pulse">
        <div className="h-6 w-16 bg-slate-700/50 rounded"></div>
      </div>
    );
  }

  const isUnlimited = billingInfo?.subscription?.planId === "enterprise";
  const isLow = credits.totalCredits <= 10;

  if (isUnlimited) {
    return (
      <div className="flex items-center px-2 py-1 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-400/30 rounded-lg">
        <div className="flex items-center">
          <CreditCardIcon className="h-3 w-3 text-yellow-400 flex-shrink-0" />
          <span className="text-yellow-300 text-xs font-semibold leading-none ml-1">
            ∞
          </span>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`flex items-center px-2 py-1 rounded-lg border ${
        isLow
          ? "bg-gradient-to-r from-amber-500/20 to-orange-500/20 border-amber-400/30"
          : "bg-gradient-to-r from-sky-500/20 to-purple-500/20 border-sky-400/30"
      }`}
    >
      <div className="flex items-center">
        {isLow ? (
          <AlertIcon className="h-3 w-3 text-amber-400 flex-shrink-0" />
        ) : (
          <CreditCardIcon className="h-3 w-3 text-sky-400 flex-shrink-0" />
        )}
        <span
          className={`text-xs font-semibold leading-none ml-1 ${
            isLow ? "text-amber-300" : "text-sky-300"
          }`}
        >
          {credits.totalCredits}
        </span>
        {isLow && (
          <div className="w-1 h-1 bg-amber-400 rounded-full animate-pulse ml-1"></div>
        )}
      </div>
    </div>
  );
};

export default HeaderCreditDisplay;
