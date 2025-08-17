import React, { useState } from "react";
import { useCredits } from "../context/CreditContext";
import { useSubscription } from "../context/SubscriptionContext";
import { CREDIT_PACKAGES } from "../types/credits";
import { CreditPurchaseService } from "../services/creditPurchaseService";
import {
  CreditCardIcon,
  SparklesIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  PlusIcon,
  RefreshIcon,
} from "./IconComponents";
import LoadingSpinner from "./LoadingSpinner";

// Import new design system components
import {
  Button,
  Card,
  Badge,
  LoadingSpinner as WorldClassSpinner,
} from "./ui/WorldClassComponents";

interface CreditManagementProps {
  onNavigateToBilling: () => void;
}

const CreditManagement: React.FC<CreditManagementProps> = ({
  onNavigateToBilling,
}) => {
  const { credits, transactions, loading, refreshCredits } = useCredits();
  const { billingInfo } = useSubscription();
  const [purchasingPackage, setPurchasingPackage] = useState<string | null>(
    null,
  );

  const isUnlimited = billingInfo?.subscription?.planId === "enterprise";

  const handlePurchaseCredits = async (packageId: string) => {
    setPurchasingPackage(packageId);
    try {
      const success = await CreditPurchaseService.purchaseCredits(packageId);
      if (!success) {
        alert("Failed to initiate credit purchase. Please try again.");
      }
      // Note: The page will redirect to Stripe Checkout, so we don't need to handle success here
    } catch (error) {
      console.error("Error purchasing credits:", error);
      alert("Failed to purchase credits. Please try again.");
    } finally {
      setPurchasingPackage(null);
    }
  };



  if (loading && !credits) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-center py-12">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  return (
    <Card variant="hover">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-xl bg-gradient-to-br from-sky-500 to-purple-500 text-white">
            <CreditCardIcon className="w-5 h-5" />
          </div>
          <div>
            <h2 className="heading-4">Credit Management</h2>
            <p className="body-small">Your available credits & purchases</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={refreshCredits}
          icon={<RefreshIcon />}
        />
      </div>

      {isUnlimited ? (
        <div className="text-center py-8">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-400/30 rounded-xl">
            <SparklesIcon className="w-8 h-8 text-yellow-400" />
            <div>
              <div className="text-2xl font-bold text-yellow-300">
                Unlimited
              </div>
              <div className="text-yellow-200 text-sm">Enterprise Plan</div>
            </div>
          </div>
          <p className="text-[var(--text-secondary)] mt-4">
            Your Enterprise plan includes unlimited credits for all features.
          </p>
        </div>
      ) : credits ? (
        <div className="space-y-6">
          {/* Total Credits */}
          <div className="text-center">
            <div className="text-4xl font-bold text-[var(--text-primary)] mb-2">
              {credits.totalCredits.toLocaleString()}
            </div>
            <div className="text-[var(--text-secondary)] text-lg">
              {credits.totalCredits === 1
                ? "Credit Available"
                : "Credits Available"}
            </div>

            {credits.totalCredits <= 10 && (
              <Badge variant="warning" className="mt-3">
                <ExclamationTriangleIcon className="w-4 h-4" />
                Running low on credits
              </Badge>
            )}
          </div>

          {/* Credit Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-[var(--surface-tertiary)] border border-[var(--border-primary)] rounded-xl text-center">
              <div className="text-lg font-bold text-[var(--brand-primary)]">
                {credits.subscriptionCredits}
              </div>
              <div className="text-[var(--text-secondary)] text-sm">Subscription</div>
              <div className="text-xs text-[var(--text-tertiary)] mt-1">
                Resets monthly
              </div>
            </div>

            <div className="p-4 bg-[var(--surface-tertiary)] border border-[var(--border-primary)] rounded-xl text-center">
              <div className="text-lg font-bold text-[var(--color-success)]">
                {credits.purchasedCredits}
              </div>
              <div className="text-[var(--text-secondary)] text-sm">Purchased</div>
              <div className="text-xs text-[var(--text-tertiary)] mt-1">
                Never expire
              </div>
            </div>

            <div className="p-4 bg-[var(--surface-tertiary)] border border-[var(--border-primary)] rounded-xl text-center">
              <div className="text-lg font-bold text-[var(--brand-secondary)]">
                {credits.bonusCredits}
              </div>
              <div className="text-[var(--text-secondary)] text-sm">Bonus</div>
              <div className="text-xs text-[var(--text-tertiary)] mt-1">
                Promotions & gifts
              </div>
            </div>
          </div>

          {/* Next Reset */}
          {billingInfo?.subscription && (
            <div className="p-4 bg-[var(--surface-secondary)] border border-[var(--border-primary)] rounded-xl">
              <div className="flex items-center gap-3">
                <ClockIcon className="w-5 h-5 text-[var(--brand-primary)]" />
                <div>
                  <div className="text-[var(--text-primary)] font-medium">Next Reset</div>
                  <div className="text-[var(--text-secondary)] text-sm">
                    Subscription credits reset on{" "}
                    {new Date(
                      billingInfo.subscription.currentPeriodEnd,
                    ).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-8 text-[var(--text-secondary)]">
          <CreditCardIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>Unable to load credit information</p>
        </div>
      )}

      {/* Credit Packages */}
      {!isUnlimited && (
        <div className="border-t border-[var(--border-primary)] pt-6 mt-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500 to-sky-500 text-white">
              <PlusIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="heading-4">Buy More Credits</h3>
              <p className="body-small">One-time purchases that never expire</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {CREDIT_PACKAGES.map((pkg) => (
              <div
                key={pkg.id}
                className={`relative p-6 bg-[var(--surface-tertiary)] border border-[var(--border-primary)] rounded-xl hover:border-[var(--brand-primary)]/50 transition-all duration-300 ${
                  pkg.popular ? "ring-2 ring-[var(--brand-primary)]/30" : ""
                }`}
              >
                {pkg.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge variant="info" className="px-3 py-1">
                      POPULAR
                    </Badge>
                  </div>
                )}

                <div className="text-center">
                  <h4 className="text-lg font-bold text-[var(--text-primary)] mb-2">
                    {pkg.name}
                  </h4>
                  <p className="text-[var(--text-secondary)] text-sm mb-4">
                    {pkg.description}
                  </p>

                  <div className="mb-4">
                    <div className="text-2xl font-bold text-[var(--brand-primary)]">
                      {pkg.credits.toLocaleString()}
                      {pkg.bonusCredits && (
                        <span className="text-lg text-[var(--color-success)]">
                          {" "}
                          +{pkg.bonusCredits}
                        </span>
                      )}
                    </div>
                    <div className="text-[var(--text-secondary)] text-sm">Credits</div>
                  </div>

                  <div className="text-xl font-bold text-[var(--text-primary)] mb-4">
                    ${(pkg.price / 100).toFixed(2)}
                  </div>

                  <Button
                    variant="primary"
                    fullWidth
                    onClick={() => handlePurchaseCredits(pkg.id)}
                    loading={purchasingPackage === pkg.id}
                    disabled={purchasingPackage === pkg.id}
                  >
                    {purchasingPackage === pkg.id ? "Processing..." : "Purchase Credits"}
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-[var(--surface-secondary)] border border-[var(--border-primary)] rounded-xl">
            <p className="text-[var(--text-secondary)] text-sm text-center">
              Need a subscription with more credits?{" "}
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  window.open(
                    "https://billing.stripe.com/p/login/28E9AU9IJbTG9Ecb0Cbo400",
                    "_blank",
                  )
                }
                className="text-[var(--brand-primary)] hover:text-[var(--brand-primary)]/80 font-semibold underline"
              >
                View Plans
              </Button>
            </p>
          </div>
        </div>
      )}
    </Card>
  );
};

export default CreditManagement;
