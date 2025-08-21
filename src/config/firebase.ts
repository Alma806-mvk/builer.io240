import { initializeApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFunctions } from "firebase/functions";
import { getStorage, connectStorageEmulator } from "firebase/storage";
import "../utils/envValidation";
import {
  getFirestore,
  initializeFirestore,
  enableNetwork,
  onSnapshotsInSync,
  disableNetwork,
  connectFirestoreEmulator,
} from "firebase/firestore";

// Simplified environment detection - only check for actual Builder.io iframe
const isBuilderEnvironment =
  typeof window !== "undefined" &&
  window !== window.top && // Is in iframe
  (window.location.hostname.includes("builder.codes") ||
    window.location.hostname.includes("cdn.builder.io"));

// Local development detection
const isLocalDevelopment =
  typeof window !== "undefined" &&
  (window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1");

// Log environment detection for debugging
console.log("🌍 Environment Detection:", {
  hostname: typeof window !== "undefined" ? window.location.hostname : "server",
  isBuilderEnvironment,
  isLocalDevelopment,
  isIframe: typeof window !== "undefined" && window !== window.top,
  isDev: import.meta.env.DEV,
  mode: isBuilderEnvironment
    ? "Builder.io Preview"
    : isLocalDevelopment
      ? "Local Development"
      : "Production",
});

// Fallback configuration for standalone usage (when opened in new tab)
const fallbackConfig = {
  apiKey: "AIzaSyAKfS1T2v_6VUF3Fp_-jWla3TtJTLOAf_M",
  authDomain: "final-c054b.firebaseapp.com",
  projectId: "final-c054b",
  storageBucket: "final-c054b.firebasestorage.app",
  messagingSenderId: "28819717459",
  appId: "1:28819717459:web:dce266753b724fdb8635a6",
  measurementId: "G-BTYEMJNQQB",
};

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || fallbackConfig.apiKey,
  authDomain:
    import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || fallbackConfig.authDomain,
  projectId:
    import.meta.env.VITE_FIREBASE_PROJECT_ID || fallbackConfig.projectId,
  storageBucket:
    import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ||
    fallbackConfig.storageBucket,
  messagingSenderId:
    import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ||
    fallbackConfig.messagingSenderId,
  appId: import.meta.env.VITE_FIREBASE_APP_ID || fallbackConfig.appId,
  measurementId:
    import.meta.env.VITE_FIREBASE_MEASUREMENT_ID ||
    fallbackConfig.measurementId,
};

// Validate required config
if (
  !firebaseConfig.apiKey ||
  !firebaseConfig.authDomain ||
  !firebaseConfig.projectId
) {
  console.warn(
    "⚠️ Firebase configuration is incomplete - using fallback config",
  );
  console.log("🔧 Environment:", {
    isBuilderEnvironment,
    isLocalDevelopment,
    hasApiKey: !!import.meta.env.VITE_FIREBASE_API_KEY,
    hasAuthDomain: !!import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    hasProjectId: !!import.meta.env.VITE_FIREBASE_PROJECT_ID,
  });
}

// Initialize Firebase
console.log("��� Initializing Firebase with config:", {
  projectId: firebaseConfig.projectId,
  authDomain: firebaseConfig.authDomain,
  hasApiKey: !!firebaseConfig.apiKey,
});

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const functions = getFunctions(app);
export const storage = getStorage(app);

// Log Firebase initialization success
console.log("✅ Firebase initialized successfully");

// Development mode detection
const isDevelopment = import.meta.env.DEV;

// Initialize Firestore with appropriate settings for environment
export const db =
  isBuilderEnvironment || isLocalDevelopment
    ? initializeFirestore(app, {
        experimentalForceLongPolling: true,
        useFetchStreams: false,
        // Additional settings to prevent stream conflicts
        ignoreUndefinedProperties: true,
      })
    : initializeFirestore(app, {
        // Production settings to prevent ReadableStream conflicts
        useFetchStreams: false,
        ignoreUndefinedProperties: true,
      });

// Check if we should allow Firebase operations
const hasValidConfig = !!(import.meta.env.VITE_FIREBASE_PROJECT_ID && import.meta.env.VITE_FIREBASE_API_KEY);

