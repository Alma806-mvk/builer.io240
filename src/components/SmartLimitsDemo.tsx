import React, { useState } from "react";
import { useSubscription } from "../context/SubscriptionContext";
import { useFeatureLimits } from "../services/featureLimitsService";
import { useGenerationValidation } from "../services/generationValidationService";
import {
  SmartLimitedSlider,
  SmartLimitedSelect,
  PremiumFeatureWrapper,
} from "./ui/SmartLimitedInput";

export const SmartLimitsDemo: React.FC = () => {
  const { billingInfo } = useSubscription();
  const featureLimits = useFeatureLimits(billingInfo);
  const validationService = useGenerationValidation(billingInfo);

  // Demo state
  const [batchVariations, setBatchVariations] = useState(3);
  const [courseModules, setCourseModules] = useState(7);
  const [useAdvancedOptions, setUseAdvancedOptions] = useState(true);
  const [useImageGeneration, setUseImageGeneration] = useState(true);
  const [useSeoOptimization, setUseSeoOptimization] = useState(true);
  const [validationResult, setValidationResult] = useState<any>(null);

  const currentPlan = featureLimits.getCurrentPlan();

  const handleValidateRequest = () => {
    const request = {
      userId: "demo-user",
      contentType: "Script",
      batchVariations,
      courseModules,
      useAdvancedOptions,
      useImageGeneration,
      useSeoOptimization,
      useCustomPersonas: true,
    };

    const result = validationService.validateGenerationRequest(request);
    setValidationResult(result);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-slate-800 rounded-xl border border-slate-700">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">
          Smart Limits System Demo
        </h2>
        <p className="text-slate-300">
          This demo shows how the system prevents users from overriding
          subscription limits.
        </p>
      </div>

      {/* Current Plan Info */}
      <div className="bg-gradient-to-r from-slate-700/50 to-slate-600/50 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white">
              Current Plan: {currentPlan.name}
            </h3>
            <p className="text-slate-300 text-sm">{currentPlan.description}</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-sky-400">
              ${currentPlan.price}
            </div>
            <div className="text-slate-400 text-sm">
              /{currentPlan.interval}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Controls */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-white">
            Generation Settings
          </h3>

          {/* Batch Variations with Smart Limits */}
          <SmartLimitedSlider
            label="Number of Variations"
            value={batchVariations}
            onChange={setBatchVariations}
            feature="batchVariations"
          />

          {/* Course Modules with Smart Limits */}
          <SmartLimitedSelect
            label="Course Modules"
            value={courseModules}
            onChange={setCourseModules}
            feature="courseModules"
          />

          {/* Premium Features */}
          <div className="space-y-4">
            <h4 className="text-md font-medium text-slate-200">
              Premium Features
            </h4>

            <PremiumFeatureWrapper feature="advancedOptions">
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={useAdvancedOptions}
                  onChange={(e) => setUseAdvancedOptions(e.target.checked)}
                  className="w-4 h-4 text-sky-600 rounded"
                />
                <span className="text-slate-300">Use Advanced Options</span>
              </label>
            </PremiumFeatureWrapper>

            <PremiumFeatureWrapper feature="imageGeneration">
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={useImageGeneration}
                  onChange={(e) => setUseImageGeneration(e.target.checked)}
                  className="w-4 h-4 text-sky-600 rounded"
                />
                <span className="text-slate-300">Use Image Generation</span>
              </label>
            </PremiumFeatureWrapper>

            <PremiumFeatureWrapper feature="seoOptimization">
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={useSeoOptimization}
                  onChange={(e) => setUseSeoOptimization(e.target.checked)}
                  className="w-4 h-4 text-sky-600 rounded"
                />
                <span className="text-slate-300">Use SEO Optimization</span>
              </label>
            </PremiumFeatureWrapper>
          </div>

          <button
            onClick={handleValidateRequest}
            className="w-full bg-gradient-to-r from-sky-600 to-purple-600 hover:from-sky-500 hover:to-purple-500 text-white font-semibold py-3 px-6 rounded-lg transition-all"
          >
            Validate Request
          </button>
        </div>

        {/* Validation Results */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-white">
            Validation Results
          </h3>

          {validationResult ? (
            <div className="space-y-4">
              {/* Status */}
              <div
                className={`p-4 rounded-lg border ${
                  validationResult.isValid
                    ? "bg-green-500/20 border-green-500/50 text-green-300"
                    : "bg-red-500/20 border-red-500/50 text-red-300"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-xl">
                    {validationResult.isValid ? "✅" : "���"}
                  </span>
                  <span className="font-semibold">
                    {validationResult.isValid
                      ? "Request Valid"
                      : "Request Invalid"}
                  </span>
                </div>
              </div>

              {/* Errors */}
              {validationResult.errors.length > 0 && (
                <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4">
                  <h4 className="text-red-300 font-semibold mb-2">Errors:</h4>
                  <ul className="text-red-200 text-sm space-y-1">
                    {validationResult.errors.map(
                      (error: string, index: number) => (
                        <li key={`error-${error.substring(0, 20)}-${index}`} className="flex items-start gap-2">
                          <span className="text-red-400 mt-0.5">•</span>
                          {error}
                        </li>
                      ),
                    )}
                  </ul>
                </div>
              )}

              {/* Warnings */}
              {validationResult.warnings.length > 0 && (
                <div className="bg-amber-500/20 border border-amber-500/50 rounded-lg p-4">
                  <h4 className="text-amber-300 font-semibold mb-2">
                    Adjustments Made:
                  </h4>
                  <ul className="text-amber-200 text-sm space-y-1">
                    {validationResult.warnings.map(
                      (warning: string, index: number) => (
                        <li key={`warning-${warning.substring(0, 20)}-${index}`} className="flex items-start gap-2">
                          <span className="text-amber-400 mt-0.5">•</span>
                          {warning}
                        </li>
                      ),
                    )}
                  </ul>
                </div>
              )}

              {/* Plan Limitations */}
              {validationResult.planLimitations.length > 0 && (
                <div className="bg-sky-500/20 border border-sky-500/50 rounded-lg p-4">
                  <h4 className="text-sky-300 font-semibold mb-2">
                    Plan Limitations:
                  </h4>
                  <ul className="text-sky-200 text-sm space-y-1">
                    {validationResult.planLimitations.map(
                      (limitation: string, index: number) => (
                        <li key={`limitation-${limitation.substring(0, 20)}-${index}`} className="flex items-start gap-2">
                          <span className="text-sky-400 mt-0.5">•</span>
                          {limitation}
                        </li>
                      ),
                    )}
                  </ul>
                </div>
              )}

              {/* Enforced Request */}
              {validationResult.enforcedRequest && (
                <div className="bg-slate-700/50 border border-slate-600 rounded-lg p-4">
                  <h4 className="text-slate-300 font-semibold mb-2">
                    Enforced Request:
                  </h4>
                  <pre className="text-slate-300 text-xs font-mono bg-slate-800/50 p-3 rounded overflow-x-auto">
                    {JSON.stringify(validationResult.enforcedRequest, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          ) : (
            <div className="text-slate-400 text-center py-8">
              Click "Validate Request" to see how the system enforces limits
            </div>
          )}
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-8 bg-sky-500/10 border border-sky-500/30 rounded-lg p-4">
        <h4 className="text-sky-300 font-semibold mb-2">Try This:</h4>
        <ul className="text-sky-200 text-sm space-y-1">
          <li>
            • Try setting batch variations to a high number (if you're on free
            plan)
          </li>
          <li>• Try enabling premium features (if you're on free plan)</li>
          <li>
            • Notice how the system automatically enforces your plan limits
          </li>
          <li>
            • The UI prevents overrides while backend validation provides final
            safety
          </li>
        </ul>
      </div>
    </div>
  );
};

export default SmartLimitsDemo;
