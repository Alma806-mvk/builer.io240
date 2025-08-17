import React from "react";
import { motion } from "framer-motion";
import { useSubscription } from "../context/SubscriptionContext";
import {
  SUBSCRIPTION_PLANS,
  createCheckoutSession,
} from "../services/stripeService";
import {
  SparklesIcon,
  StarIcon,
  CheckCircleIcon,
  BoltIcon,
  LockClosedIcon,
  ClockIcon,
  ShieldCheckIcon,
} from "./IconComponents";
import { Button, Card, Badge, GradientText, StatCard } from "./ui/WorldClassComponents";
import { auth } from "../config/firebase";

interface PaywallProps {
  feature?: string;
  className?: string;
}

const Paywall: React.FC<PaywallProps> = ({ feature, className = "" }) => {
  const { billingInfo } = useSubscription();
  const user = auth.currentUser;

  const handleUpgrade = async (planId: string) => {
    if (!user) return;

    const plan = SUBSCRIPTION_PLANS.find((p) => p.id === planId);
    if (!plan || !plan.stripePriceId) return;

    try {
      await createCheckoutSession(plan.stripePriceId, user.uid);
    } catch (error: any) {
      console.error("Error upgrading:", error);

      if (
        error?.message?.includes("INTERNAL") ||
        error?.code === "internal" ||
        error?.toString?.().includes("INTERNAL")
      ) {
        console.log("🚀 Payment system is being configured. Demo mode active.");
      } else {
        alert("Error starting upgrade process. Please try again.");
      }
    }
  };

  const getFeatureConfig = () => {
    switch (feature) {
      case "generations":
        return {
          title: "Generation Limit Reached",
          description: "You've used all your AI generations for this month. Upgrade to continue creating amazing content without limits.",
          icon: <SparklesIcon className="text-[var(--color-warning)]" />,
          color: "var(--color-warning)",
          urgency: "high",
        };
      case "canvas":
        return {
          title: "Visual Canvas - Pro Feature",
          description: "Create stunning visual content with our advanced canvas tools, professional templates, and collaboration features.",
          icon: <StarIcon className="text-[var(--brand-secondary)]" />,
          color: "var(--brand-secondary)",
          urgency: "medium",
        };
      case "templates":
        return {
          title: "Premium Templates",
          description: "Access our library of professionally designed templates and AI personas to create standout content.",
          icon: <BoltIcon className="text-[var(--brand-primary)]" />,
          color: "var(--brand-primary)",
          urgency: "medium",
        };
      default:
        return {
          title: "Premium Feature",
          description: "This powerful feature is available with our premium plans. Upgrade to unlock advanced AI capabilities and professional tools.",
          icon: <LockClosedIcon className="text-[var(--accent-cyan)]" />,
          color: "var(--accent-cyan)",
          urgency: "low",
        };
    }
  };

  const { title, description, icon, color, urgency } = getFeatureConfig();

  const currentPlan = billingInfo 
    ? SUBSCRIPTION_PLANS.find((p) => p.id === (billingInfo.subscription?.planId || "free"))
    : SUBSCRIPTION_PLANS.find((p) => p.id === "free");

  const availablePlans = SUBSCRIPTION_PLANS.filter((plan) => plan.id !== "free");

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`relative ${className}`}
    >
      <Card className="text-center glass-effect" padding="lg">
        {/* Urgency Indicator */}
        {urgency === "high" && (
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="absolute -top-3 left-1/2 transform -translate-x-1/2"
          >
            <Badge variant="warning" className="animate-pulse">
              <ClockIcon className="mr-1" />
              Limit Reached
            </Badge>
          </motion.div>
        )}

        {/* Header */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-8"
        >
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
            style={{ backgroundColor: `${color}20`, color }}
          >
            <div className="text-3xl">{icon}</div>
          </div>

          <h2 className="heading-2 mb-4">
            <GradientText>{title}</GradientText>
          </h2>
          <p className="body-base text-[var(--text-secondary)] max-w-md mx-auto">
            {description}
          </p>
        </motion.div>

        {/* Current Plan Status */}
        {billingInfo && currentPlan && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <Card className="bg-[var(--surface-tertiary)]" padding="sm">
              <div className="flex items-center justify-between">
                <div className="text-left">
                  <p className="text-sm font-medium text-[var(--text-primary)]">
                    Current Plan: <span className="text-[var(--brand-primary)]">{currentPlan.name}</span>
                  </p>
                  {feature === "generations" && (
                    <p className="text-xs text-[var(--text-tertiary)] mt-1">
                      Used: {billingInfo.usage.generations} / {currentPlan.limits.generations === -1 ? "∞" : currentPlan.limits.generations} this month
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <span className="text-lg font-bold text-[var(--text-primary)]">
                    ${currentPlan.price}
                  </span>
                  <span className="text-[var(--text-tertiary)] text-sm">
                    /{currentPlan.interval}
                  </span>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Plan Comparison */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-8"
        >
          {availablePlans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              whileHover={{ y: -2 }}
              className="relative"
            >
              <Card
                className={`text-left transition-all duration-300 ${
                  plan.popular
                    ? "ring-2 ring-[var(--brand-primary)]/20 shadow-xl"
                    : "hover:shadow-lg"
                }`}
                padding="lg"
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute -top-3 left-6">
                    <Badge variant="info">
                      <StarIcon className="mr-1" />
                      Most Popular
                    </Badge>
                  </div>
                )}

                {/* Plan Header */}
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="heading-4 mb-1">{plan.name}</h3>
                    <p className="body-small text-[var(--text-secondary)]">
                      {plan.description}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-bold text-[var(--text-primary)]">
                      ${plan.price}
                    </span>
                    <span className="text-[var(--text-tertiary)] block text-sm">
                      /{plan.interval}
                    </span>
                  </div>
                </div>

                {/* Key Features */}
                <ul className="space-y-2 mb-6">
                  {plan.features.slice(0, 5).map((feature, featureIndex) => (
                    <li
                      key={featureIndex}
                      className="flex items-center text-sm text-[var(--text-secondary)]"
                    >
                      <CheckCircleIcon className="text-[var(--color-success)] mr-2 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                  {plan.features.length > 5 && (
                    <li className="text-sm text-[var(--text-tertiary)] italic">
                      + {plan.features.length - 5} more features
                    </li>
                  )}
                </ul>

                {/* CTA Button */}
                <Button
                  variant={plan.popular ? "primary" : "secondary"}
                  fullWidth
                  onClick={() => handleUpgrade(plan.id)}
                  icon={plan.popular ? <SparklesIcon /> : undefined}
                >
                  {plan.id === "enterprise" ? "Contact Sales" : `Upgrade to ${plan.name}`}
                </Button>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Features Highlight */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          <div className="text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-[var(--brand-primary)] to-[var(--brand-secondary)] rounded-xl flex items-center justify-center mx-auto mb-3">
              <BoltIcon className="text-white" />
            </div>
            <h4 className="font-semibold text-[var(--text-primary)] mb-2">
              Unlimited Power
            </h4>
            <p className="text-sm text-[var(--text-secondary)]">
              No limits on generations, templates, or features
            </p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-[var(--accent-emerald)] to-[var(--accent-cyan)] rounded-xl flex items-center justify-center mx-auto mb-3">
              <SparklesIcon className="text-white" />
            </div>
            <h4 className="font-semibold text-[var(--text-primary)] mb-2">
              Premium Quality
            </h4>
            <p className="text-sm text-[var(--text-secondary)]">
              Access to advanced AI models and professional tools
            </p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-[var(--color-warning)] to-[var(--color-error)] rounded-xl flex items-center justify-center mx-auto mb-3">
              <ShieldCheckIcon className="text-white" />
            </div>
            <h4 className="font-semibold text-[var(--text-primary)] mb-2">
              Priority Support
            </h4>
            <p className="text-sm text-[var(--text-secondary)]">
              Get help when you need it with dedicated support
            </p>
          </div>
        </motion.div>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex flex-wrap justify-center items-center gap-6 text-[var(--text-tertiary)] text-sm"
        >
          <div className="flex items-center gap-2">
            <ShieldCheckIcon className="text-[var(--color-success)]" />
            <span>30-day money-back guarantee</span>
          </div>
          <div className="flex items-center gap-2">
            <ClockIcon className="text-[var(--brand-primary)]" />
            <span>Cancel anytime</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircleIcon className="text-[var(--color-info)]" />
            <span>Instant activation</span>
          </div>
        </motion.div>
      </Card>
    </motion.div>
  );
};

export default Paywall;
