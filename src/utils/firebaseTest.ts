import { auth } from "../config/firebase";

export const testFirebaseAuth = async () => {
  try {
    console.log("🧪 Testing Firebase Authentication setup...");

    // Check if auth is initialized
    if (!auth) {
      console.error("❌ Firebase Auth not initialized");
      return false;
    }

    // Check configuration
    const config = auth.config;
    console.log("✅ Firebase Auth initialized");
    console.log(
      "✅ API Key:",
      config.apiKey ? `${config.apiKey.substring(0, 10)}...` : "Missing",
    );
    console.log("✅ Auth Domain:", config.authDomain || "Missing");
    console.log("✅ Project ID:", config.projectId || "Missing");

    // Test network connectivity
    try {
      // This will attempt to connect to Firebase Auth servers
      await auth.authStateReady();
      console.log("✅ Firebase Auth network connection successful");
      return true;
    } catch (networkError: any) {
      console.error(
        "❌ Firebase Auth network test failed:",
        networkError.message,
      );
      return false;
    }
  } catch (error: any) {
    console.error("❌ Firebase Auth test failed:", error.message);
    return false;
  }
};

export const getDetailedAuthError = (error: any) => {
  console.log("🔍 Detailed error analysis:");
  console.log("Error code:", error.code);
  console.log("Error message:", error.message);
  console.log("Error stack:", error.stack);

  if (error.code === "auth/network-request-failed") {
    console.log("🌐 Network troubleshooting:");
    console.log("- Check internet connection");
    console.log("- Verify Firebase project configuration");
    console.log("- Check if Firebase Authentication is enabled");
    console.log("- Try using a different network");
  }

  return error;
};
