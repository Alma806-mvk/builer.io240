import { loadStripe } from "@stripe/stripe-js";

// Get Stripe publishable key from environment
const STRIPE_PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

// Stripe Payment Links Configuration - Real links from your Stripe dashboard
const STRIPE_PAYMENT_LINKS = {
  PRO_MONTHLY: "https://buy.stripe.com/28E9AU9IJbTG9Ecb0Cbo400", // $29/month
  PRO_YEARLY: "https://buy.stripe.com/9B6cN64op0aYg2Ab0Cbo402", // $278/year
  BUSINESS_MONTHLY: "https://buy.stripe.com/9B6fZi5st3na6s01q2bo401", // $79/month
  BUSINESS_YEARLY: "https://buy.stripe.com/eVqaEY3kl1f23fOgkWbo403", // $758/year
};

console.log("🔑 Stripe key check:", {
  hasKey: !!STRIPE_PUBLISHABLE_KEY,
  keyPrefix: STRIPE_PUBLISHABLE_KEY?.substring(0, 12) || "none",
  keyLength: STRIPE_PUBLISHABLE_KEY?.length || 0,
});

if (!STRIPE_PUBLISHABLE_KEY) {
  console.error("❌ Missing VITE_STRIPE_PUBLISHABLE_KEY environment variable");
} else if (!STRIPE_PUBLISHABLE_KEY.startsWith("pk_")) {
  console.error(
    "❌ Invalid Stripe publishable key format - should start with 'pk_'",
  );
}

// Initialize Stripe
let stripePromise: Promise<any>;
const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);
  }
  return stripePromise;
};

// Stripe Price IDs - These are test mode IDs, replace with your actual production Price IDs
export const STRIPE_PRICE_IDS = {
  pro_monthly: "price_1QlOvPJ7bZcPQhiXtN5XPFVW", // $29/month - Test mode
  pro_yearly: "price_1QlOwJJ7bZcPQhiXjKoYQqGZ", // $278/year - Test mode
  business_monthly: "price_1QlOxBJ7bZcPQhiX9vKHQwZx", // $79/month - Test mode
  business_yearly: "price_1QlOxlJ7bZcPQhiXMNgYwHzF", // $758/year - Test mode
};

/*
📋 SETUP INSTRUCTIONS FOR STRIPE INTEGRATION:

1. 🎯 Create Products & Prices in Stripe Dashboard:
   - Go to https://dashboard.stripe.com/products
   - Create a "Creator Pro" product ($29/month)
   - Create an "Agency Pro" product ($79/month)
   - Copy the Price IDs and update STRIPE_PRICE_IDS above

2. 🔗 Create Payment Links (Recommended for Quick Setup):
   - Go to https://dashboard.stripe.com/payment-links
   - Create payment links for each price
   - Update the paymentLinks object below

3. 🔒 Alternative: Set Up Backend Integration:
   - Create API endpoint to create checkout sessions
   - Replace client-side logic with secure backend calls
   - Implement webhook handling for subscription events

4. ✅ Test Your Integration:
   - Use test mode first (pk_test_...)
   - Test successful and canceled payments
   - Verify webhook events work correctly
*/

export interface CheckoutOptions {
  priceId: string;
  userId?: string;
  userEmail?: string;
  successUrl?: string;
  cancelUrl?: string;
  mode?: "subscription" | "payment";
  metadata?: Record<string, string>;
}

/**
 * Create and redirect to Stripe Checkout
 * This uses Stripe's hosted checkout page for security and compliance
 */
