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
  setDoc,
  updateDoc,
  collection,
  addDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { auth, db } from "../config/firebase";
import { UserCredits, CreditTransaction, CREDIT_COSTS } from "../types/credits";
import { useSubscription } from "./SubscriptionContext";
import AppNotifications from "../utils/appNotifications";
import {
  shouldAttemptFirestoreOperation,
  withFirestorePermissionCheck,
} from "../utils/firestorePermissions";
import {
  logFirebaseError,
  handleFirebasePermissionError,
} from "../utils/firebaseErrorSuppression";

interface CreditContextType {
  credits: UserCredits | null;
  transactions: CreditTransaction[];
  loading: boolean;
  hasCredits: (feature: string) => boolean;
  canAfford: (feature: string, quantity?: number) => boolean;
  deductCredits: (
    feature: string,
    quantity?: number,
    description?: string,
  ) => Promise<boolean>;
  addCredits: (
    amount: number,
    type: CreditTransaction["type"],
    description: string,
    relatedId?: string,
  ) => Promise<void>;
  refreshCredits: () => Promise<void>;
}

const CreditContext = createContext<CreditContextType | undefined>(undefined);

export const useCredits = () => {
  const context = useContext(CreditContext);
  if (context === undefined) {
    throw new Error("useCredits must be used within a CreditProvider");
  }
  return context;
};

interface CreditProviderProps {
  children: React.ReactNode;
}

