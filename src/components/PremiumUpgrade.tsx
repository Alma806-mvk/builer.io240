import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Button, 
  Card, 
  Badge, 
  Modal, 
  GradientText,
  StatCard
} from "./ui/WorldClassComponents";
import {
  SparklesIcon,
  StarIcon,
  CheckCircleIcon,
  ShieldCheckIcon,
  BoltIcon,
  ClockIcon,
  XMarkIcon,
} from "./IconComponents";

interface PremiumUpgradeProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgrade: (plan: "pro" | "enterprise") => void;
  currentPlan?: "free" | "pro" | "enterprise";
}

interface PricingPlan {
  id: "free" | "pro" | "enterprise";
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  highlighted?: boolean;
  buttonText: string;
  savings?: string;
  color: string;
}

export const PremiumUpgrade: React.FC<PremiumUpgradeProps> = ({
  isOpen,
  onClose,
  onUpgrade,
  currentPlan = "free",
}) => {
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">("monthly");

  const pricingPlans: PricingPlan[] = [
    {
      id: "free",
      name: "Free",
      price: "$0",
      period: "forever",
      description: "Perfect for getting started with basic features",
      features: [
        "5 AI generations per month",
        "Basic templates",
        "Standard export formats",
        "Community support",
        "Basic analytics",
      ],
      buttonText: "Current Plan",
      color: "var(--gray-500)",
    },
    {
      id: "pro",
      name: "Pro",
      price: billingPeriod === "monthly" ? "$29" : "$290",
      period: billingPeriod === "monthly" ? "/month" : "/year",
      description: "Advanced features for creators and professionals",
      features: [
        "Unlimited AI generations",
        "Premium templates library",
        "Advanced AI personas",
        "Priority support",
        "Advanced analytics",
        "Custom branding",
        "Export to all formats",
        "Collaboration tools",
        "API access",
      ],
      highlighted: true,
      buttonText: "Upgrade to Pro",
      savings: billingPeriod === "yearly" ? "Save $58/year" : undefined,
      color: "var(--brand-primary)",
    },
    {
      id: "enterprise",
      name: "Enterprise",
      price: billingPeriod === "monthly" ? "$99" : "$990",
      period: billingPeriod === "monthly" ? "/month" : "/year",
      description: "Complete solution for teams and organizations",
      features: [
        "Everything in Pro",
        "Unlimited team members",
        "SSO integration",
        "Dedicated account manager",
        "Custom AI models",
        "White-label options",
        "Advanced security",
        "Priority development",
        "Custom integrations",
      ],
      buttonText: "Contact Sales",
      savings: billingPeriod === "yearly" ? "Save $198/year" : undefined,
      color: "var(--brand-secondary)",
    },
  ];

  const benefits = [
    {
      icon: <BoltIcon />,
      title: "AI-Powered Generation",
      description: "Advanced AI models for superior content quality and creativity",
      color: "var(--color-warning)",
    },
    {
      icon: <SparklesIcon />,
      title: "Premium Templates",
      description: "Access to professionally designed templates and personas",
      color: "var(--brand-primary)",
    },
    {
      icon: <ShieldCheckIcon />,
      title: "Priority Support",
      description: "Get help when you need it with dedicated customer success",
      color: "var(--color-success)",
    },
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Content Creator",
      avatar: "👩‍💼",
      text: "CreateGen Studio transformed my content creation process. The AI is incredibly accurate and saves me hours every week.",
      rating: 5,
    },
    {
      name: "Marcus Rodriguez",
      role: "Marketing Director",
      avatar: "👨‍💼", 
      text: "The premium templates and analytics helped us increase engagement by 300%. Worth every penny.",
      rating: 5,
    },
    {
      name: "Elena Volkov",
      role: "Agency Owner",
      avatar: "👩‍💻",
      text: "Enterprise features like team collaboration and white-labeling make this perfect for client work.",
      rating: 5,
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-[var(--surface-overlay)] backdrop-blur-sm" />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-7xl max-h-[95vh] overflow-y-auto bg-[var(--surface-primary)] border border-[var(--border-primary)] rounded-3xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="relative p-8 bg-gradient-to-r from-[var(--brand-primary)]/10 via-[var(--brand-secondary)]/10 to-[var(--accent-cyan)]/10 border-b border-[var(--border-primary)]">
              <button
                onClick={onClose}
                className="absolute top-6 right-6 p-2 rounded-lg hover:bg-[var(--surface-secondary)] transition-colors"
              >
                <XMarkIcon className="text-[var(--text-secondary)]" />
              </button>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="text-center max-w-3xl mx-auto"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[var(--brand-primary)] to-[var(--brand-secondary)] rounded-2xl mb-6">
                  <SparklesIcon className="text-white text-2xl" />
                </div>
                <h1 className="heading-1 mb-4">
                  <GradientText>Unlock Premium Features</GradientText>
                </h1>
                <p className="body-large text-[var(--text-secondary)]">
                  Join thousands of creators who've supercharged their content with our premium AI tools
                </p>
              </motion.div>
            </div>

            {/* Billing Toggle */}
            <div className="px-8 pt-8">
              <div className="flex items-center justify-center mb-8">
                <div className="flex items-center p-1 bg-[var(--surface-secondary)] rounded-xl border border-[var(--border-primary)]">
                  <button
                    onClick={() => setBillingPeriod("monthly")}
                    className={`px-6 py-3 rounded-lg font-medium transition-all ${
                      billingPeriod === "monthly"
                        ? "bg-[var(--brand-primary)] text-white shadow-lg"
                        : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                    }`}
                  >
                    Monthly
                  </button>
                  <button
                    onClick={() => setBillingPeriod("yearly")}
                    className={`px-6 py-3 rounded-lg font-medium transition-all relative ${
                      billingPeriod === "yearly"
                        ? "bg-[var(--brand-primary)] text-white shadow-lg"
                        : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                    }`}
                  >
                    Yearly
                    {billingPeriod === "yearly" && (
                      <Badge variant="success" size="sm" className="absolute -top-2 -right-2">
                        Save 20%
                      </Badge>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Pricing Cards */}
            <div className="px-8 pb-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {pricingPlans.map((plan, index) => {
                  const isCurrentPlan = plan.id === currentPlan;

                  return (
                    <motion.div
                      key={plan.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * index }}
                      whileHover={{ y: -4 }}
                      className="relative"
                    >
                      <Card
                        className={`relative overflow-hidden transition-all duration-300 ${
                          plan.highlighted
                            ? "ring-2 ring-[var(--brand-primary)]/20 shadow-xl scale-105"
                            : isCurrentPlan
                              ? "ring-2 ring-[var(--color-success)]/20"
                              : ""
                        }`}
                        padding="lg"
                      >
                        {/* Popular Badge */}
                        {plan.highlighted && (
                          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                            <Badge variant="info">Most Popular</Badge>
                          </div>
                        )}

                        {/* Current Plan Badge */}
                        {isCurrentPlan && (
                          <div className="absolute -top-3 right-6">
                            <Badge variant="success" size="sm">Current</Badge>
                          </div>
                        )}

                        {/* Plan Header */}
                        <div className="text-center mb-6">
                          <div
                            className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4"
                            style={{ backgroundColor: `${plan.color}20`, color: plan.color }}
                          >
                            <StarIcon />
                          </div>
                          <h3 className="heading-4 mb-2">{plan.name}</h3>
                          <p className="body-small text-[var(--text-secondary)] mb-4">
                            {plan.description}
                          </p>

                          <div className="mb-4">
                            <span className="text-4xl font-black text-[var(--text-primary)]">
                              {plan.price}
                            </span>
                            <span className="text-[var(--text-secondary)] ml-1">
                              {plan.period}
                            </span>
                            {plan.savings && (
                              <div className="mt-1">
                                <span className="text-[var(--color-success-text)] text-sm font-semibold">
                                  {plan.savings}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Features */}
                        <ul className="space-y-3 mb-8">
                          {plan.features.map((feature, featureIndex) => (
                            <li key={featureIndex} className="flex items-center text-[var(--text-secondary)]">
                              <CheckCircleIcon 
                                className="flex-shrink-0 mr-3"
                                style={{ color: plan.color }}
                              />
                              <span className="text-sm">{feature}</span>
                            </li>
                          ))}
                        </ul>

                        {/* CTA Button */}
                        {isCurrentPlan ? (
                          <div className="w-full py-3 px-4 bg-[var(--color-success)]/10 border border-[var(--color-success)]/20 text-[var(--color-success-text)] rounded-xl font-medium text-center">
                            ✓ Your Current Plan
                          </div>
                        ) : (
                          <Button
                            variant={plan.highlighted ? "primary" : "secondary"}
                            fullWidth
                            onClick={() => {
                              if (plan.id !== "free") {
                                onUpgrade(plan.id as "pro" | "enterprise");
                              }
                            }}
                          >
                            {plan.buttonText}
                          </Button>
                        )}
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Benefits Section */}
            <div className="px-8 pb-8">
              <div className="text-center mb-8">
                <h2 className="heading-2 mb-4">
                  <GradientText>Why Choose Premium?</GradientText>
                </h2>
                <p className="body-base text-[var(--text-secondary)]">
                  Unlock the full potential of AI-powered content creation
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + 0.1 * index }}
                  >
                    <Card className="text-center" padding="lg">
                      <div
                        className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
                        style={{ backgroundColor: `${benefit.color}20`, color: benefit.color }}
                      >
                        <div className="text-2xl">{benefit.icon}</div>
                      </div>
                      <h3 className="heading-5 mb-3">{benefit.title}</h3>
                      <p className="body-small text-[var(--text-secondary)]">
                        {benefit.description}
                      </p>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Testimonials */}
            <div className="px-8 pb-8">
              <div className="text-center mb-8">
                <h2 className="heading-2 mb-4">
                  <GradientText>Loved by Creators</GradientText>
                </h2>
                <p className="body-base text-[var(--text-secondary)]">
                  See what our community is saying
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {testimonials.map((testimonial, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + 0.1 * index }}
                  >
                    <Card padding="lg">
                      <div className="flex items-center space-x-3 mb-4">
                        <span className="text-2xl">{testimonial.avatar}</span>
                        <div>
                          <h4 className="font-semibold text-[var(--text-primary)]">
                            {testimonial.name}
                          </h4>
                          <p className="text-[var(--text-tertiary)] text-sm">
                            {testimonial.role}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center mb-3">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <StarIcon 
                            key={i} 
                            className="text-yellow-400 text-sm"
                          />
                        ))}
                      </div>
                      <p className="text-[var(--text-secondary)] text-sm italic">
                        "{testimonial.text}"
                      </p>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Money Back Guarantee */}
            <div className="px-8 pb-8">
              <Card className="text-center bg-gradient-to-r from-[var(--color-success)]/10 to-[var(--color-info)]/10 border-[var(--color-success)]/20">
                <div className="flex items-center justify-center space-x-4">
                  <ShieldCheckIcon className="text-[var(--color-success)] text-3xl" />
                  <div>
                    <h3 className="heading-5 mb-1">30-Day Money Back Guarantee</h3>
                    <p className="body-small text-[var(--text-secondary)]">
                      Try premium risk-free. Not satisfied? Get a full refund within 30 days.
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
