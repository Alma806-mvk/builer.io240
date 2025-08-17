import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { User, onAuthStateChanged } from "firebase/auth";
import {
  doc,
  getDoc,
  onSnapshot,
  collection,
  query,
  where,
  orderBy,
  limit,
} from "firebase/firestore";
import { auth, db } from "../config/firebase";
import {
  UserSubscription,
  UsageStats,
  BillingInfo,
  SubscriptionStatus,
} from "../types/subscription";
import { getCurrentPlan, SUBSCRIPTION_PLANS } from "../services/stripeService";
import { mockSubscriptionService } from "../services/mockSubscriptionService";

interface SubscriptionContextType {
  billingInfo: BillingInfo | null;
  loading: boolean;
  canUseFeature: (feature: string) => boolean;
  canGenerate: () => boolean;
  needsSignInForGenerations: () => boolean;
  incrementUsage: () => Promise<void>;
  refreshBilling: () => Promise<void>;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(
  undefined,
);

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error(
      "useSubscription must be used within a SubscriptionProvider",
    );
  }
  return context;
};

interface SubscriptionProviderProps {
  children: React.ReactNode;
}

export const SubscriptionProvider: React.FC<SubscriptionProviderProps> = ({
  children,
}) => {
  const [billingInfo, setBillingInfo] = useState<BillingInfo | null>(null);
  const [loading, setLoading] = useState(false); // Start with false to prevent infinite loading
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (!currentUser) {
        setBillingInfo(null);
        setLoading(false);
      }
    });

    // Failsafe: Always stop loading after 3 seconds
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 3000);

    return () => {
      unsubscribe();
      clearTimeout(timeout);
    };
  }, []);

  useEffect(() => {
    if (!user) return;

    loadBillingInfo().finally(() => {
      setLoading(false);
    });

    // Set up real-time subscription listener with error handling
    let unsubscribe: (() => void) | undefined;

    try {
      const subscriptionRef = doc(collection(db, "subscriptions"), user.uid);
      unsubscribe = onSnapshot(
        subscriptionRef,
        (doc) => {
          if (doc.exists()) {
            loadBillingInfo();
          }
        },
        (error) => {
          console.warn("Subscription listener error:", error);
          // Continue with cached/default data, don't break the app
        },
      );
    } catch (error) {
      console.warn("Failed to set up subscription listener:", error);
    }

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [user]);

  const loadBillingInfo = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);

      // Get current month for usage tracking
      const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM

      // Default fallback data for new users
      const defaultUsage: UsageStats = {
        userId: user.uid,
        month: currentMonth,
        generations: 0,
        lastUpdated: new Date(),
      };

      let subscription: UserSubscription | undefined;
      let usage: UsageStats = defaultUsage;

      // In development, prioritize mock data if it exists
      const isDevelopment = import.meta.env.DEV;
      const mockSubscription = mockSubscriptionService.getSubscription(
        user.uid,
      );

      console.log("🔧 Debug - Checking subscription data:", {
        isDevelopment,
        userId: user.uid,
        mockSubscription,
        localStorageKeys: Object.keys(localStorage).filter((k) =>
          k.includes(user.uid),
        ),
      });

      if (isDevelopment && mockSubscription) {
        console.log(
          "🔧 Development: Using mock subscription data",
          mockSubscription,
        );
        subscription = mockSubscription;
        usage = mockSubscriptionService.getUsage(user.uid);
      } else {
        try {
          // Load subscription data from Firestore
          const subscriptionRef = doc(
            collection(db, "subscriptions"),
            user.uid,
          );
          const subscriptionDoc = await getDoc(subscriptionRef);
          subscription = subscriptionDoc.exists()
            ? (subscriptionDoc.data() as UserSubscription)
            : undefined;

          // Load usage data
          const usageRef = doc(
            collection(db, "usage"),
            `${user.uid}_${currentMonth}`,
          );
          const usageDoc = await getDoc(usageRef);
          usage = usageDoc.exists()
            ? (usageDoc.data() as UsageStats)
            : defaultUsage;
        } catch (firestoreError) {
          console.warn(
            "Firestore access failed, using mock service:",
            firestoreError,
          );
          // Use mock service if Firestore is not accessible
          subscription = mockSubscriptionService.getSubscription(user.uid);
          usage = mockSubscriptionService.getUsage(user.uid);
        }
      }

      // Determine subscription status
      let status: SubscriptionStatus = "free";
      let daysLeft: number | undefined;

      if (subscription) {
        const now = new Date();
        const endDate = new Date(subscription.currentPeriodEnd);

        if (subscription.status === "active" && endDate > now) {
          status = "active";
          daysLeft = Math.ceil(
            (endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
          );
        } else if (subscription.status === "canceled") {
          status = "canceled";
        } else {
          status = "expired";
        }
      }

      const finalBillingInfo = {
        subscription,
        usage,
        status,
        daysLeft,
      };

      console.log("🔧 Final billing info set:", finalBillingInfo);
      setBillingInfo(finalBillingInfo);
    } catch (error) {
      console.error("Error loading billing info:", error);
      // Set default state even on error
      setBillingInfo({
        subscription: undefined,
        usage: defaultUsage,
        status: "free",
        daysLeft: undefined,
      });
    } finally {
      setLoading(false);
    }
  }, [user]);

  const canUseFeature = (feature: string): boolean => {
    // DEVELOPMENT OVERRIDE: Check if we should force-enable premium features
    const isDevelopment = import.meta.env.DEV;
    const devOverride =
      isDevelopment && (localStorage.getItem("dev_force_premium") === "true" ||
                       localStorage.getItem("emergency_premium") === "true");

    if (devOverride) {
      console.log(`🔧 DEV OVERRIDE: Force-enabling feature: ${feature}`);
      return true;
    }

    if (!billingInfo) {
      console.log(`🔧 canUseFeature(${feature}): No billing info available`);
      return false;
    }

    const plan = getCurrentPlan(billingInfo.subscription?.planId);
    const hasActiveSubscription = billingInfo.status === "active";

    if (import.meta.env.DEV) {
      console.log(`🔧 canUseFeature(${feature}):`, {
        planId: billingInfo.subscription?.planId,
        planName: plan.name,
        hasActiveSubscription,
        planLimits: plan.limits,
        subscriptionStatus: billingInfo.status,
        devOverride,
      });
    }

    switch (feature) {
      case "canvas":
        return true; // Canvas is free for all users
      case "analytics":
        return hasActiveSubscription && plan.limits.analytics;
      case "customPersonas":
        return hasActiveSubscription && plan.limits.customPersonas;
      case "batchGeneration":
        return hasActiveSubscription && plan.limits.batchGeneration;
      case "apiAccess":
        return hasActiveSubscription && plan.limits.apiAccess;
      case "premium":
        return hasActiveSubscription;
      case "templates":
        return hasActiveSubscription;
      case "seoOptimization":
        return hasActiveSubscription;
      case "performanceAnalytics":
        return hasActiveSubscription;
      case "aiBoost":
        return hasActiveSubscription;
      case "premiumTemplates":
        return hasActiveSubscription;
      case "advancedPersonas":
        return hasActiveSubscription;
      default:
        return true;
    }
  };

  const canGenerate = (): boolean => {
    if (!billingInfo) return false;

    const plan = getCurrentPlan(billingInfo.subscription?.planId);

    // Unlimited generations for business plan
    if (plan.limits.generations === -1) return true;

    // Check if under limit
    return billingInfo.usage.generations < plan.limits.generations;
  };

  const needsSignInForGenerations = (): boolean => {
    // Return true if user is not authenticated (no billing info means no user)
    return !user || !billingInfo;
  };

  const incrementUsage = async (): Promise<void> => {
    if (!user || !billingInfo) return;

    try {
      const currentMonth = new Date().toISOString().slice(0, 7);
      const usageRef = doc(
        collection(db, "usage"),
        `${user.uid}_${currentMonth}`,
      );

      // Try to increment in Firestore first
      const newUsage = {
        ...billingInfo.usage,
        generations: billingInfo.usage.generations + 1,
        lastUpdated: new Date(),
      };

      setBillingInfo((prev) => (prev ? { ...prev, usage: newUsage } : null));

      // Update in Firestore (you'd typically do this via a callable function)
      // await setDoc(usageRef, newUsage);
    } catch (firestoreError) {
      console.warn(
        "Firestore update failed, using mock service:",
        firestoreError,
      );

      // Use mock service as fallback
      const newUsage = mockSubscriptionService.incrementUsage(user.uid);
      setBillingInfo((prev) => (prev ? { ...prev, usage: newUsage } : null));
    }
  };

  const refreshBilling = async (): Promise<void> => {
    console.log("🔄 Refreshing billing info...");

    // Force reload in development mode
    if (import.meta.env.DEV && user) {
      console.log(
        "🔧 Dev mode: Force reloading subscription data for",
        user.uid,
      );
      const mockSub = mockSubscriptionService.getSubscription(user.uid);
      console.log("🔧 Current mock subscription:", mockSub);
    }

    await loadBillingInfo();

    // Force a second reload after a brief delay to ensure state updates
    setTimeout(async () => {
      console.log("🔄 Secondary billing refresh...");
      await loadBillingInfo();
    }, 100);
  };

  const value: SubscriptionContextType = {
    billingInfo,
    loading,
    canUseFeature,
    canGenerate,
    needsSignInForGenerations,
    incrementUsage,
    refreshBilling,
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
};