export const CreditProvider: React.FC<CreditProviderProps> = ({ children }) => {
  const [credits, setCredits] = useState<UserCredits | null>(null);
  const [transactions, setTransactions] = useState<CreditTransaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [firestoreAccessible, setFirestoreAccessible] = useState(true);
  const { billingInfo } = useSubscription();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (!currentUser) {
        setCredits(null);
        setTransactions([]);
        setLoading(false);
        setFirestoreAccessible(true); // Reset for next user
        localStorage.removeItem("firestore-permission-notified"); // Reset notification flag
      }
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!user) return;

    // For development, allow operations without email verification
    // In production, you may want to keep the email verification check
    if (!user.emailVerified) {
      console.log("ℹ️ Loading credits for unverified user (development mode)");
    }

    // Initialize with fallback credits immediately for verified users
    const fallbackCredits = {
      userId: user.uid,
      totalCredits: 25,
      subscriptionCredits: 25,
      purchasedCredits: 0,
      bonusCredits: 0,
      lastUpdated: new Date(),
    };

    setCredits(fallbackCredits);
    console.log(
      "🔄 Initialized with fallback credits for verified user:",
      user.uid,
    );

    // Wait a bit for Firebase Auth to fully settle before accessing Firestore
    const timeoutId = setTimeout(() => {
      if (user.uid && user.emailVerified) {
        attemptLoad();
      } else {
        console.info("ℹ️ User not yet verified, skipping credit loading");
        setLoading(false);
      }
    }, 1000);

    // Try to load from Firestore with retry logic
    const attemptLoad = async (retries = 2) => {
      try {
        await loadCredits();
        // Only set up listeners if load succeeds and we haven't detected permission issues
        if (firestoreAccessible) {
          setupFirestoreListeners();
        }
      } catch (error) {
        console.warn(
          `Credit load attempt failed (${3 - retries} retries left):`,
          error,
        );
        if (retries > 0) {
          setTimeout(() => attemptLoad(retries - 1), 2000);
        } else {
          console.warn(
            "All credit load attempts failed. Using fallback credits.",
          );
          setFirestoreAccessible(false);
        }
      }
    };

    return () => clearTimeout(timeoutId);
  }, [user?.uid]);

  const setupFirestoreListeners = () => {
    if (
      !shouldAttemptFirestoreOperation() ||
      !firestoreAccessible ||
      !user?.emailVerified
    ) {
      console.info(
        "ℹ️ Skipping Firestore listeners - waiting for user verification or permissions",
      );
      return;
    }

    console.log("🔄 Setting up Firestore listeners for user:", user.uid);

    const creditsRef = doc(db, "user_credits", user.uid);
    const unsubscribeCredits = onSnapshot(
      creditsRef,
      (doc) => {
        if (doc.exists()) {
          const data = doc.data();
          setCredits({
            ...data,
            lastUpdated: data.lastUpdated?.toDate(),
            lastReset: data.lastReset?.toDate(),
          } as UserCredits);
        }
      },
      (error) => {
        logFirebaseError(error, "Credits listener");
        handleFirestoreError(error);
      },
    );

    // Double-check user is still authenticated before setting up transactions listener
    if (!user || !user.uid) {
      console.warn("⚠️ User authentication lost during listener setup");
      return;
    }

    const transactionsQuery = query(
      collection(db, "credit_transactions"),
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc"),
      limit(50),
    );

    const unsubscribeTransactions = onSnapshot(
      transactionsQuery,
      (snapshot) => {
        const transactionData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate(),
        })) as CreditTransaction[];
        setTransactions(transactionData);
      },
      (error) => {
        logFirebaseError(error, "Transactions listener");
        handleFirestoreError(error);
      },
    );

    return () => {
      unsubscribeCredits();
      unsubscribeTransactions();
    };
  };

  const handleFirestoreError = (error: any) => {
    // Reduce console noise for common permission errors during onboarding
    if (
      error.code === "permission-denied" ||
      error.code === "insufficient-permissions" ||
      error.message?.includes("Missing or insufficient permissions")
    ) {
      setFirestoreAccessible(false);
      console.info(
        "ℹ️ Firestore permission denied. Credit system running in offline mode.",
      );
      setTransactions([]);

      // Only show notification for authenticated, verified users after a delay
      if (
        user &&
        user.emailVerified &&
        !localStorage.getItem("firestore-permission-notified")
      ) {
        // Add delay to avoid showing during initial authentication
        setTimeout(() => {
          localStorage.setItem("firestore-permission-notified", "true");
          AppNotifications.custom(
            "Credits in Offline Mode",
            "Database permissions need updating. Credits will work locally for now.",
            "info",
            {
              icon: "ℹ️",
              duration: 6000,
              actionText: "Got it",
              onAction: () => {},
            },
          );
        }, 3000);
      }
    } else if (
      error.message?.includes("Failed to fetch") ||
      error.message?.includes("NetworkError") ||
      error.code === "unavailable"
    ) {
      // Network connectivity issues - handle silently
      console.info("ℹ️ Network connectivity issue with Firestore");
      setFirestoreAccessible(false);
    } else {
      // Other Firestore errors - log but don't spam console
      console.info("ℹ️ Firestore unavailable:", error.code || error.message);
      setFirestoreAccessible(false);
    }
  };

  const initializeCredits = async (userId: string): Promise<UserCredits> => {
    const initialCredits: UserCredits = {
      userId,
      totalCredits: 25,
      subscriptionCredits: 25,
      purchasedCredits: 0,
      bonusCredits: 0,
      lastUpdated: new Date(),
    };

    if (firestoreAccessible) {
      try {
        await setDoc(doc(db, "user_credits", userId), {
          ...initialCredits,
          lastUpdated: serverTimestamp(),
        });

        await addDoc(collection(db, "credit_transactions"), {
          userId,
          type: "bonus",
          amount: 25,
          description: "Welcome bonus - 25 free credits",
          createdAt: serverTimestamp(),
        });
      } catch (error: any) {
        console.warn(
          "📵 Could not initialize credits in Firestore:",
          error.code,
        );
        // Don't throw error here - user can still use the app with default credits
        if (error.code !== "permission-denied") {
          handleFirestoreError(error);
        }
      }
    }

    return initialCredits;
  };

  const loadCredits = async () => {
    if (
      !shouldAttemptFirestoreOperation() ||
      !firestoreAccessible ||
      !user?.emailVerified
    ) {
      console.info(
        "ℹ️ Skipping credit loading - waiting for user verification or permissions",
      );
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const creditsRef = doc(db, "user_credits", user.uid);
      const creditsDoc = await getDoc(creditsRef);

      if (creditsDoc.exists()) {
        const data = creditsDoc.data();
        const userCredits = {
          ...data,
          lastUpdated: data.lastUpdated?.toDate(),
          lastReset: data.lastReset?.toDate(),
        } as UserCredits;

        await checkAndResetSubscriptionCredits(userCredits);
        setCredits(userCredits);
      } else {
        const newCredits = await initializeCredits(user.uid);
        setCredits(newCredits);
      }
    } catch (error: any) {
      // Handle specific permission errors gracefully
      if (error.code === "permission-denied" ||
          error.code === "insufficient-permissions" ||
          error.message?.includes("Missing or insufficient permissions")) {
        console.info("ℹ️ Credits: Firestore permission denied - using default credits");
        console.warn(
          "📵 Firestore permissions not configured - using default credits",
        );

        // Only show notification in development
        if (import.meta.env.DEV) {
          console.log("🔧 Dev Note: Deploy Firestore rules with 'firebase deploy --only firestore:rules' to fix permissions");
        }

        // Set default credits for users without Firestore access
        setCredits({
          uid: user.uid,
          totalCredits: 25, // Default free credits
          usedCredits: 0,
          subscriptionCredits: 0,
          freeCredits: 25,
          lastUpdated: new Date(),
          lastReset: new Date(),
        });
      } else if (error.code === "unavailable") {
        console.warn(
          "🔄 Firestore temporarily unavailable - retrying in 3 seconds",
        );
        // Retry after a delay for network issues
        setTimeout(() => {
          if (user) {
            loadCredits(user);
          }
        }, 3000);
        return;
      } else {
        handleFirestoreError(error);
      }
    } finally {
      setLoading(false);
    }
  };

  const checkAndResetSubscriptionCredits = async (userCredits: UserCredits) => {
    if (!billingInfo?.subscription || !firestoreAccessible) return;

    const now = new Date();
    const lastReset = userCredits.lastReset || new Date(0);
    const subscriptionStart = billingInfo.subscription.currentPeriodStart;

    if (subscriptionStart > lastReset) {
      const plan = billingInfo.subscription.planId;
      let newSubscriptionCredits = 0;

      switch (plan) {
        case "free":
          newSubscriptionCredits = 25;
          break;
        case "pro":
        case "pro_yearly":
          newSubscriptionCredits = 1000;
          break;
        case "business":
        case "business_yearly":
          newSubscriptionCredits = 5000;
          break;
        case "enterprise":
          newSubscriptionCredits = -1;
          break;
        default:
          newSubscriptionCredits = 25;
      }

      if (newSubscriptionCredits > 0) {
        const updatedCredits = {
          ...userCredits,
          subscriptionCredits: newSubscriptionCredits,
          totalCredits:
            userCredits.purchasedCredits +
            userCredits.bonusCredits +
            newSubscriptionCredits,
          lastReset: now,
          lastUpdated: now,
        };

        try {
          await updateDoc(doc(db, "user_credits", user!.uid), {
            subscriptionCredits: newSubscriptionCredits,
            totalCredits: updatedCredits.totalCredits,
            lastReset: serverTimestamp(),
            lastUpdated: serverTimestamp(),
          });

          await addDoc(collection(db, "credit_transactions"), {
            userId: user!.uid,
            type: "subscription_renewal",
            amount: newSubscriptionCredits,
            description: `Monthly credit renewal - ${plan} plan`,
            createdAt: serverTimestamp(),
            relatedId: billingInfo.subscription.stripeSubscriptionId,
          });
        } catch (error) {
          handleFirestoreError(error);
        }

        setCredits(updatedCredits);
      }
    }
  };

  const hasCredits = (feature: string): boolean => {
    if (!credits) return false;

    if (billingInfo?.subscription?.planId === "enterprise") return true;

    const cost = CREDIT_COSTS[feature] || 1;
    return credits.totalCredits >= cost;
  };

  const canAfford = (feature: string, quantity: number = 1): boolean => {
    if (!credits) return false;

    if (billingInfo?.subscription?.planId === "enterprise") return true;

    const cost = (CREDIT_COSTS[feature] || 1) * quantity;
    return credits.totalCredits >= cost;
  };

  const deductCredits = async (
    feature: string,
    quantity: number = 1,
    description?: string,
  ): Promise<boolean> => {
    if (!user || !credits) return false;

    if (billingInfo?.subscription?.planId === "enterprise") return true;

    const cost = (CREDIT_COSTS[feature] || 1) * quantity;

    if (credits.totalCredits < cost) {
      return false;
    }

    const newTotal = credits.totalCredits - cost;

    let remainingToDeduct = cost;
    let newSubscriptionCredits = credits.subscriptionCredits;
    let newBonusCredits = credits.bonusCredits;
    let newPurchasedCredits = credits.purchasedCredits;

    if (remainingToDeduct > 0 && newSubscriptionCredits > 0) {
      const deductFromSubscription = Math.min(
        remainingToDeduct,
        newSubscriptionCredits,
      );
      newSubscriptionCredits -= deductFromSubscription;
      remainingToDeduct -= deductFromSubscription;
    }

    if (remainingToDeduct > 0 && newBonusCredits > 0) {
      const deductFromBonus = Math.min(remainingToDeduct, newBonusCredits);
      newBonusCredits -= deductFromBonus;
      remainingToDeduct -= deductFromBonus;
    }

    if (remainingToDeduct > 0 && newPurchasedCredits > 0) {
      const deductFromPurchased = Math.min(
        remainingToDeduct,
        newPurchasedCredits,
      );
      newPurchasedCredits -= deductFromPurchased;
      remainingToDeduct -= deductFromPurchased;
    }

    const updatedCredits = {
      ...credits,
      totalCredits: newTotal,
      subscriptionCredits: newSubscriptionCredits,
      bonusCredits: newBonusCredits,
      purchasedCredits: newPurchasedCredits,
      lastUpdated: new Date(),
    };

    // Update local state immediately
    setCredits(updatedCredits);

    // Try to sync with Firestore if accessible
    if (firestoreAccessible) {
      try {
        await updateDoc(doc(db, "user_credits", user.uid), {
          totalCredits: newTotal,
          subscriptionCredits: newSubscriptionCredits,
          bonusCredits: newBonusCredits,
          purchasedCredits: newPurchasedCredits,
          lastUpdated: serverTimestamp(),
        });

        await addDoc(collection(db, "credit_transactions"), {
          userId: user.uid,
          type: "usage",
          amount: -cost,
          description: description || `Used ${cost} credits for ${feature}`,
          createdAt: serverTimestamp(),
        });
      } catch (error) {
        console.error("Error syncing credit deduction:", error);
        handleFirestoreError(error);
      }
    } else {
      console.warn(
        "🔒 Credit deduction in offline mode (Firestore not accessible)",
      );
    }

    return true;
  };

  const addCredits = async (
    amount: number,
    type: CreditTransaction["type"],
    description: string,
    relatedId?: string,
  ): Promise<void> => {
    if (!user || !credits) return;

    let updatedCredits = { ...credits };

    if (type === "purchase") {
      updatedCredits.purchasedCredits += amount;
    } else if (type === "bonus") {
      updatedCredits.bonusCredits += amount;
    } else if (type === "subscription_renewal") {
      updatedCredits.subscriptionCredits = amount;
    }

    updatedCredits.totalCredits =
      updatedCredits.subscriptionCredits +
      updatedCredits.bonusCredits +
      updatedCredits.purchasedCredits;
    updatedCredits.lastUpdated = new Date();

    setCredits(updatedCredits);

    if (firestoreAccessible) {
      try {
        await updateDoc(doc(db, "user_credits", user.uid), {
          totalCredits: updatedCredits.totalCredits,
          subscriptionCredits: updatedCredits.subscriptionCredits,
          bonusCredits: updatedCredits.bonusCredits,
          purchasedCredits: updatedCredits.purchasedCredits,
          lastUpdated: serverTimestamp(),
        });

        await addDoc(collection(db, "credit_transactions"), {
          userId: user.uid,
          type,
          amount,
          description,
          createdAt: serverTimestamp(),
          relatedId,
        });
      } catch (error) {
        console.error("Error adding credits:", error);
        handleFirestoreError(error);
      }
    }
  };

  const refreshCredits = async (): Promise<void> => {
    await loadCredits();
  };

  const value: CreditContextType = {
    credits,
    transactions,
    loading,
    hasCredits,
    canAfford,
    deductCredits,
    addCredits,
    refreshCredits,
  };

  return (
    <CreditContext.Provider value={value}>{children}</CreditContext.Provider>
  );
};
