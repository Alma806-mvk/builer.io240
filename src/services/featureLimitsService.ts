import { SubscriptionPlan, BillingInfo } from "../types/subscription";
import { getCurrentPlan } from "./stripeService";

// Feature limits configuration
export interface FeatureLimits {
  batchVariations: {
    min: number;
    max: number;
    default: number;
  };
  courseModules: {
    min: number;
    max: number;
    default: number;
    options: number[];
  };
  advancedOptions: boolean;
  customPersonas: boolean;
  batchGeneration: boolean;
  analytics: boolean;
  apiAccess: boolean;
  seoOptimization: boolean;
  imageGeneration: boolean;
  premiumStyles: boolean;
  premiumMoods: boolean;
}

// Plan-specific limits
export const PLAN_LIMITS: Record<string, FeatureLimits> = {
  free: {
    batchVariations: { min: 1, max: 2, default: 1 },
    courseModules: { min: 3, max: 5, default: 3, options: [3, 5] },
    advancedOptions: false,
    customPersonas: false,
    batchGeneration: false,
    analytics: false,
    apiAccess: false,
    seoOptimization: false,
    imageGeneration: false,
    premiumStyles: false,
    premiumMoods: false,
  },
  pro: {
    batchVariations: { min: 1, max: 4, default: 2 },
    courseModules: { min: 3, max: 10, default: 5, options: [3, 5, 7, 10] },
    advancedOptions: true,
    customPersonas: true,
    batchGeneration: true,
    analytics: true,
    apiAccess: false,
    seoOptimization: true,
    imageGeneration: true,
    premiumStyles: true,
    premiumMoods: true,
  },
  pro_yearly: {
    batchVariations: { min: 1, max: 4, default: 2 },
    courseModules: { min: 3, max: 10, default: 5, options: [3, 5, 7, 10] },
    advancedOptions: true,
    customPersonas: true,
    batchGeneration: false, // Note: yearly pro has slightly different limits
    analytics: true,
    apiAccess: false,
    seoOptimization: true,
    imageGeneration: true,
    premiumStyles: true,
    premiumMoods: true,
  },
  business: {
    batchVariations: { min: 1, max: 5, default: 3 },
    courseModules: { min: 3, max: 12, default: 7, options: [3, 5, 7, 10, 12] },
    advancedOptions: true,
    customPersonas: true,
    batchGeneration: true,
    analytics: true,
    apiAccess: true,
    seoOptimization: true,
    imageGeneration: true,
    premiumStyles: true,
    premiumMoods: true,
  },
  business_yearly: {
    batchVariations: { min: 1, max: 5, default: 3 },
    courseModules: { min: 3, max: 12, default: 7, options: [3, 5, 7, 10, 12] },
    advancedOptions: true,
    customPersonas: true,
    batchGeneration: true,
    analytics: true,
    apiAccess: true,
    seoOptimization: true,
    imageGeneration: true,
    premiumStyles: true,
    premiumMoods: true,
  },
  enterprise: {
    batchVariations: { min: 1, max: 10, default: 5 },
    courseModules: {
      min: 3,
      max: 20,
      default: 10,
      options: [3, 5, 7, 10, 12, 15, 20],
    },
    advancedOptions: true,
    customPersonas: true,
    batchGeneration: true,
    analytics: true,
    apiAccess: true,
    seoOptimization: true,
    imageGeneration: true,
    premiumStyles: true,
    premiumMoods: true,
  },
  enterprise_yearly: {
    batchVariations: { min: 1, max: 10, default: 5 },
    courseModules: {
      min: 3,
      max: 20,
      default: 10,
      options: [3, 5, 7, 10, 12, 15, 20],
    },
    advancedOptions: true,
    customPersonas: true,
    batchGeneration: true,
    analytics: true,
    apiAccess: true,
    seoOptimization: true,
    imageGeneration: true,
    premiumStyles: true,
    premiumMoods: true,
  },
};

export class FeatureLimitsService {
  private billingInfo: BillingInfo | null;

  constructor(billingInfo: BillingInfo | null) {
    this.billingInfo = billingInfo;
  }

  /**
   * Get the current plan limits
   */
  getCurrentLimits(): FeatureLimits {
    const planId = this.billingInfo?.subscription?.planId || "free";
    return PLAN_LIMITS[planId] || PLAN_LIMITS.free;
  }

  /**
   * Get the current plan info
   */
  getCurrentPlan(): SubscriptionPlan {
    return getCurrentPlan(this.billingInfo?.subscription?.planId);
  }

