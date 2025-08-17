export const validateFirebaseConfig = () => {
  const config = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
  };

  console.log("🔧 Environment Variables Check:");

  const issues: string[] = [];

  if (!config.apiKey) {
    issues.push("VITE_FIREBASE_API_KEY is missing");
  } else {
    console.log(
      "✅ VITE_FIREBASE_API_KEY:",
      `${config.apiKey.substring(0, 10)}...`,
    );
  }

  if (!config.authDomain) {
    issues.push("VITE_FIREBASE_AUTH_DOMAIN is missing");
  } else {
    console.log("✅ VITE_FIREBASE_AUTH_DOMAIN:", config.authDomain);
  }

  if (!config.projectId) {
    issues.push("VITE_FIREBASE_PROJECT_ID is missing");
  } else {
    console.log("✅ VITE_FIREBASE_PROJECT_ID:", config.projectId);
  }

  if (!config.storageBucket) {
    issues.push("VITE_FIREBASE_STORAGE_BUCKET is missing");
  } else {
    console.log("✅ VITE_FIREBASE_STORAGE_BUCKET:", config.storageBucket);
  }

  if (!config.messagingSenderId) {
    issues.push("VITE_FIREBASE_MESSAGING_SENDER_ID is missing");
  } else {
    console.log(
      "✅ VITE_FIREBASE_MESSAGING_SENDER_ID:",
      config.messagingSenderId,
    );
  }

  if (!config.appId) {
    issues.push("VITE_FIREBASE_APP_ID is missing");
  } else {
    console.log(
      "✅ VITE_FIREBASE_APP_ID:",
      `${config.appId.substring(0, 15)}...`,
    );
  }

  if (issues.length > 0) {
    console.error("❌ Firebase configuration issues:");
    issues.forEach((issue) => console.error(`  - ${issue}`));
    console.error("📝 Please check your .env.local file");
    return false;
  }

  console.log("✅ All Firebase environment variables are present");
  return true;
};

// Run validation immediately when module is imported
validateFirebaseConfig();
