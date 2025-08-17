/**
 * Utility to handle and suppress common Firebase permission errors
 * during the authentication flow to reduce console noise
 */

// Track if we've already notified about permission issues
const notificationTracker = {
  permissionErrorShown: false,
  lastErrorTime: 0,
  errorCount: 0,
};

/**
 * Determines if a Firebase error should be suppressed from console logging
 */
export const shouldSuppressFirebaseError = (error: any): boolean => {
  if (!error) return false;

  const message = error.message || error.code || "";
  const suppressPatterns = [
    "Missing or insufficient permissions",
    "permission-denied",
    "insufficient-permissions",
    "PERMISSION_DENIED",
    "unauthenticated",
  ];

  return suppressPatterns.some((pattern) =>
    message.toLowerCase().includes(pattern.toLowerCase()),
  );
};

/**
 * Logs Firebase errors appropriately based on type and frequency
 */
export const logFirebaseError = (
  error: any,
  context: string = "Firebase operation",
): void => {
  if (shouldSuppressFirebaseError(error)) {
    // Only log permission errors once per session and as info level
    if (!notificationTracker.permissionErrorShown) {
      console.info(
        `ℹ️ ${context}: Permission pending (this is normal during authentication)`,
      );
      notificationTracker.permissionErrorShown = true;
    }
    return;
  }

  // Log other Firebase errors normally
  console.error(`❌ ${context}:`, error);
};

/**
 * Handles Firebase permission errors gracefully without user-facing notifications
 * for initial authentication flow
 */
export const handleFirebasePermissionError = (
  error: any,
  context: string = "Firebase",
): boolean => {
  if (shouldSuppressFirebaseError(error)) {
    logFirebaseError(error, context);
    return true; // Error was handled
  }

  return false; // Error was not a permission error
};

/**
 * Resets the notification tracker (useful for testing or when user signs out)
 */
export const resetErrorNotificationTracker = (): void => {
  notificationTracker.permissionErrorShown = false;
  notificationTracker.lastErrorTime = 0;
  notificationTracker.errorCount = 0;
};