if (isBuilderEnvironment && !hasValidConfig) {
  console.log("🔧 Builder.io iframe detected without valid config - enabling offline mode");
  localStorage.setItem("firebase_offline_mode", "true");

  // Disable Firestore network immediately to prevent fetch errors
  setTimeout(() => {
    disableNetwork(db).catch(() => {
      // Ignore errors when disabling network
      console.log("🟡 Network already disabled or unavailable");
    });
  }, 100);
} else if (isBuilderEnvironment && hasValidConfig) {
  console.log("🌐 Builder.io environment with valid config - Firebase operations allowed");
  localStorage.removeItem("firebase_offline_mode");
} else {
  console.log("🌐 Regular environment - Firebase online mode enabled");
  localStorage.removeItem("firebase_offline_mode");
}

// Handle development environment specific setup
if (isDevelopment || isBuilderEnvironment) {
  console.log("🛠️ Development mode detected");

  // In development environments like Builder.codes, we need to handle network restrictions
  if (isBuilderEnvironment) {
    console.log(
      "🟡 Builder.codes environment - Firebase will work in offline mode only",
    );
  }
}

// Firestore connection management
let isFirestoreOnline = false;
let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 3;

// Monitor Firestore connection status
const monitorFirestoreConnection = () => {
  onSnapshotsInSync(db, () => {
    if (!isFirestoreOnline) {
      console.log("🟢 Firestore connection restored");
      isFirestoreOnline = true;
      reconnectAttempts = 0;
    }
  });
};

// Test Firebase connection using SDK
export const testFirebaseConnection = async () => {
  try {
    console.log("🧪 Testing Firebase SDK connection...");

    // Check if Firebase is properly initialized
    if (!auth || !db) {
      console.log("❌ Firebase SDK not properly initialized");
      return false;
    }

    // Check if we have valid configuration
    if (!firebaseConfig.projectId || !firebaseConfig.apiKey) {
      console.log("❌ Firebase configuration incomplete");
      return false;
    }

    console.log("✅ Firebase SDK initialized successfully");
    console.log(`✅ Project ID: ${firebaseConfig.projectId}`);
    console.log(`✅ Auth Domain: ${firebaseConfig.authDomain}`);

    return true;
  } catch (error: any) {
    console.log("❌ Firebase SDK test failed:", error.message);
    return false;
  }
};

// Enable Firestore network with retry logic
const connectFirestore = async () => {
  // Skip all network operations only in Builder.io iframe
  if (isBuilderEnvironment) {
    console.log(
      "🟡 Skipping Firestore operations in Builder.io iframe environment",
    );
    console.log("💡 App will work with local state management only");
    isFirestoreOnline = false;

    // Ensure network is disabled to prevent any fetch attempts
    try {
      await disableNetwork(db);
      console.log("🔇 Firestore network disabled successfully");
    } catch (error) {
      console.log("🟡 Network disable attempt completed");
    }
    return;
  }

  try {
    await enableNetwork(db);
    isFirestoreOnline = true;
    console.log("🟢 Firestore connected successfully");
    monitorFirestoreConnection();
  } catch (error: any) {
    isFirestoreOnline = false;

    // Handle specific error types
    if (
      error?.message?.includes("Failed to fetch") ||
      error?.message?.includes("NetworkError") ||
      error?.message?.includes("CORS")
    ) {
      console.warn(
        "🌐 Network restrictions detected - this is normal in development",
      );
      console.warn("🟡 App will continue with local state management");
      console.warn("💡 Data will not persist between sessions");

      // Set flag for offline mode
      localStorage.setItem("firebase_offline_mode", "true");
      return;
    }

    console.warn("🔴 Firestore connection error:", error?.message || error);

    // Retry connection for other types of errors
    if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS && !isBuilderEnvironment) {
      reconnectAttempts++;
      const delay = Math.min(1000 * Math.pow(2, reconnectAttempts), 10000);
      console.log(
        `🔄 Retrying Firestore connection in ${delay}ms (attempt ${reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS})`,
      );
      setTimeout(connectFirestore, delay);
    } else {
      console.log("❌ Firestore unavailable. App will work in offline mode.");
      localStorage.setItem("firebase_offline_mode", "true");
    }
  }
};