  /**
   * Check if a feature is allowed for the current plan
   */
  canUseFeature(feature: keyof FeatureLimits): boolean {
    const limits = this.getCurrentLimits();
    return !!limits[feature];
  }

  /**
   * Get enforced batch variations value
   */
  getEnforcedBatchVariations(requestedValue: number): number {
    const limits = this.getCurrentLimits();
    const { min, max, default: defaultValue } = limits.batchVariations;

    // If requested value is within allowed range, use it
    if (requestedValue >= min && requestedValue <= max) {
      return requestedValue;
    }

    // If requested value is too high, cap it to max
    if (requestedValue > max) {
      return max;
    }

    // If requested value is too low, use default
    return defaultValue;
  }

  /**
   * Get enforced course modules value
   */
  getEnforcedCourseModules(requestedValue: number): number {
    const limits = this.getCurrentLimits();
    const { min, max, default: defaultValue, options } = limits.courseModules;

    // If the requested value is in the allowed options, use it
    if (options.includes(requestedValue)) {
      return requestedValue;
    }

    // Find the closest allowed value
    const closest = options.reduce((prev, curr) => {
      return Math.abs(curr - requestedValue) < Math.abs(prev - requestedValue)
        ? curr
        : prev;
    });

    return closest;
  }

  /**
   * Get available course module options for the current plan
   */
  getAvailableCourseModuleOptions(): number[] {
    const limits = this.getCurrentLimits();
    return limits.courseModules.options;
  }

  /**
   * Check if advanced options should be shown
   */
  shouldShowAdvancedOptions(): boolean {
    return this.canUseFeature("advancedOptions");
  }

  /**
   * Get premium notification if user tries to use premium feature
   */
  getPremiumNotification(feature: string): string | null {
    if (!this.canUseFeature(feature as keyof FeatureLimits)) {
      const currentPlan = this.getCurrentPlan();
      return `${feature} is available in ${currentPlan.name === "Creator Free" ? "Creator Pro" : "higher"} plans. Upgrade to unlock this feature.`;
    }
    return null;
  }

  /**
   * Get upgrade suggestions based on requested features
   */
  getUpgradeSuggestion(requestedFeatures: string[]): {
    shouldUpgrade: boolean;
    recommendedPlan: string;
    missingFeatures: string[];
  } {
    const currentLimits = this.getCurrentLimits();
    const missingFeatures: string[] = [];

    for (const feature of requestedFeatures) {
      if (!currentLimits[feature as keyof FeatureLimits]) {
        missingFeatures.push(feature);
      }
    }

    if (missingFeatures.length === 0) {
      return {
        shouldUpgrade: false,
        recommendedPlan: this.getCurrentPlan().name,
        missingFeatures: [],
      };
    }

    // Determine recommended plan based on missing features
    let recommendedPlan = "Creator Pro";

    if (
      missingFeatures.includes("apiAccess") ||
      missingFeatures.includes("batchGeneration")
    ) {
      recommendedPlan = "Agency Pro";
    }

    return {
      shouldUpgrade: true,
      recommendedPlan,
      missingFeatures,
    };
  }

  /**
   * Validate and enforce input values
   */
  validateAndEnforceValue(
    feature: "batchVariations" | "courseModules",
    requestedValue: number,
  ): {
    enforcedValue: number;
    wasChanged: boolean;
    reason?: string;
  } {
    const limits = this.getCurrentLimits();

    if (feature === "batchVariations") {
      const enforcedValue = this.getEnforcedBatchVariations(requestedValue);
      const wasChanged = enforcedValue !== requestedValue;
      const { max } = limits.batchVariations;

      return {
        enforcedValue,
        wasChanged,
        reason: wasChanged
          ? `Maximum ${max} variations allowed for your plan`
          : undefined,
      };
    }

    if (feature === "courseModules") {
      const enforcedValue = this.getEnforcedCourseModules(requestedValue);
      const wasChanged = enforcedValue !== requestedValue;

      return {
        enforcedValue,
        wasChanged,
        reason: wasChanged
          ? `Value adjusted to nearest allowed option for your plan`
          : undefined,
      };
    }

    return { enforcedValue: requestedValue, wasChanged: false };
  }
}

// Hook to use feature limits
export const useFeatureLimits = (billingInfo: BillingInfo | null) => {
  return new FeatureLimitsService(billingInfo);
};
