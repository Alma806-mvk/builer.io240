import React, { useState, useEffect } from "react";
import { useSubscription } from "../../context/SubscriptionContext";
import { useFeatureLimits } from "../../services/featureLimitsService";

interface SmartLimitedSliderProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  feature: "batchVariations";
  disabled?: boolean;
  showUpgradePrompt?: boolean;
}

export const SmartLimitedSlider: React.FC<SmartLimitedSliderProps> = ({
  label,
  value,
  onChange,
  feature,
  disabled = false,
  showUpgradePrompt = true,
}) => {
  const { billingInfo } = useSubscription();
  const featureLimits = useFeatureLimits(billingInfo);
  const [showLimitWarning, setShowLimitWarning] = useState(false);

  const limits = featureLimits.getCurrentLimits();
  const currentPlan = featureLimits.getCurrentPlan();
  const { min, max, default: defaultValue } = limits.batchVariations;

  // Enforce the value when it changes
  useEffect(() => {
    const result = featureLimits.validateAndEnforceValue(feature, value);
    if (result.wasChanged) {
      onChange(result.enforcedValue);
      setShowLimitWarning(true);
      // Hide warning after 3 seconds
      setTimeout(() => setShowLimitWarning(false), 3000);
    }
  }, [value, feature, featureLimits, onChange]);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value);
    const result = featureLimits.validateAndEnforceValue(feature, newValue);
    onChange(result.enforcedValue);

    if (result.wasChanged) {
      setShowLimitWarning(true);
      setTimeout(() => setShowLimitWarning(false), 3000);
    }
  };

  const isPremiumFeature = currentPlan.name === "Creator Free" && max <= 2;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label
          htmlFor={feature}
          className="block text-sm font-medium text-slate-300"
        >
          {label}: {value}
          {isPremiumFeature && (
            <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs bg-amber-500/20 text-amber-300 border border-amber-500/30">
              Free Plan
            </span>
          )}
        </label>

        {showUpgradePrompt && isPremiumFeature && (
          <button
            onClick={() => (window.location.href = "/billing")}
            className="text-xs bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white px-3 py-1 rounded-lg font-medium transition-all"
          >
            Upgrade for More
          </button>
        )}
      </div>

      <div className="relative">
        <input
          id={feature}
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={handleSliderChange}
          className={`w-full h-2 rounded-lg appearance-none cursor-pointer transition-all ${
            isPremiumFeature
              ? "bg-amber-700/50 slider-thumb-amber"
              : "bg-slate-700 slider-thumb"
          }`}
          disabled={disabled}
        />

        <div className="flex justify-between text-xs text-slate-400 mt-1">
          {Array.from({ length: max - min + 1 }, (_, i) => min + i).map(
            (num) => (
              <span
                key={num}
                className={num > max ? "text-slate-600 line-through" : ""}
              >
                {num}
              </span>
            ),
          )}
        </div>
      </div>

      {/* Plan limit indicator */}
      <div className="flex items-center justify-between text-xs">
        <span className="text-slate-400">
          Your plan:{" "}
          <span className="text-slate-300 font-medium">{currentPlan.name}</span>
        </span>
        <span className="text-slate-400">
          Max: <span className="text-sky-300 font-medium">{max}</span>
        </span>
      </div>

      {/* Limit warning */}
      {showLimitWarning && (
        <div className="bg-amber-500/20 border border-amber-500/30 rounded-lg p-3 text-amber-200 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-amber-400">⚠️</span>
            <div>
              <div className="font-medium">Plan Limit Applied</div>
              <div className="text-xs opacity-90">
                Maximum {max} variations allowed for {currentPlan.name} plan
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .slider-thumb::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: linear-gradient(135deg, #0ea5e9, #8b5cf6);
          cursor: pointer;
          border: 2px solid #1e293b;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
        }

        .slider-thumb-amber::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: linear-gradient(135deg, #f59e0b, #d97706);
          cursor: pointer;
          border: 2px solid #1e293b;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
        }

        .slider-thumb::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: linear-gradient(135deg, #0ea5e9, #8b5cf6);
          cursor: pointer;
          border: 2px solid #1e293b;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
        }
      `}</style>
    </div>
  );
};

interface SmartLimitedSelectProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  feature: "courseModules";
  disabled?: boolean;
  showUpgradePrompt?: boolean;
}

export const SmartLimitedSelect: React.FC<SmartLimitedSelectProps> = ({
  label,
  value,
  onChange,
  feature,
  disabled = false,
  showUpgradePrompt = true,
}) => {
  const { billingInfo } = useSubscription();
  const featureLimits = useFeatureLimits(billingInfo);
  const [showLimitWarning, setShowLimitWarning] = useState(false);

  const currentPlan = featureLimits.getCurrentPlan();
  const availableOptions = featureLimits.getAvailableCourseModuleOptions();
  const allOptions = [3, 5, 7, 10, 12, 15, 20];

  // Enforce the value when it changes
  useEffect(() => {
    const result = featureLimits.validateAndEnforceValue(feature, value);
    if (result.wasChanged) {
      onChange(result.enforcedValue);
      setShowLimitWarning(true);
      setTimeout(() => setShowLimitWarning(false), 3000);
    }
  }, [value, feature, featureLimits, onChange]);

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = parseInt(e.target.value);
    const result = featureLimits.validateAndEnforceValue(feature, newValue);
    onChange(result.enforcedValue);

    if (result.wasChanged) {
      setShowLimitWarning(true);
      setTimeout(() => setShowLimitWarning(false), 3000);
    }
  };

  const isPremiumFeature = currentPlan.name === "Creator Free";

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label
          htmlFor={feature}
          className="block text-sm font-medium text-slate-300"
        >
          {label}
          {isPremiumFeature && (
            <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs bg-amber-500/20 text-amber-300 border border-amber-500/30">
              Limited
            </span>
          )}
        </label>

        {showUpgradePrompt && availableOptions.length < allOptions.length && (
          <button
            onClick={() => (window.location.href = "/billing")}
            className="text-xs bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white px-3 py-1 rounded-lg font-medium transition-all"
          >
            Unlock More Options
          </button>
        )}
      </div>

      <select
        id={feature}
        value={value}
        onChange={handleSelectChange}
        className={`w-full p-2.5 rounded-lg text-slate-100 text-sm focus:ring-2 focus:border-cyan-500 transition-all ${
          isPremiumFeature
            ? "bg-amber-700/30 border border-amber-500/50 focus:ring-amber-500"
            : "bg-slate-700/50 border border-slate-600/50 focus:ring-cyan-500"
        }`}
        disabled={disabled}
      >
        {allOptions.map((option) => (
          <option
            key={option}
            value={option}
            disabled={!availableOptions.includes(option)}
            className={
              availableOptions.includes(option) ? "" : "text-slate-500"
            }
          >
            {option} Modules
            {!availableOptions.includes(option) && " (Premium)"}
          </option>
        ))}
      </select>

      {/* Plan indicator */}
      <div className="flex items-center justify-between text-xs">
        <span className="text-slate-400">
          Available:{" "}
          <span className="text-slate-300 font-medium">
            {availableOptions.length}/{allOptions.length} options
          </span>
        </span>
        <span className="text-slate-400">
          Plan:{" "}
          <span className="text-sky-300 font-medium">{currentPlan.name}</span>
        </span>
      </div>

      {/* Limit warning */}
      {showLimitWarning && (
        <div className="bg-amber-500/20 border border-amber-500/30 rounded-lg p-3 text-amber-200 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-amber-400">⚠️</span>
            <div>
              <div className="font-medium">Option Restricted</div>
              <div className="text-xs opacity-90">
                This option requires a higher plan. Using closest available
                option.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

interface PremiumFeatureWrapperProps {
  feature: string;
  children: React.ReactNode;
  fallbackContent?: React.ReactNode;
  showUpgradeButton?: boolean;
}

export const PremiumFeatureWrapper: React.FC<PremiumFeatureWrapperProps> = ({
  feature,
  children,
  fallbackContent,
  showUpgradeButton = true,
}) => {
  const { billingInfo } = useSubscription();
  const featureLimits = useFeatureLimits(billingInfo);

  const canUse = featureLimits.canUseFeature(feature as any);
  const currentPlan = featureLimits.getCurrentPlan();

  if (canUse) {
    return <>{children}</>;
  }

  if (fallbackContent) {
    return <>{fallbackContent}</>;
  }

  return (
    <div className="relative">
      {/* Disabled overlay */}
      <div className="relative">
        <div className="opacity-50 pointer-events-none">{children}</div>

        {/* Premium overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-orange-500/10 backdrop-blur-[1px] rounded-lg border border-amber-500/30 flex items-center justify-center">
          <div className="text-center p-4">
            <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-full p-3 w-12 h-12 mx-auto mb-3 flex items-center justify-center">
              <span className="text-white text-xl">⭐</span>
            </div>
            <div className="text-amber-300 font-semibold text-sm mb-1">
              Premium Feature
            </div>
            <div className="text-amber-200/80 text-xs mb-3">
              Available in{" "}
              {currentPlan.name === "Creator Free" ? "Creator Pro" : "higher"}{" "}
              plans
            </div>

            {showUpgradeButton && (
              <button
                onClick={() => (window.location.href = "/billing")}
                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white px-4 py-2 rounded-lg text-xs font-medium transition-all shadow-lg"
              >
                Upgrade Now
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