// Export connection status checker
export const isFirestoreConnected = () => isFirestoreOnline;

// Check if we're in offline mode
export const isOfflineMode = () => {
  // If user is authenticated and has valid config, allow Firebase operations even in Builder environment
  const hasValidConfig = !!(import.meta.env.VITE_FIREBASE_PROJECT_ID && import.meta.env.VITE_FIREBASE_API_KEY);

  if (auth.currentUser && hasValidConfig) {
    console.log('🔓 Firebase operations enabled - user authenticated with valid config');
    return false;
  }

  return (
    localStorage.getItem("firebase_offline_mode") === "true" ||
    isBuilderEnvironment ||
    !isFirestoreOnline
  );
};

// Export manual reconnection function
export const reconnectFirestore = () => {
  if (!isBuilderEnvironment) {
    reconnectAttempts = 0;
    localStorage.removeItem("firebase_offline_mode");
    connectFirestore();
  } else {
    console.log(
      "🟡 Manual reconnection not available in Builder.codes environment",
    );
  }
};

// Graceful Firestore operation wrapper
export const safeFirestoreOperation = async <T>(
  operation: () => Promise<T>,
  fallback: T,
  operationName: string = "Firestore operation",
): Promise<T> => {

  // Enhanced debugging for Firestore operations
  console.log(`🔍 SafeFirestoreOperation Debug - ${operationName}:`, {
    isOfflineMode: isOfflineMode(),
    isFirestoreOnline: isFirestoreOnline,
    userAuthenticated: !!auth.currentUser,
    userEmail: auth.currentUser?.email,
    offlineModeFlag: localStorage.getItem("firebase_offline_mode"),
    isBuilderEnvironment: isBuilderEnvironment,
    isLocalDevelopment: isLocalDevelopment
  });

  if (isOfflineMode()) {
    console.log(`🟡 ${operationName} skipped - offline mode detected`);
    console.log('🟡 Offline mode reasons:', {
      localStorageFlag: localStorage.getItem("firebase_offline_mode"),
      isBuilderEnv: isBuilderEnvironment,
      firestoreOnline: isFirestoreOnline
    });
    return fallback;
  }

  // Check if user is authenticated before attempting Firestore operations
  if (!auth.currentUser) {
    console.warn(`🔐 ${operationName} skipped - user not authenticated`);
    return fallback;
  }

  try {
    console.log(`🚀 Executing Firestore operation: ${operationName}`);
    const result = await operation();
    console.log(`✅ Firestore operation completed successfully: ${operationName}`);
    return result;
  } catch (error: any) {
    console.error(`❌ Firestore operation failed: ${operationName}`, {
      errorCode: error?.code,
      errorMessage: error?.message,
      errorType: typeof error
    });

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

    if (
      error?.message?.includes("Failed to fetch") ||
      error?.message?.includes("NetworkError")
    ) {
      console.warn(`🟡 ${operationName} failed due to network restrictions`);
      localStorage.setItem("firebase_offline_mode", "true");
      return fallback;
    }

    console.error(`❌ ${operationName} failed:`, error);
    throw error; // Re-throw non-network errors
  }
};

// Initialize connection unless we're in Builder.io iframe
if (!isBuilderEnvironment) {
  connectFirestore();
} else {
  console.log(
    "🔧 Skipping Firebase initialization in Builder.io iframe environment",
  );
}

// Utility to prevent ReadableStream conflicts
let operationQueue: Promise<any> = Promise.resolve();

export const queueFirestoreOperation = async <T>(
  operation: () => Promise<T>
): Promise<T> => {
  operationQueue = operationQueue
    .then(async () => {
      // Small delay to prevent concurrent operations
      await new Promise(resolve => setTimeout(resolve, 10));
      return operation();
    })
    .catch(() => operation()); // If previous operation failed, still run this one

  return operationQueue;
};

// Note: Connection test is available via testFirebaseConnection() but not run automatically
// to avoid "Failed to fetch" errors in development environments

export default app;
