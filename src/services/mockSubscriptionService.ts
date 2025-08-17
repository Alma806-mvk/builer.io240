import { UserSubscription, UsageStats } from "../types/subscription";
import { SUBSCRIPTION_PLANS } from "./stripeService";

const MOCK_SUBSCRIPTION_KEY = "mock_subscription";
const MOCK_USAGE_KEY = "mock_usage";

export const mockSubscriptionService = {
  // Get mock subscription for a user
  getSubscription: (userId: string): UserSubscription | null => {
    try {
      const stored = localStorage.getItem(`${MOCK_SUBSCRIPTION_KEY}_${userId}`);
      if (!stored) return null;

      const parsed = JSON.parse(stored);
      // Convert date strings back to Date objects
      if (parsed) {
        parsed.currentPeriodStart = new Date(parsed.currentPeriodStart);
        parsed.currentPeriodEnd = new Date(parsed.currentPeriodEnd);
        parsed.createdAt = new Date(parsed.createdAt);
        parsed.updatedAt = new Date(parsed.updatedAt);
      }
      return parsed;
    } catch (error) {
      console.error("Error parsing mock subscription:", error);
      return null;
    }
  },

  // Set mock subscription
  setSubscription: (userId: string, planId: string): UserSubscription => {
    const subscription: UserSubscription = {
      id: `mock_sub_${Date.now()}`,
      userId,
      planId,
      stripeCustomerId: `mock_cus_${userId}`,
      stripeSubscriptionId: `mock_sub_${userId}`,
      status: "active",
      currentPeriodStart: new Date(),
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    localStorage.setItem(
      `${MOCK_SUBSCRIPTION_KEY}_${userId}`,
      JSON.stringify(subscription),
    );
    return subscription;
  },

  // Get mock usage for current month
  getUsage: (userId: string): UsageStats => {
    const currentMonth = new Date().toISOString().slice(0, 7);
    try {
      const stored = localStorage.getItem(
        `${MOCK_USAGE_KEY}_${userId}_${currentMonth}`,
      );
      if (stored) {
        const parsed = JSON.parse(stored);
        parsed.lastUpdated = new Date(parsed.lastUpdated);
        return parsed;
      }
      return {
        userId,
        month: currentMonth,
        generations: 0,
        lastUpdated: new Date(),
      };
    } catch (error) {
      console.error("Error parsing mock usage:", error);
      return {
        userId,
        month: currentMonth,
        generations: 0,
        lastUpdated: new Date(),
      };
    }
  },

  // Increment usage
  incrementUsage: (userId: string): UsageStats => {
    const currentUsage = mockSubscriptionService.getUsage(userId);
    const newUsage = {
      ...currentUsage,
      generations: currentUsage.generations + 1,
      lastUpdated: new Date(),
    };

    const currentMonth = new Date().toISOString().slice(0, 7);
    localStorage.setItem(
      `${MOCK_USAGE_KEY}_${userId}_${currentMonth}`,
      JSON.stringify(newUsage),
    );
    return newUsage;
  },

  // Simulate upgrade
  simulateUpgrade: (userId: string, planId: string): void => {
    const plan = SUBSCRIPTION_PLANS.find((p) => p.id === planId);
    if (!plan) {
      throw new Error("Plan not found");
    }

    // Create mock subscription
    mockSubscriptionService.setSubscription(userId, planId);

    // Show success message
    console.log(`🎉 Mock Upgrade Successful! Upgraded to ${plan.name} plan.`, {
      planId,
      features: plan.features.slice(0, 3),
    });
  },

  // Reset subscription to free
  resetToFree: (userId: string): void => {
    localStorage.removeItem(`${MOCK_SUBSCRIPTION_KEY}_${userId}`);

    // Reset usage but keep some for testing
    const currentMonth = new Date().toISOString().slice(0, 7);
    const testUsage = {
      userId,
      month: currentMonth,
      generations: 5, // Add some usage for testing limits
      lastUpdated: new Date(),
    };
    localStorage.setItem(
      `${MOCK_USAGE_KEY}_${userId}_${currentMonth}`,
      JSON.stringify(testUsage),
    );

    console.log(
      "🔄 Reset to Free Plan - Subscription reset to free tier with 5 generations used for testing.",
    );
  },

  // Clear all mock data
  clearAllData: (userId: string): void => {
    Object.keys(localStorage).forEach((key) => {
      if (
        key.includes(userId) &&
        (key.includes(MOCK_SUBSCRIPTION_KEY) || key.includes(MOCK_USAGE_KEY))
      ) {
        localStorage.removeItem(key);
      }
    });
    alert(
      "🗑️ All mock subscription data cleared.\n\nReload the page to see changes.",
    );
  },

  // Test helper to quickly switch subscription tiers
  testTierSwitching: (userId: string): void => {
    console.log(`
🧪 TIERED MASTER PROMPT TESTING CONSOLE

To test different subscription tiers, run these commands:

// Test Free Tier (Professional Quality)
mockSubscriptionService.simulateUpgrade('${userId}', 'free');

// Test Creator Pro (Advanced Viral Techniques)
mockSubscriptionService.simulateUpgrade('${userId}', 'pro');

// Test Agency Pro (Enterprise Domination)
mockSubscriptionService.simulateUpgrade('${userId}', 'business');

After switching tiers, generate content to see different master prompts!
The console will show which tier prompt is being used.

Current tier: ${mockSubscriptionService.getSubscription(userId)?.planId || 'free'}
    `);
  },
};

// Add to window for easy console testing in development
if (typeof window !== 'undefined' && import.meta.env.DEV) {
  (window as any).testTierPrompts = (userId: string) => {
    mockSubscriptionService.testTierSwitching(userId);
  };
  (window as any).mockSubscriptionService = mockSubscriptionService;
}
