/**
 * Stripe Key Validation Utility
 * Helps debug Stripe integration issues
 */

export function validateStripeKey() {
  const key = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

  console.log("🔍 Stripe Key Validation:");
  console.log("========================");
  console.log("Key exists:", !!key);
  console.log("Key length:", key?.length || 0);
  console.log("Key prefix:", key?.substring(0, 15) || "none");
  console.log(
    "Key suffix:",
    key ? "..." + key.substring(key.length - 8) : "none",
  );
  console.log("Is test key:", key?.startsWith("pk_test_") || false);
  console.log("Is live key:", key?.startsWith("pk_live_") || false);

  // Validation checks
  const checks = {
    hasKey: !!key,
    correctFormat: key?.startsWith("pk_") || false,
    testMode: key?.startsWith("pk_test_") || false,
    correctLength: key?.length > 50 || false,
  };

  console.log("Validation checks:", checks);

  // Overall validation
  const isValid = checks.hasKey && checks.correctFormat && checks.correctLength;
  console.log("Overall valid:", isValid);

  if (!isValid) {
    console.error("❌ Stripe key validation failed!");

    if (!checks.hasKey) {
      console.error("- Missing VITE_STRIPE_PUBLISHABLE_KEY in .env.local");
    }
    if (!checks.correctFormat) {
      console.error('- Key should start with "pk_test_" or "pk_live_"');
    }
    if (!checks.correctLength) {
      console.error("- Key seems too short (should be 100+ characters)");
    }
  } else {
    console.log("✅ Stripe key validation passed!");
  }

  return {
    isValid,
    checks,
    key: key
      ? `${key.substring(0, 15)}...${key.substring(key.length - 8)}`
      : "none",
  };
}

export function testStripeConnection() {
  return new Promise(async (resolve, reject) => {
    try {
      console.log("🧪 Testing Stripe connection...");

      // Import loadStripe dynamically
      const { loadStripe } = await import("@stripe/stripe-js");
      const key = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

      if (!key) {
        throw new Error("No Stripe key found");
      }

      console.log("🔄 Loading Stripe with key...");
      const stripe = await loadStripe(key);

      if (!stripe) {
        throw new Error("Failed to load Stripe - invalid key or network issue");
      }

      console.log("✅ Stripe loaded successfully!");
      console.log("Stripe object:", {
        hasStripe: !!stripe,
        version: stripe._VERSION || "unknown",
      });

      resolve({ success: true, stripe });
    } catch (error) {
      console.error("❌ Stripe connection test failed:", error);
      reject(error);
    }
  });
}

// Auto-run validation when this module is imported
if (typeof window !== "undefined") {
  setTimeout(() => {
    validateStripeKey();
  }, 1000);
}
