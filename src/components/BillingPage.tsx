import React, { useEffect, useState } from "react";
import { useSubscription } from "../context/SubscriptionContext";
import {
  SUBSCRIPTION_PLANS,
  createCheckoutSession,
  redirectToCustomerPortal,
} from "../services/stripeService";
import {
  createStripeCheckout,
  handleCheckoutSuccess,
  handleCheckoutCancel,
  STRIPE_PRICE_IDS,
} from "../services/stripeCheckout";
import {
  CheckCircleIcon,
  XCircleIcon,
  ChartBarIcon,
  StarIcon,
  BoltIcon,
  ShieldCheckIcon,
  DocumentTextIcon,
  ClockIcon,
  CreditCardIcon,
  SparklesIcon,
  ChevronLeftIcon,
} from "./IconComponents";
import { Button, Card, Badge, StatCard, ProgressBar, GradientText } from "./ui/WorldClassComponents";
import { auth } from "../config/firebase";
import LoadingSpinner from "./LoadingSpinner";
import { motion, AnimatePresence } from "framer-motion";

interface BillingPageProps {
  onBackToApp?: () => void;
}

const BillingPage: React.FC<BillingPageProps> = ({ onBackToApp }) => {
  const { billingInfo, loading, refreshBilling } = useSubscription();
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [billingInterval, setBillingInterval] = useState<"monthly" | "yearly">("monthly");

  const user = auth.currentUser;

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const success = urlParams.get("success");
    const canceled = urlParams.get("canceled");
    const sessionId = urlParams.get("session_id");

    if (success) {
      handleCheckoutSuccess(sessionId || undefined);
      refreshBilling();
      const newUrl = window.location.pathname;
      window.history.replaceState({}, "", newUrl);
    }

    if (canceled) {
      handleCheckoutCancel();
      const newUrl = window.location.pathname;
      window.history.replaceState({}, "", newUrl);
    }
  }, [refreshBilling]);

  const handleUpgrade = async (planId: string) => {
    if (!user) return;

    const plan = SUBSCRIPTION_PLANS.find((p) => p.id === planId);
    if (!plan || !plan.stripePriceId) return;

    setIsProcessing(true);
    setSelectedPlan(planId);

    try {
      await createStripeCheckout({
        priceId: plan.stripePriceId,
        userId: user.uid,
        userEmail: user.email || "",
        metadata: {
          planId: planId,
          source: "billing_page",
        },
      });
    } catch (error: any) {
      console.error("Error upgrading:", error);
      alert("Error starting upgrade process. Please try again.");
    } finally {
      setIsProcessing(false);
      setSelectedPlan(null);
    }
  };

  const handleManageBilling = async () => {
    window.open(
      "https://billing.stripe.com/p/login/28E9AU9IJbTG9Ecb0Cbo400",
      "_blank",
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--surface-primary)] flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner />
          <p className="text-[var(--text-secondary)] mt-4">Loading billing information...</p>
        </div>
      </div>
    );
  }

  if (!billingInfo) {
    return (
      <div className="min-h-screen bg-[var(--surface-primary)] flex items-center justify-center p-4">
        <Card className="text-center max-w-md w-full">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="space-y-6"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-[var(--brand-primary)] to-[var(--brand-secondary)] rounded-2xl flex items-center justify-center mx-auto">
              <CreditCardIcon className="text-white text-2xl" />
            </div>
            <div>
              <h2 className="heading-3 mb-2">Sign Up Required</h2>
              <p className="body-base mb-6">
                To view billing information and manage your subscription, please
                create a free account and claim your 25 free AI credits.
              </p>
              <Button
                variant="primary"
                fullWidth
                onClick={() => {
                  window.dispatchEvent(new CustomEvent("showFreeCreditsPopup"));
                }}
                icon={<SparklesIcon />}
              >
                Claim Free Credits
              </Button>
              <p className="text-xs text-[var(--text-tertiary)] mt-3">
                🚀 Instant access • 🔒 No spam • ❌ Cancel anytime
              </p>
            </div>
          </motion.div>
        </Card>
      </div>
    );
  }

  const currentPlan = SUBSCRIPTION_PLANS.find(
    (p) => p.id === (billingInfo.subscription?.planId || "free"),
  )!;
  const usagePercentage =
    currentPlan.limits.generations === -1
      ? 0
      : (billingInfo.usage.generations / currentPlan.limits.generations) * 100;

  return (
    <div className="min-h-screen bg-[var(--surface-primary)]">
      <div className="px-6 md:px-12 lg:px-16 pt-8 pb-8 w-full max-w-screen-2xl mx-auto">
        {/* Premium Header with Back Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center justify-between mb-4">
            {onBackToApp && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <button
                  onClick={onBackToApp}
                  className="group flex items-center space-x-2 px-4 py-3 bg-[var(--surface-secondary)] hover:bg-[var(--surface-tertiary)] border border-[var(--border-primary)] hover:border-[var(--border-secondary)] rounded-xl text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  <ChevronLeftIcon className="text-lg group-hover:translate-x-[-2px] transition-transform duration-200" />
                  <span className="font-medium">Back to App</span>
                </button>
              </motion.div>
            )}
            <div className={`text-center ${onBackToApp ? 'flex-1' : 'w-full'}`}>
              <h1 className="heading-1">
                <GradientText>Manage Your Plan</GradientText>
              </h1>
            </div>
            {onBackToApp && <div className="w-[140px]"></div>}
          </div>
          <div className="text-center">
            <p className="body-large text-[var(--text-secondary)] max-w-2xl mx-auto">
              Control your subscription, monitor usage, and explore premium features.
            </p>
          </div>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        >
          <StatCard
            title="Current Plan"
            value={currentPlan.name}
            description={`$${currentPlan.price}/${currentPlan.interval}`}
            icon={<StarIcon />}
            changeType={currentPlan.id === "free" ? "neutral" : "positive"}
          />
          
          <StatCard
            title="Usage This Month"
            value={`${billingInfo.usage.generations}`}
            description={`of ${currentPlan.limits.generations === -1 ? "∞" : currentPlan.limits.generations} generations`}
            icon={<ChartBarIcon />}
            changeType={usagePercentage > 80 ? "negative" : "positive"}
          />
          
          <StatCard
            title="Account Status"
            value={billingInfo.status.charAt(0).toUpperCase() + billingInfo.status.slice(1)}
            description={billingInfo.status === "active" ? "All features unlocked" : "Limited access"}
            icon={billingInfo.status === "active" ? <CheckCircleIcon /> : <XCircleIcon />}
            changeType={billingInfo.status === "active" ? "positive" : "negative"}
          />
        </motion.div>

        {/* Usage Analytics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <Card padding="lg">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-[var(--surface-tertiary)]">
                  <BoltIcon className="text-[var(--brand-primary)]" />
                </div>
                <div>
                  <h3 className="heading-4">Usage Analytics</h3>
                  <p className="body-small text-[var(--text-secondary)]">
                    Monitor your creative output
                  </p>
                </div>
              </div>
              <Badge variant="neutral">
                Resets in {new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate() - new Date().getDate()} days
              </Badge>
            </div>

            <ProgressBar
              value={billingInfo.usage.generations}
              max={currentPlan.limits.generations === -1 ? 100 : currentPlan.limits.generations}
              label="AI Content Generations"
              color={usagePercentage > 90 ? "var(--color-error)" : usagePercentage > 70 ? "var(--color-warning)" : "var(--brand-primary)"}
              showLabel
            />

            <div className="flex justify-between text-sm mt-4">
              <span className="text-[var(--text-tertiary)]">
                Average: {Math.round(billingInfo.usage.generations / new Date().getDate())} per day
              </span>
              <span className={usagePercentage > 80 ? "text-[var(--color-warning-text)]" : "text-[var(--color-success-text)]"}>
                {currentPlan.limits.generations === -1
                  ? "Unlimited remaining"
                  : `${currentPlan.limits.generations - billingInfo.usage.generations} remaining`}
              </span>
            </div>

            {(usagePercentage > 80 || currentPlan.id === "free") && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mt-6 p-4 rounded-xl bg-gradient-to-r from-[var(--color-warning)]/10 to-[var(--color-warning)]/5 border border-[var(--color-warning)]/20"
              >
                <div className="flex items-start space-x-3">
                  <ClockIcon className="text-[var(--color-warning-text)] mt-1" />
                  <div>
                    <h4 className="font-semibold text-[var(--color-warning-text)] mb-1">
                      {usagePercentage > 80 ? "Approaching Your Limit" : "Ready to Scale Up?"}
                    </h4>
                    <p className="text-sm text-[var(--color-warning-text)]/80 mb-3">
                      {usagePercentage > 80
                        ? `You're using ${Math.round(usagePercentage)}% of your monthly quota. Upgrade now to keep creating without interruption.`
                        : "Unlock unlimited generations, premium templates, and advanced AI features."}
                    </p>
                    <Button 
                      variant="primary" 
                      size="sm"
                      onClick={() => handleUpgrade("pro")}
                    >
                      Upgrade Now
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </Card>
        </motion.div>

        {/* Subscription Plans */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-12"
        >
          {/* Enhanced Header with Purple Gradient Background */}
          <div className="text-center mb-12 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-blue-600/10 to-purple-700/15 rounded-3xl backdrop-blur-sm"></div>
            <div className="relative py-8 px-4">
              <h2 className="heading-1 mb-4">
                <GradientText>Choose Your Plan</GradientText>
              </h2>
              <p className="body-large text-[var(--text-secondary)] mb-8 max-w-3xl mx-auto">
                🚀 Start free, scale as you grow. No hidden fees, cancel anytime.
                <span className="block mt-2 bg-gradient-to-r from-purple-500 to-blue-600 bg-clip-text text-transparent font-semibold">
                  Join 50,000+ creators already transforming their content strategy
                </span>
              </p>

              {/* Enhanced Billing Toggle with Purple Gradients */}
              <div className="inline-flex items-center p-1.5 bg-gradient-to-r from-purple-900/20 to-blue-900/20 backdrop-blur-sm rounded-2xl border border-purple-500/30 shadow-lg">
                <button
                  type="button"
                  onClick={() => setBillingInterval("monthly")}
                  className={`px-8 py-3 rounded-xl font-semibold transition-all duration-300 ${
                    billingInterval === "monthly"
                      ? "bg-gradient-to-r from-purple-600 via-blue-600 to-purple-700 text-white shadow-lg transform scale-105"
                      : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-gradient-to-r hover:from-purple-500/10 hover:to-blue-500/10"
                  }`}
                >
                  Monthly
                </button>
                <button
                  type="button"
                  onClick={() => setBillingInterval("yearly")}
                  className={`px-8 py-3 rounded-xl font-semibold transition-all duration-300 relative ${
                    billingInterval === "yearly"
                      ? "bg-gradient-to-r from-purple-600 via-blue-600 to-purple-700 text-white shadow-lg transform scale-105"
                      : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-gradient-to-r hover:from-purple-500/10 hover:to-blue-500/10"
                  }`}
                >
                  Yearly
                  <Badge variant="success" size="sm" className="absolute -top-3 -right-3">
                    Save 20%
                  </Badge>
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6 xl:gap-8">
            {SUBSCRIPTION_PLANS.filter((plan) => {
              if (plan.id === "free") return true;
              return billingInterval === "yearly" ? plan.interval === "year" : plan.interval === "month";
            }).map((plan) => {
              const isCurrentPlan = plan.id === currentPlan.id;
              const isSelected = selectedPlan === plan.id;

              return (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{
                    y: plan.popular ? -8 : -4,
                    scale: plan.popular ? 1.02 : 1,
                  }}
                  className={`relative ${plan.popular ? 'z-10' : 'z-0'}`}
                >
                  {/* Creator Pro Special Purple Background Glow */}
                  {plan.popular && (
                    <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 via-blue-600 to-purple-700 rounded-2xl blur opacity-25"></div>
                  )}

                  <Card
                    className={`relative transition-all duration-500 ${
                      plan.popular
                        ? "ring-4 ring-purple-500/30 shadow-2xl bg-gradient-to-br from-purple-900/10 via-blue-900/10 to-purple-900/10 border-2 border-purple-500/30"
                        : isCurrentPlan
                          ? "ring-2 ring-[var(--color-success)]/20 shadow-lg overflow-hidden"
                          : "hover:shadow-lg hover:ring-2 hover:ring-purple-500/20 overflow-hidden"
                    }`}
                    padding="lg"
                  >
                    {/* Enhanced Popular Badge */}
                    {plan.popular && (
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-30 w-full flex justify-center">
                        <div className="relative">
                          <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-purple-700 text-white font-bold px-6 py-2 rounded-full text-sm shadow-xl border-2 border-white/30 backdrop-blur-sm">
                            <span className="flex items-center gap-1">
                              ⭐ <strong>Popular</strong>
                            </span>
                          </div>
                          {/* Glow effect */}
                          <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-blue-600 to-purple-700 rounded-full blur-sm opacity-50 -z-10"></div>
                        </div>
                      </div>
                    )}

                    {/* Plan Header */}
                    <div className="text-center mb-6">
                      <h3 className="heading-4 mb-2">{plan.name}</h3>
                      <p className="body-small text-[var(--text-secondary)] mb-4">
                        {plan.description}
                      </p>

                      <div className="mb-4">
                        {billingInterval === "yearly" && plan.interval === "year" ? (
                          <div>
                            <div className="mb-1">
                              <span className="text-4xl font-black text-[var(--text-primary)]">
                                ${Math.round(plan.price / 12)}
                              </span>
                              <span className="text-[var(--text-primary)] ml-1">/mo</span>
                            </div>
                            <div className="text-[var(--brand-primary)] font-medium text-sm">
                              Billed yearly (${plan.price})
                            </div>
                          </div>
                        ) : billingInterval === "monthly" && plan.interval === "month" ? (
                          <div>
                            <span className="text-4xl font-black text-[var(--text-primary)]">
                              ${plan.price}
                            </span>
                            {plan.price > 0 && (
                              <span className="text-[var(--text-secondary)] ml-1">
                                /{plan.interval}
                              </span>
                            )}
                          </div>
                        ) : null}
                      </div>
                    </div>

                    {/* Features */}
                    <ul className="space-y-3 mb-8">
                      {plan.features.slice(0, 6).map((feature, index) => (
                        <li key={index} className="flex items-center text-[var(--text-secondary)]">
                          <CheckCircleIcon className="text-[var(--brand-primary)] mr-3 flex-shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    {/* CTA Button */}
                    <div className="space-y-3">
                      {isCurrentPlan ? (
                        <>
                          <div className="w-full py-3 px-4 bg-[var(--color-success)]/10 border border-[var(--color-success)]/20 text-[var(--color-success-text)] rounded-xl font-medium text-center">
                            ✓ Your Current Plan
                          </div>
                          {billingInfo.subscription && (
                            <Button
                              variant="secondary"
                              fullWidth
                              onClick={handleManageBilling}
                              disabled={isProcessing}
                              icon={<CreditCardIcon />}
                            >
                              Manage Billing
                            </Button>
                          )}
                        </>
                      ) : (
                        <div className="space-y-2">
                          <Button
                            variant={plan.popular ? "primary" : "secondary"}
                            fullWidth
                            onClick={() => handleUpgrade(plan.id)}
                            disabled={isProcessing || plan.id === "free"}
                            loading={isSelected}
                            className={plan.popular ?
                              "bg-gradient-to-r from-purple-600 via-blue-600 to-purple-700 hover:from-purple-700 hover:via-blue-700 hover:to-purple-800 transform hover:scale-105 transition-all duration-300 shadow-lg font-bold text-lg py-4 border-none" :
                              "hover:bg-gradient-to-r hover:from-purple-500/10 hover:to-blue-500/10"
                            }
                          >
                            {plan.id === "free" ?
                              "🚀 Get Started Free" :
                              plan.popular ?
                                `Upgrade to ${plan.name}` :
                                `Upgrade to ${plan.name}`
                            }
                          </Button>
                          {plan.popular && (
                            <p className="text-xs text-[var(--text-tertiary)] text-center">
                              ⚡ 14-day money-back guarantee
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Credit Packs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-12"
        >
          <div className="text-center mb-8">
            <h2 className="heading-2 mb-4">
              <GradientText>Credit Packs</GradientText>
            </h2>
            <p className="body-base text-[var(--text-secondary)]">
              Need extra credits? Purchase one-time credit packs for additional content generation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: "Starter Pack", credits: 25, price: 3, color: "var(--color-success)" },
              { name: "Creator Pack", credits: 100, price: 8, color: "var(--brand-primary)" },
              { name: "Pro Pack", credits: 300, price: 19, color: "var(--brand-secondary)" },
              { name: "Studio Pack", credits: 750, price: 39, color: "var(--color-error)" },
            ].map((pack, index) => (
              <motion.div
                key={pack.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                whileHover={{ y: -4 }}
              >
                <Card
                  className={`text-center transition-all duration-300 ${
                    pack.popular ? "ring-2 ring-[var(--brand-primary)]/20" : ""
                  }`}
                  padding="lg"
                >
                  {pack.popular && (
                    <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                      <Badge variant="info" size="sm">Popular</Badge>
                    </div>
                  )}

                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4"
                    style={{ backgroundColor: `${pack.color}20`, color: pack.color }}
                  >
                    <span className="font-bold text-lg">{pack.credits}</span>
                  </div>

                  <h3 className="heading-5 mb-2">{pack.name}</h3>
                  <p className="body-small text-[var(--text-secondary)] mb-4">
                    Perfect for {pack.credits < 100 ? "small projects" : pack.credits < 300 ? "creators" : pack.credits < 500 ? "professionals" : "studios"}
                  </p>

                  <div className="mb-6">
                    <span className="text-3xl font-black text-[var(--text-primary)]">
                      ${pack.price}
                    </span>
                    <p className="text-sm font-medium mt-1" style={{ color: pack.color }}>
                      {pack.credits} Credits
                    </p>
                  </div>

                  <Button
                    variant="secondary"
                    fullWidth
                    className="hover:shadow-lg transition-all duration-300"
                    style={{
                      background: `linear-gradient(135deg, ${pack.color}20, ${pack.color}10)`,
                      borderColor: `${pack.color}30`,
                    }}
                  >
                    Buy Now
                  </Button>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Credit Pack Features */}
          <div className="text-center mt-8">
            <div className="flex flex-wrap justify-center items-center gap-8 text-[var(--text-tertiary)] text-sm">
              <div className="flex items-center gap-2">
                <CheckCircleIcon className="text-[var(--color-success)]" />
                <span>Credits never expire</span>
              </div>
              <div className="flex items-center gap-2">
                <ClockIcon className="text-[var(--color-success)]" />
                <span>Instant delivery</span>
              </div>
              <div className="flex items-center gap-2">
                <StarIcon className="text-[var(--color-success)]" />
                <span>Works with any plan</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <Card className="text-center" padding="lg">
            <ShieldCheckIcon className="text-[var(--color-success)] text-2xl mx-auto mb-3" />
            <h4 className="heading-5 mb-2">Secure Payments</h4>
            <p className="body-small text-[var(--text-secondary)]">
              All payments processed securely through Stripe with 256-bit SSL encryption
            </p>
          </Card>

          <Card className="text-center" padding="lg">
            <DocumentTextIcon className="text-[var(--brand-primary)] text-2xl mx-auto mb-3" />
            <h4 className="heading-5 mb-2">No Hidden Fees</h4>
            <p className="body-small text-[var(--text-secondary)]">
              Transparent pricing with no setup fees, hidden charges, or surprise costs
            </p>
          </Card>

          <Card className="text-center" padding="lg">
            <ClockIcon className="text-[var(--brand-secondary)] text-2xl mx-auto mb-3" />
            <h4 className="heading-5 mb-2">Instant Activation</h4>
            <p className="body-small text-[var(--text-secondary)]">
              Upgrades take effect immediately - start creating with premium features right away
            </p>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default BillingPage;
