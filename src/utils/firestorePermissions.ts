import { auth } from "../config/firebase";

/**
 * Check if Firestore operations should be attempted based on authentication state
 */
export const shouldAttemptFirestoreOperation = (): boolean => {
  // Check if user is authenticated
  if (!auth.currentUser) {
    console.log("🔐 Firestore operation skipped - user not authenticated");
    return false;
  }

  // Check if we're in offline mode
  if (localStorage.getItem("firebase_offline_mode") === "true") {
    console.log("📴 Firestore operation skipped - offline mode");
    return false;
  }

  // For development, allow operations regardless of email verification
  // In production, you may want to keep the email verification check
  return true;
};

/**
 * Check if user has the minimum requirements for Firestore access
 */
export const hasFirestoreAccess = (): boolean => {
  return !!(
    auth.currentUser &&
    auth.currentUser.emailVerified &&
    localStorage.getItem("firebase_offline_mode") !== "true"
  );
};

/**
 * Safe wrapper for Firestore operations that checks permissions first
 */
export const withFirestorePermissionCheck = async <T>(
  operation: () => Promise<T>,
  fallback: T,
  operationName: string = "Firestore operation",
): Promise<T> => {
  if (!shouldAttemptFirestoreOperation()) {
    return fallback;
  }

  try {
    return await operation();
  } catch (error: any) {
    // Handle permission errors gracefully
    if (
      error?.code === "permission-denied" ||
      error?.code === "insufficient-permissions" ||
      error?.message?.includes("Missing or insufficient permissions")
    ) {
      console.warn(`🔒 ${operationName} failed - insufficient permissions`);
      localStorage.setItem("firebase_offline_mode", "true");
      return fallback;
    }

    // Handle network errors
    if (
      error?.message?.includes("Failed to fetch") ||
      error?.message?.includes("NetworkError")
    ) {
      console.warn(`🌐 ${operationName} failed - network error`);
      localStorage.setItem("firebase_offline_mode", "true");
      return fallback;
    }

    // Re-throw other errors
    throw error;
  }
};
