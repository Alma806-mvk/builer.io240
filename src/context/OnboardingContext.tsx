import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { doc, getDoc, updateDoc, setDoc } from "firebase/firestore";
import { db } from "../config/firebase";

interface OnboardingProgress {
  welcomeCompleted: boolean;
  tourCompleted: boolean;
  firstGenerationCompleted: boolean;
  profileSetupCompleted: boolean;
  premiumIntroShown: boolean;
}

interface OnboardingData {
  role?: string;
  goals?: string[];
  completedAt?: Date;
  progress?: OnboardingProgress;
}

interface OnboardingContextType {
  // State
  needsOnboarding: boolean;
  showWelcome: boolean;
  showTour: boolean;
  onboardingData: OnboardingData | null;
  progress: OnboardingProgress;
  loading: boolean;

  // Actions
  completeWelcome: () => Promise<void>;
  completeTour: () => Promise<void>;
  completeFirstGeneration: () => Promise<void>;
  completeProfileSetup: () => Promise<void>;
  markPremiumIntroShown: () => Promise<void>;
  skipOnboarding: () => Promise<void>;
  resetOnboarding: () => Promise<void>;
  updateOnboardingData: (data: Partial<OnboardingData>) => Promise<void>;
  startAnonymousOnboarding: () => void;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(
  undefined,
);

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error("useOnboarding must be used within an OnboardingProvider");
  }
  return context;
};

interface OnboardingProviderProps {
  children: React.ReactNode;
}