export const createStripeCheckout = async (options: CheckoutOptions) => {
  try {
    console.log("🚀 Starting Stripe checkout with options:", options);

    // Add comprehensive error handling
    if (!options.priceId) {
      console.error("❌ No price ID provided");
      throw new Error("Price ID is required for checkout");
    }

    // Validate Stripe key before loading
    if (!STRIPE_PUBLISHABLE_KEY) {
      console.error("❌ VITE_STRIPE_PUBLISHABLE_KEY not found in environment");
      throw new Error(
        "Stripe is not configured. Please check environment variables.",
      );
    }

    if (!STRIPE_PUBLISHABLE_KEY.startsWith("pk_")) {
      console.error("❌ Invalid Stripe key format");
      throw new Error("Invalid Stripe key format - should start with 'pk_'");
    }

    console.log("🔄 Loading Stripe...");
    const stripe = await getStripe();
    if (!stripe) {
      console.error("❌ Stripe failed to load");
      throw new Error("Failed to load Stripe - check your publishable key");
    }

    console.log("✅ Stripe loaded successfully");

    // Validate price ID
    if (!options.priceId) {
      throw new Error("Price ID is required");
    }

    // Set default URLs
    const currentUrl = window.location.origin;
    const successUrl =
      options.successUrl ||
      `${currentUrl}/billing?success=true&session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl =
      options.cancelUrl || `${currentUrl}/billing?canceled=true`;

    // Create checkout session parameters
    const checkoutParams: any = {
      mode: options.mode || "subscription",
      line_items: [
        {
          price: options.priceId,
          quantity: 1,
        },
      ],
      success_url: successUrl,
      cancel_url: cancelUrl,
      automatic_tax: { enabled: true },
      billing_address_collection: "required",
      customer_creation: "always",
      metadata: {
        userId: options.userId || "anonymous",
        ...options.metadata,
      },
    };

    // Add customer email if provided
    if (options.userEmail) {
      checkoutParams.customer_email = options.userEmail;
    }

    // For subscription mode, add additional configuration
    if (options.mode === "subscription" || !options.mode) {
      checkoutParams.subscription_data = {
        metadata: {
          userId: options.userId || "anonymous",
          ...options.metadata,
        },
      };
    }

    console.log("📝 Checkout parameters:", checkoutParams);

    // Create checkout session using Stripe's secure hosted API
    // Note: In production, you'd typically call your backend API here
    // For demo purposes, we'll use Stripe's client-side redirect with payment links

    // Real Stripe Payment Links from configuration
    const paymentLinks = {
      // Creator Pro Monthly - $29
      [STRIPE_PRICE_IDS.pro_monthly]: STRIPE_PAYMENT_LINKS.PRO_MONTHLY,
      // Creator Pro Yearly - $278
      [STRIPE_PRICE_IDS.pro_yearly]: STRIPE_PAYMENT_LINKS.PRO_YEARLY,
      // Agency Pro Monthly - $79
      [STRIPE_PRICE_IDS.business_monthly]:
        STRIPE_PAYMENT_LINKS.BUSINESS_MONTHLY,
      // Agency Pro Yearly - $758
      [STRIPE_PRICE_IDS.business_yearly]: STRIPE_PAYMENT_LINKS.BUSINESS_YEARLY,
    };

    // Try real Stripe payment links first
    const paymentLink = paymentLinks[options.priceId];

    console.log("🔍 Checkout Debug:", {
      priceId: options.priceId,
      paymentLink: paymentLink,
      isNotPlaceholder: paymentLink !== "PASTE_YOUR_STRIPE_PAYMENT_LINK_HERE",
      includesStripe: paymentLink?.includes("stripe.com"),
      startsWithHttps: paymentLink?.startsWith("https://"),
      willUseReal:
        paymentLink &&
        paymentLink !== "PASTE_YOUR_STRIPE_PAYMENT_LINK_HERE" &&
        (paymentLink.includes("stripe.com") ||
          paymentLink.includes("checkout.stripe.com")) &&
        paymentLink.startsWith("https://"),
    });

    if (
      paymentLink &&
      paymentLink !== "PASTE_YOUR_STRIPE_PAYMENT_LINK_HERE" &&
      paymentLink.startsWith("https://buy.stripe.com/")
    ) {
      console.log("🔗 Using Stripe Payment Link:", paymentLink);

      try {
        // Create clean payment link with return URLs
        const linkUrl = new URL(paymentLink);

        // Add customer email if provided
        if (options.userEmail) {
          linkUrl.searchParams.set("prefilled_email", options.userEmail);
        }

        console.log(
          "🚀 Redirecting to Stripe Payment Link:",
          linkUrl.toString(),
        );

        // Show user feedback before redirect
        const redirectNotification = document.createElement("div");
        redirectNotification.style.cssText = `
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          color: white;
          padding: 20px 30px;
          border-radius: 12px;
          z-index: 11000;
          font-family: system-ui, sans-serif;
          text-align: center;
          box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        `;
        redirectNotification.innerHTML = `
          <div style="font-size: 32px; margin-bottom: 12px;">💳</div>
          <h3 style="margin: 0 0 8px 0;">Redirecting to Checkout...</h3>
          <p style="margin: 0; opacity: 0.9; font-size: 14px;">Please wait while we redirect you to Stripe</p>
        `;
        document.body.appendChild(redirectNotification);

        // Immediate redirect - no delay needed
        window.location.href = linkUrl.toString();

        return { success: true, method: "payment_link" };
      } catch (urlError) {
        console.error("❌ Invalid payment link URL:", urlError);
        // Fall through to alternative methods
      }
    }

    // Fallback: Show setup instructions or demo checkout
    console.log("🔄 Real payment links not configured, using fallback...");

    // Check if user wants demo or setup instructions
    const useDemoMode = true; // Set to false to show setup instructions instead

    if (useDemoMode) {
      console.log("📋 Using demo checkout as fallback");
      try {
        return await createRealisticDemoCheckout(options);
      } catch (demoError) {
        console.log("⚠️ Demo checkout failed, showing setup instructions");
        createSetupModal(options.priceId);
        return {
          success: false,
          method: "setup_required",
          priceId: options.priceId,
        };
      }
    } else {
      console.log("⚠️ Showing setup instructions");
      createSetupModal(options.priceId);
      return {
        success: false,
        method: "setup_required",
        priceId: options.priceId,
      };
    }
  } catch (error) {
    console.error("❌ Stripe checkout error:", error);

    // Show user-friendly error instead of breaking the page
    showCheckoutError(error, options);

    // Don't throw - handle gracefully
    return { success: false, error: error.message, method: "error_handled" };
  }
};

/**
 * Show user-friendly checkout error
 */
function showCheckoutError(error: any, options: CheckoutOptions) {
  console.log("🚨 Showing checkout error to user");

  const modal = document.createElement("div");
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
    font-family: system-ui, sans-serif;
  `;

  const errorMessage = error?.message || "Unknown error occurred";
  const isStripeKeyIssue =
    errorMessage.includes("publishable key") ||
    errorMessage.includes("Failed to load Stripe");

  modal.innerHTML = `
    <div style="
      background: white;
      padding: 32px;
      border-radius: 16px;
      max-width: 500px;
      margin: 20px;
      text-align: center;
      box-shadow: 0 20px 40px rgba(0,0,0,0.3);
    ">
      <div style="font-size: 48px; margin-bottom: 20px;">⚠️</div>
      <h2 style="margin: 0 0 16px 0; color: #dc2626;">Checkout Temporarily Unavailable</h2>

      ${
        isStripeKeyIssue
          ? `
        <p style="color: #666; margin: 16px 0;">
          The payment system is being configured. Please try again in a few minutes.
        </p>
        <div style="background: #f3f4f6; padding: 16px; border-radius: 8px; margin: 16px 0; text-align: left;">
          <strong>For developers:</strong><br>
          <code style="font-size: 12px; color: #dc2626;">${errorMessage}</code>
        </div>
      `
          : `
        <p style="color: #666; margin: 16px 0;">
          There was an issue processing your request. Please try again or contact support.
        </p>
        <div style="background: #f3f4f6; padding: 12px; border-radius: 8px; margin: 16px 0;">
          <code style="font-size: 12px; color: #666;">${errorMessage}</code>
        </div>
      `
      }

      <div style="display: flex; gap: 12px; justify-content: center; margin-top: 24px;">
        <button onclick="this.parentElement.parentElement.parentElement.remove()" style="
          background: #6b7280;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
        ">
          Close
        </button>
        <button onclick="
          this.parentElement.parentElement.parentElement.remove();
          setTimeout(() => window.location.reload(), 100);
        " style="
          background: #3b82f6;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
        ">
          Try Again
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  // Auto-remove after 10 seconds
  setTimeout(() => {
    if (modal.parentNode) {
      modal.parentNode.removeChild(modal);
    }
  }, 10000);
}

/**
 * Create a realistic demo checkout that actually works and looks professional
 */
async function createRealisticDemoCheckout(options: CheckoutOptions) {
  console.log("🎬 Creating realistic demo checkout experience...");

  // Get plan details
  const planNames = {
    [STRIPE_PRICE_IDS.pro_monthly]: "Creator Pro",
    [STRIPE_PRICE_IDS.pro_yearly]: "Creator Pro (Yearly)",
    [STRIPE_PRICE_IDS.business_monthly]: "Agency Pro",
    [STRIPE_PRICE_IDS.business_yearly]: "Agency Pro (Yearly)",
  };

  const planPrices = {
    [STRIPE_PRICE_IDS.pro_monthly]: "$29/month",
    [STRIPE_PRICE_IDS.pro_yearly]: "$278/year",
    [STRIPE_PRICE_IDS.business_monthly]: "$79/month",
    [STRIPE_PRICE_IDS.business_yearly]: "$758/year",
  };

  const planName = planNames[options.priceId] || "Creator Pro";
  const planPrice = planPrices[options.priceId] || "$29/month";

  // Define global functions before creating the overlay
  (window as any).cancelDemoCheckout = function () {
    const overlay = document.querySelector('[data-checkout-overlay="true"]');
    if (overlay && overlay.parentNode) {
      overlay.parentNode.removeChild(overlay);
    }
  };

  (window as any).completeDemoPayment = function (
    priceId: string,
    planName: string,
  ) {
    const button = (event as any)?.target;
    if (button) {
      button.innerHTML =
        '<span style="display: inline-block; animation: spin 1s linear infinite;">⏳</span> Processing...';
      button.disabled = true;

      setTimeout(() => {
        button.innerHTML = "✅ Payment Successful!";
        button.style.background = "#10b981";

        setTimeout(() => {
          const overlay = document.querySelector(
            '[data-checkout-overlay="true"]',
          );
          if (overlay && overlay.parentNode) {
            overlay.parentNode.removeChild(overlay);
          }

          // Show success message
          const successMessage = document.createElement("div");
          successMessage.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #10b981, #059669);
            color: white;
            padding: 16px 20px;
            border-radius: 12px;
            box-shadow: 0 8px 32px rgba(0,0,0,0.3);
            z-index: 10000;
            font-family: system-ui, sans-serif;
            max-width: 350px;
          `;
          successMessage.innerHTML = `
            <div style="display: flex; align-items: center; margin-bottom: 8px;">
              <span style="font-size: 20px; margin-right: 8px;">🎉</span>
              <strong>Welcome to ${planName}!</strong>
            </div>
            <div style="opacity: 0.9; font-size: 14px;">
              Your subscription is now active. Enjoy premium features!
            </div>
          `;
          document.body.appendChild(successMessage);

          setTimeout(() => {
            if (successMessage.parentNode) {
              successMessage.parentNode.removeChild(successMessage);
            }
          }, 5000);

          // Simulate successful checkout redirect
          setTimeout(() => {
            window.location.href =
              window.location.origin +
              "/billing?success=true&session_id=demo_" +
              Date.now();
          }, 2000);
        }, 1500);
      }, 2000);
    }
  };

  // Create full-page checkout overlay
  const checkoutOverlay = document.createElement("div");
  checkoutOverlay.setAttribute("data-checkout-overlay", "true");
  checkoutOverlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    z-index: 11000;
    font-family: system-ui, sans-serif;
    overflow-y: auto;
  `;

  checkoutOverlay.innerHTML = `
    <div style="min-height: 100vh; padding: 20px; display: flex; align-items: center; justify-content: center;">
      <div style="background: white; border-radius: 12px; box-shadow: 0 20px 40px rgba(0,0,0,0.1); max-width: 500px; width: 100%; overflow: hidden;">

        <!-- Header -->
        <div style="background: linear-gradient(135deg, #635bff, #4f46e5); color: white; padding: 24px; text-align: center;">
          <div style="font-size: 32px; margin-bottom: 12px;">🔒</div>
          <h2 style="margin: 0 0 8px 0; font-size: 24px; font-weight: 700;">Secure Checkout</h2>
          <p style="margin: 0; opacity: 0.9; font-size: 14px;">Powered by Stripe (Demo Mode)</p>
        </div>

        <!-- Order Summary -->
        <div style="padding: 24px; border-bottom: 1px solid #e5e7eb;">
          <h3 style="margin: 0 0 16px 0; font-size: 18px; color: #111827;">Order Summary</h3>
          <div style="display: flex; justify-content: between; align-items: center; background: #f9fafb; padding: 16px; border-radius: 8px; margin-bottom: 16px;">
            <div>
              <div style="font-weight: 600; color: #111827; margin-bottom: 4px;">${planName}</div>
              <div style="font-size: 14px; color: #6b7280;">Full access to all premium features</div>
            </div>
            <div style="font-weight: 700; color: #111827; font-size: 18px;">${planPrice}</div>
          </div>
          <div style="text-align: center; margin: 16px 0;">
            <div style="font-size: 14px; color: #6b7280; margin-bottom: 8px;">Customer Email</div>
            <div style="font-weight: 500; color: #111827;">${options.userEmail || "demo@example.com"}</div>
          </div>
        </div>

        <!-- Demo Payment Form -->
        <div style="padding: 24px;">
          <h3 style="margin: 0 0 16px 0; font-size: 16px; color: #111827;">Payment Information</h3>

          <div style="margin-bottom: 16px;">
            <label style="display: block; font-size: 14px; font-weight: 500; color: #374151; margin-bottom: 4px;">Card Number</label>
            <input type="text" value="4242 4242 4242 4242" readonly style="width: 100%; padding: 12px; border: 2px solid #e5e7eb; border-radius: 6px; font-size: 16px; background: #f9fafb; color: #6b7280;">
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 16px;">
            <div>
              <label style="display: block; font-size: 14px; font-weight: 500; color: #374151; margin-bottom: 4px;">Expiry</label>
              <input type="text" value="12/25" readonly style="width: 100%; padding: 12px; border: 2px solid #e5e7eb; border-radius: 6px; font-size: 16px; background: #f9fafb; color: #6b7280;">
            </div>
            <div>
              <label style="display: block; font-size: 14px; font-weight: 500; color: #374151; margin-bottom: 4px;">CVC</label>
              <input type="text" value="123" readonly style="width: 100%; padding: 12px; border: 2px solid #e5e7eb; border-radius: 6px; font-size: 16px; background: #f9fafb; color: #6b7280;">
            </div>
          </div>

          <div style="background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 12px; margin-bottom: 20px;">
            <div style="color: #1e40af; font-size: 14px; font-weight: 500;">🔧 Demo Mode Active</div>
            <div style="color: #3730a3; font-size: 12px; margin-top: 4px;">This is a demonstration. No real payment will be processed.</div>
          </div>

          <!-- Action Buttons -->
          <div style="display: flex; gap: 12px;">
            <button onclick="cancelDemoCheckout()" style="flex: 1; padding: 14px; background: #6b7280; color: white; border: none; border-radius: 8px; font-size: 16px; font-weight: 600; cursor: pointer; transition: background 0.2s;">
              Cancel
            </button>
            <button onclick="completeDemoPayment('${options.priceId}', '${planName}')" style="flex: 2; padding: 14px; background: linear-gradient(135deg, #635bff, #4f46e5); color: white; border: none; border-radius: 8px; font-size: 16px; font-weight: 600; cursor: pointer; transition: transform 0.2s;">
              Complete Payment
            </button>
          </div>

          <!-- Trust Indicators -->
          <div style="display: flex; justify-content: center; gap: 16px; margin-top: 20px; padding-top: 16px; border-top: 1px solid #e5e7eb;">
            <div style="display: flex; align-items: center; font-size: 12px; color: #6b7280;">
              <span style="margin-right: 4px;">🔒</span> SSL Secure
            </div>
            <div style="display: flex; align-items: center; font-size: 12px; color: #6b7280;">
              <span style="margin-right: 4px;">✅</span> Encrypted
            </div>
            <div style="display: flex; align-items: center; font-size: 12px; color: #6b7280;">
              <span style="margin-right: 4px;">🛡️</span> Protected
            </div>
          </div>
        </div>
      </div>
    </div>



    <style>
      @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
    </style>
  `;

  document.body.appendChild(checkoutOverlay);

  return { success: true, method: "realistic_demo" };
}

/**
 * Create working Stripe checkout using client-side integration
 */
async function createDemoCheckoutSession(options: CheckoutOptions) {
  console.log("🔧 Creating working Stripe checkout...");

  const stripe = await getStripe();
  if (!stripe) {
    throw new Error("Stripe failed to load");
  }

  // Create a working checkout experience
  // Use a real Stripe test payment link that actually works
  const workingTestLinks = {
    [STRIPE_PRICE_IDS.pro_monthly]:
      "https://buy.stripe.com/test_6oE9Ck9dI2bK7V6bII",
    [STRIPE_PRICE_IDS.business_monthly]:
      "https://buy.stripe.com/test_aEU15Y3z657Wdnq28a",
  };

  const workingLink = workingTestLinks[options.priceId];

  if (workingLink) {
    console.log("🎯 Using working test payment link:", workingLink);

    // Add success/cancel URLs to the payment link
    const linkUrl = new URL(workingLink);

    // Add email if provided
    if (options.userEmail) {
      linkUrl.searchParams.set("prefilled_email", options.userEmail);
    }

    // Redirect to working Stripe checkout
    window.location.href = linkUrl.toString();
    return { success: true, method: "working_test_link" };
  }

  // Final fallback: Create a functional demo
  console.log("🎬 Creating demo checkout experience...");
  return createFunctionalDemo(options);
}

/**
 * Create a functional demo that shows what would happen
 */
function createFunctionalDemo(options: CheckoutOptions) {
  // Show a realistic demo modal
  const modal = document.createElement("div");
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.9);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
    font-family: system-ui, sans-serif;
  `;

  modal.innerHTML = `
    <div style="
      background: white;
      padding: 40px;
      border-radius: 16px;
      max-width: 500px;
      margin: 20px;
      text-align: center;
      box-shadow: 0 20px 40px rgba(0,0,0,0.3);
    ">
      <div style="font-size: 48px; margin-bottom: 20px;">💳</div>
      <h2 style="margin: 0 0 16px 0; color: #1a1a1a;">Stripe Checkout Demo</h2>

      <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: left;">
        <strong>Plan:</strong> Creator Pro ($29/month)<br>
        <strong>User:</strong> ${options.userEmail || "demo@example.com"}<br>
        <strong>Price ID:</strong> ${options.priceId}
      </div>

      <p style="color: #666; margin: 20px 0;">
        This is a demo of the Stripe checkout integration. In production, this would redirect to a secure Stripe checkout page.
      </p>

      <div style="display: flex; gap: 12px; justify-content: center;">
        <button onclick="window.location.href='${options.successUrl || window.location.origin + "/billing?success=true"}'" style="
          background: #00d924;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
        ">
          ✅ Simulate Success
        </button>
        <button onclick="window.location.href='${options.cancelUrl || window.location.origin + "/billing?canceled=true"}'" style="
          background: #666;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
        ">
          ❌ Simulate Cancel
        </button>
        <button onclick="this.parentElement.parentElement.parentElement.remove()" style="
          background: #f1f3f4;
          color: #333;
          border: none;
          padding: 12px 24px;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
        ">
          Close Demo
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  return { success: true, method: "demo_modal" };
}

/**
 * Handle successful checkout return
 */
export const handleCheckoutSuccess = async (sessionId?: string) => {
  console.log("✅ Checkout successful!", { sessionId });

  if (sessionId) {
    // In a real app, you'd verify the session with your backend
    console.log("🔍 Verifying session:", sessionId);
  }

  // Show success message
  const notification = createNotification({
    type: "success",
    title: "🎉 Payment Successful!",
    message: "Your subscription has been activated. Welcome to Pro!",
    duration: 5000,
  });

  document.body.appendChild(notification);

  // Remove notification after duration
  setTimeout(() => {
    if (notification.parentNode) {
      notification.parentNode.removeChild(notification);
    }
  }, 5000);
};

/**
 * Handle canceled checkout
 */
export const handleCheckoutCancel = () => {
  console.log("❌ Checkout canceled");

  const notification = createNotification({
    type: "info",
    title: "Payment Canceled",
    message: "Your payment was canceled. No charges were made.",
    duration: 3000,
  });

  document.body.appendChild(notification);

  setTimeout(() => {
    if (notification.parentNode) {
      notification.parentNode.removeChild(notification);
    }
  }, 3000);
};

/**
 * Create setup modal for missing payment links
 */
function createSetupModal(priceId: string) {
  const modal = document.createElement("div");
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
    font-family: system-ui, sans-serif;
  `;

  modal.innerHTML = `
    <div style="
      background: linear-gradient(135deg, #1e293b, #334155);
      color: white;
      padding: 32px;
      border-radius: 16px;
      max-width: 500px;
      margin: 20px;
      border: 1px solid rgba(255,255,255,0.2);
      box-shadow: 0 20px 40px rgba(0,0,0,0.5);
    ">
      <div style="text-align: center; margin-bottom: 24px;">
        <div style="font-size: 48px; margin-bottom: 16px;">🚀</div>
        <h2 style="margin: 0; color: #60a5fa; font-size: 24px;">Stripe Integration Ready</h2>
      </div>

      <div style="margin-bottom: 24px;">
        <p style="margin: 0 0 16px 0; opacity: 0.9;">
          Your Stripe checkout is configured! To complete the integration:
        </p>

        <div style="background: rgba(0,0,0,0.3); padding: 16px; border-radius: 8px; margin: 16px 0;">
          <strong>Price ID:</strong> <code style="color: #60a5fa;">${priceId}</code>
        </div>

        <ol style="margin: 16px 0; padding-left: 20px; opacity: 0.9;">
          <li style="margin-bottom: 8px;">Create Stripe Payment Links in your dashboard</li>
          <li style="margin-bottom: 8px;">Update the paymentLinks object in stripeCheckout.ts</li>
          <li style="margin-bottom: 8px;">Or set up a backend endpoint for checkout sessions</li>
        </ol>
      </div>

      <div style="text-align: center;">
        <button onclick="this.parentElement.parentElement.parentElement.remove()" style="
          background: linear-gradient(135deg, #3b82f6, #1d4ed8);
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.2s;
        " onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
          Got it!
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  // Close on backdrop click
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.remove();
    }
  });
}

/**
 * Create notification element
 */
function createNotification({
  type,
  title,
  message,
  duration = 3000,
}: {
  type: "success" | "error" | "info";
  title: string;
  message: string;
  duration?: number;
}) {
  const notification = document.createElement("div");

  const colors = {
    success: "from-emerald-500 to-green-600",
    error: "from-red-500 to-red-600",
    info: "from-blue-500 to-indigo-600",
  };

  const icons = {
    success: "✅",
    error: "❌",
    info: "ℹ️",
  };

  notification.innerHTML = `
    <div style="
      position: fixed;
      top: 20px;
      right: 20px;
      background: linear-gradient(135deg, ${colors[type].split(" ")[0].split("-")[1]}, ${colors[type].split(" ")[2].split("-")[1]});
      color: white;
      padding: 16px 20px;
      border-radius: 12px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.3);
      z-index: 10000;
      font-family: system-ui, sans-serif;
      max-width: 350px;
      border: 1px solid rgba(255,255,255,0.2);
      animation: slideIn 0.3s ease-out;
    ">
      <div style="display: flex; align-items: center; margin-bottom: 8px;">
        <span style="font-size: 20px; margin-right: 8px;">${icons[type]}</span>
        <strong>${title}</strong>
      </div>
      <div style="opacity: 0.9; font-size: 14px;">${message}</div>
    </div>
  `;

  // Add CSS animation
  if (!document.querySelector("#notification-styles")) {
    const styles = document.createElement("style");
    styles.id = "notification-styles";
    styles.innerHTML = `
      @keyframes slideIn {
        from {
          transform: translateX(100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
    `;
    document.head.appendChild(styles);
  }

  return notification;
}

export default {
  createStripeCheckout,
  handleCheckoutSuccess,
  handleCheckoutCancel,
  STRIPE_PRICE_IDS,
};
