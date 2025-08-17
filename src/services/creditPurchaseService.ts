import { loadStripe } from "@stripe/stripe-js";
import { auth } from "../config/firebase";
import { CREDIT_PACKAGES } from "../types/credits";

const STRIPE_PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

export class CreditPurchaseService {
  private static stripe = loadStripe(STRIPE_PUBLISHABLE_KEY);

  static async purchaseCredits(packageId: string): Promise<boolean> {
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error("User must be authenticated to purchase credits");
      }

      const creditPackage = CREDIT_PACKAGES.find((pkg) => pkg.id === packageId);
      if (!creditPackage) {
        throw new Error("Invalid credit package selected");
      }

      const stripe = await this.stripe;
      if (!stripe) {
        throw new Error("Stripe not available");
      }

      // Call your backend to create a checkout session
      const response = await fetch("/api/create-credit-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${await user.getIdToken()}`,
        },
        body: JSON.stringify({
          packageId,
          priceId: creditPackage.stripePriceId,
          credits: creditPackage.credits,
          bonusCredits: creditPackage.bonusCredits || 0,
          userId: user.uid,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create checkout session");
      }

      const { sessionId } = await response.json();

      // Redirect to Stripe Checkout
      const { error } = await stripe.redirectToCheckout({
        sessionId,
      });

      if (error) {
        throw error;
      }

      return true;
    } catch (error) {
      console.error("Error purchasing credits:", error);
      return false;
    }
  }

  static async handleSuccessfulPurchase(sessionId: string): Promise<void> {
    try {
      const user = auth.currentUser;
      if (!user) return;

      // Call your backend to confirm the purchase and add credits
      const response = await fetch("/api/confirm-credit-purchase", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${await user.getIdToken()}`,
        },
        body: JSON.stringify({
          sessionId,
          userId: user.uid,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to confirm credit purchase");
      }

      console.log("Credit purchase confirmed successfully");
    } catch (error) {
      console.error("Error confirming credit purchase:", error);
    }
  }
}