export const OnboardingProvider: React.FC<OnboardingProviderProps> = ({
  children,
}) => {
  const { user } = useAuth();
  const [needsOnboarding, setNeedsOnboarding] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [showTour, setShowTour] = useState(false);
  const [onboardingData, setOnboardingData] = useState<OnboardingData | null>(
    null,
  );
  const [loading, setLoading] = useState(false); // Start false for instant premium experience
  const [anonymousOnboardingStarted, setAnonymousOnboardingStarted] =
    useState(false);

  // Check if anonymous user has already seen onboarding
  const hasSeenAnonymousOnboarding = () => {
    return localStorage.getItem("anonymousOnboardingCompleted") === "true";
  };

  // Mark anonymous onboarding as completed in localStorage
  const markAnonymousOnboardingCompleted = () => {
    localStorage.setItem("anonymousOnboardingCompleted", "true");
  };

  const defaultProgress: OnboardingProgress = {
    welcomeCompleted: false,
    tourCompleted: false,
    firstGenerationCompleted: false,
    profileSetupCompleted: false,
    premiumIntroShown: false,
  };

  const [progress, setProgress] = useState<OnboardingProgress>(defaultProgress);

  useEffect(() => {
    if (user) {
      loadOnboardingState();
    } else {
      // For anonymous users, don't automatically start onboarding
      // It will be triggered manually when they access the app directly
      if (!anonymousOnboardingStarted) {
        setNeedsOnboarding(false);
        setShowWelcome(false);
        setShowTour(false);
      }
    }
  }, [user, anonymousOnboardingStarted]);

  const loadOnboardingState = async () => {
    if (!user) return;

    try {
      // Removed setLoading(true) for instant experience

      // Only attempt Firestore operations for verified users
      if (!user.emailVerified) {
        console.log(
          "⏳ Waiting for email verification before loading onboarding state",
        );
        setLoading(false);
        return;
      }

      const userRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userRef);
      const userData = userDoc.data();

      if (userData) {
        const onboardingCompleted = userData.onboardingCompleted || false;
        const isNewUser = userData.isNewUser === true; // Only true if explicitly set
        const storedOnboardingData = userData.onboardingData || {};
        const storedProgress = userData.onboardingProgress || defaultProgress;

        setOnboardingData(storedOnboardingData);
        setProgress(storedProgress);

        // Determine if user needs onboarding - only for true new signups (not existing users signing in)
        const shouldShowOnboarding =
          isNewUser === true && !onboardingCompleted && user.emailVerified;
        setNeedsOnboarding(shouldShowOnboarding);

        // If this is an existing user signing in, make sure they don't see onboarding
        if (isNewUser === false && user.emailVerified) {
          console.log("📝 Existing user signing in - no onboarding needed");
          setNeedsOnboarding(false);
          setShowWelcome(false);
          setShowTour(false);
        }

        console.log("📊 Onboarding Decision:", {
          isNewUser,
          onboardingCompleted,
          emailVerified: user.emailVerified,
          shouldShowOnboarding,
        });

        if (shouldShowOnboarding) {
          // If they haven't completed welcome, show welcome
          if (!storedProgress.welcomeCompleted) {
            setShowWelcome(true);
          }
          // If welcome is done but tour isn't, show tour
          else if (!storedProgress.tourCompleted) {
            setShowTour(true);
          }
        }
      } else {
        // New user with no Firestore data - assume they are truly new
        console.log(
          "🆕 New user detected (no Firestore data) - showing onboarding",
        );
        setNeedsOnboarding(true);
        setShowWelcome(true);
      }
    } catch (error: any) {
      console.error("Error loading onboarding state:", error);

      // Handle Firestore permission errors gracefully
      if (
        error.code === "permission-denied" ||
        error.code === "insufficient-permissions"
      ) {
        console.warn(
          "🔒 Firestore permissions not available during onboarding. Using defaults.",
        );
        // For new users without Firestore access, show onboarding
        setNeedsOnboarding(true);
        setShowWelcome(true);
      } else {
        // For other errors, also assume new user needs onboarding
        setNeedsOnboarding(true);
        setShowWelcome(true);
      }
    } finally {
      // Loading state remains false for smooth experience
    }
  };

  const updateFirestore = async (updates: any) => {
    if (!user || !user.emailVerified) return;

    try {
      const userRef = doc(db, "users", user.uid);

      // Use setDoc with merge: true to create document if it doesn't exist
      await setDoc(userRef, updates, { merge: true });
    } catch (error: any) {
      // Silently handle permission errors during onboarding
      if (
        error.code === "permission-denied" ||
        error.code === "insufficient-permissions"
      ) {
        console.warn(
          "🔒 Skipping Firestore update due to permissions. Onboarding will continue locally.",
        );
      } else {
        console.error("Error updating onboarding data:", error);
      }
      // Don't throw - we want onboarding to work even if Firestore fails
    }
  };

  const completeWelcome = async () => {
    const newProgress = { ...progress, welcomeCompleted: true };
    setProgress(newProgress);
    setShowWelcome(false);

    // Check if we're in the main app before starting tour
    const isInMainApp = document.querySelector(
      '[data-tour="main-navigation"], nav, .main-tab-navigation',
    );
    if (isInMainApp) {
      setShowTour(true);
      console.log("🎯 Onboarding: Starting tour in main app");
    } else {
      console.warn("⚠️ Onboarding: Not in main app, delaying tour");
      // Wait for user to navigate to main app
      const checkInterval = setInterval(() => {
        const mainAppCheck = document.querySelector(
          '[data-tour="main-navigation"], nav, .main-tab-navigation',
        );
        if (mainAppCheck) {
          console.log("🎯 Onboarding: Main app detected, starting tour");
          setShowTour(true);
          clearInterval(checkInterval);
        }
      }, 1000);

      // Clear interval after 30 seconds to prevent infinite checking
      setTimeout(() => clearInterval(checkInterval), 30000);
    }

    await updateFirestore({
      onboardingProgress: newProgress,
    });
  };

  const completeTour = async () => {
    const newProgress = { ...progress, tourCompleted: true };
    setProgress(newProgress);
    setShowTour(false);
    setNeedsOnboarding(false);

    // For anonymous users, mark completion in localStorage
    if (!user) {
      markAnonymousOnboardingCompleted();
      console.log(
        "👥 Onboarding: Anonymous user onboarding completed - saved to localStorage",
      );
    } else {
      // For authenticated users, save to Firestore
      await updateFirestore({
        onboardingProgress: newProgress,
        onboardingCompleted: true,
        isNewUser: false,
      });
    }
  };

  const completeFirstGeneration = async () => {
    const newProgress = { ...progress, firstGenerationCompleted: true };
    setProgress(newProgress);

    await updateFirestore({
      onboardingProgress: newProgress,
    });
  };

  const completeProfileSetup = async () => {
    const newProgress = { ...progress, profileSetupCompleted: true };
    setProgress(newProgress);

    await updateFirestore({
      onboardingProgress: newProgress,
    });
  };

  const markPremiumIntroShown = async () => {
    const newProgress = { ...progress, premiumIntroShown: true };
    setProgress(newProgress);

    await updateFirestore({
      onboardingProgress: newProgress,
    });
  };

  const skipOnboarding = async () => {
    setNeedsOnboarding(false);
    setShowWelcome(false);
    setShowTour(false);

    // For anonymous users, mark completion in localStorage
    if (!user) {
      markAnonymousOnboardingCompleted();
      console.log(
        "👥 Onboarding: Anonymous user skipped onboarding - saved to localStorage",
      );
    } else {
      // For authenticated users, save to Firestore
      await updateFirestore({
        onboardingCompleted: true,
        isNewUser: false,
        onboardingProgress: {
          ...progress,
          welcomeCompleted: true,
          tourCompleted: true,
        },
      });
    }
  };

  const resetOnboarding = async () => {
    setNeedsOnboarding(true);
    setShowWelcome(true);
    setShowTour(false);
    setProgress(defaultProgress);
    setOnboardingData(null);

    await updateFirestore({
      onboardingCompleted: false,
      isNewUser: true,
      onboardingData: null,
      onboardingProgress: defaultProgress,
    });
  };

  const updateOnboardingData = async (data: Partial<OnboardingData>) => {
    const newData = { ...onboardingData, ...data };
    setOnboardingData(newData);

    await updateFirestore({
      onboardingData: newData,
    });
  };

  const startAnonymousOnboarding = () => {
    // Check if anonymous user has already seen onboarding
    if (hasSeenAnonymousOnboarding()) {
      console.log(
        "👥 Onboarding: Anonymous user has already seen onboarding - skipping",
      );
      setAnonymousOnboardingStarted(false);
      setNeedsOnboarding(false);
      setShowWelcome(false);
      setShowTour(false);
      return;
    }

    console.log("👥 Onboarding: Starting anonymous user onboarding");
    setAnonymousOnboardingStarted(true);
    setNeedsOnboarding(true);
    setShowWelcome(true);
    setShowTour(false);
    setProgress(defaultProgress);
  };

  const value: OnboardingContextType = {
    // State
    needsOnboarding,
    showWelcome,
    showTour,
    onboardingData,
    progress,
    loading,

    // Actions
    completeWelcome,
    completeTour,
    completeFirstGeneration,
    completeProfileSetup,
    markPremiumIntroShown,
    skipOnboarding,
    resetOnboarding,
    updateOnboardingData,
    startAnonymousOnboarding,
  };

  return (
    <OnboardingContext.Provider value={value}>
      {children}
    </OnboardingContext.Provider>
  );
};

export default OnboardingProvider;
