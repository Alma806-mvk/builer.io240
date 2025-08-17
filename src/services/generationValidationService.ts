import { BillingInfo } from "../types/subscription";
import { FeatureLimitsService } from "./featureLimitsService";

export interface GenerationRequest {
  userId: string;
  contentType: string;
  batchVariations?: number;
  courseModules?: number;
  useAdvancedOptions?: boolean;
  useImageGeneration?: boolean;
  useSeoOptimization?: boolean;
  useCustomPersonas?: boolean;
}

export interface ValidationResult {
  isValid: boolean;
  enforcedRequest?: GenerationRequest;
  errors: string[];
  warnings: string[];
  planLimitations: string[];
}

export class GenerationValidationService {
  private featureLimits: FeatureLimitsService;

  constructor(billingInfo: BillingInfo | null) {
    this.featureLimits = new FeatureLimitsService(billingInfo);
  }

  /**
   * Validate a generation request and enforce limits
   */
  validateGenerationRequest(request: GenerationRequest): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    const planLimitations: string[] = [];
    const enforcedRequest = { ...request };

    const currentPlan = this.featureLimits.getCurrentPlan();
    const limits = this.featureLimits.getCurrentLimits();

    // Validate batch variations
    if (request.batchVariations !== undefined) {
      const result = this.featureLimits.validateAndEnforceValue(
        "batchVariations",
        request.batchVariations,
      );

      if (result.wasChanged) {
        enforcedRequest.batchVariations = result.enforcedValue;
        warnings.push(
          `Batch variations reduced from ${request.batchVariations} to ${result.enforcedValue} (plan limit: ${limits.batchVariations.max})`,
        );
        planLimitations.push(
          `Maximum ${limits.batchVariations.max} variations per generation`,
        );
      }
    }

    // Validate course modules
    if (request.courseModules !== undefined) {
      const result = this.featureLimits.validateAndEnforceValue(
        "courseModules",
        request.courseModules,
      );

      if (result.wasChanged) {
        enforcedRequest.courseModules = result.enforcedValue;
        warnings.push(
          `Course modules adjusted from ${request.courseModules} to ${result.enforcedValue} (closest available option)`,
        );
        planLimitations.push(
          `Limited course module options for ${currentPlan.name} plan`,
        );
      }
    }

    // Validate advanced options
    if (
      request.useAdvancedOptions &&
      !this.featureLimits.canUseFeature("advancedOptions")
    ) {
      enforcedRequest.useAdvancedOptions = false;
      errors.push("Advanced options are not available for your plan");
      planLimitations.push("Advanced options require Creator Pro or higher");
    }

    // Validate image generation
    if (
      request.useImageGeneration &&
      !this.featureLimits.canUseFeature("imageGeneration")
    ) {
      enforcedRequest.useImageGeneration = false;
      errors.push("Image generation is not available for your plan");
      planLimitations.push("Image generation requires Creator Pro or higher");
    }

    // Validate SEO optimization
    if (
      request.useSeoOptimization &&
      !this.featureLimits.canUseFeature("seoOptimization")
    ) {
      enforcedRequest.useSeoOptimization = false;
      errors.push("SEO optimization is not available for your plan");
      planLimitations.push("SEO optimization requires Creator Pro or higher");
    }

    // Validate custom personas
    if (
      request.useCustomPersonas &&
      !this.featureLimits.canUseFeature("customPersonas")
    ) {
      enforcedRequest.useCustomPersonas = false;
      errors.push("Custom AI personas are not available for your plan");
      planLimitations.push("Custom AI personas require Creator Pro or higher");
    }

    const isValid = errors.length === 0;

    return {
      isValid,
      enforcedRequest: isValid ? undefined : enforcedRequest,
      errors,
      warnings,
      planLimitations,
    };
  }

  /**
   * Get upgrade suggestions based on rejected features
   */
  getUpgradeSuggestions(rejectedFeatures: string[]): {
    recommendedPlan: string;
    benefits: string[];
    price: number;
  } {
    const currentPlan = this.featureLimits.getCurrentPlan();

    if (currentPlan.name === "Creator Free") {
      return {
        recommendedPlan: "Creator Pro",
        benefits: [
          "1,000 AI generations per month (vs 25)",
          "Advanced options & custom AI personas",
          "Image generation capabilities",
          "SEO optimization features",
          "Batch generation up to 4 variations",
          "Content analytics & insights",
        ],
        price: 29,
      };
    }

    if (currentPlan.name === "Creator Pro") {
      return {
        recommendedPlan: "Agency Pro",
        benefits: [
          "5,000 AI generations per month (vs 1,000)",
          "Batch generation up to 5 variations",
          "API access for integrations",
          "Team collaboration features",
          "Advanced analytics & reporting",
        ],
        price: 79,
      };
    }

    return {
      recommendedPlan: currentPlan.name,
      benefits: ["You have access to all features"],
      price: currentPlan.price,
    };
  }

  /**
   * Check if user can perform any generation
   */
  canUserGenerate(): {
    canGenerate: boolean;
    reason?: string;
    creditsRemaining?: number;
    planLimit?: number;
  } {
    const currentPlan = this.featureLimits.getCurrentPlan();

    // For now, we assume generation limits are handled by credit system
    // This method can be extended to check additional generation-specific limits

    return {
      canGenerate: true,
      planLimit: currentPlan.limits.generations,
    };
  }

  /**
   * Generate user-friendly error messages
   */
  formatValidationErrors(result: ValidationResult): {
    title: string;
    message: string;
    actionText?: string;
    actionUrl?: string;
  } {
    if (result.isValid) {
      return {
        title: "Request Valid",
        message: "Your generation request is valid and ready to process.",
      };
    }

    const currentPlan = this.featureLimits.getCurrentPlan();

    if (result.errors.length > 0) {
      return {
        title: "Premium Features Required",
        message: `Your request includes features not available in the ${currentPlan.name} plan: ${result.errors.join(", ")}`,
        actionText: "Upgrade Plan",
        actionUrl: "/billing",
      };
    }

    if (result.warnings.length > 0) {
      return {
        title: "Request Adjusted",
        message: `Your request has been adjusted to fit your plan limits: ${result.warnings.join(", ")}`,
        actionText: "Upgrade for More",
        actionUrl: "/billing",
      };
    }

    return {
      title: "Unknown Validation Issue",
      message: "There was an issue validating your request.",
    };
  }
}

/**
 * Utility function to create validation service instance
 */
export const createValidationService = (billingInfo: BillingInfo | null) => {
  return new GenerationValidationService(billingInfo);
};

/**
 * Hook to use generation validation
 */
export const useGenerationValidation = (billingInfo: BillingInfo | null) => {
  return new GenerationValidationService(billingInfo);
};
