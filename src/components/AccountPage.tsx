import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useSubscription } from "../context/SubscriptionContext";
import { AuthService } from "../services/authService";
import { SUBSCRIPTION_PLANS } from "../services/stripeService";
import {
  EnvelopeIcon,
  CalendarDaysIcon,
  CheckCircleIcon,
  XCircleIcon,
  ChartBarIcon,
  KeyIcon,
  ExclamationTriangleIcon,
  ShieldCheckIcon,
  SparklesIcon,
  ClockIcon,
  RefreshIcon,
} from "./IconComponents";
import {
  UserIcon,
  CreditCardIcon,
} from "./ProfessionalIcons";
import LoadingSpinner from "./LoadingSpinner";
import EmailVerificationPrompt from "./EmailVerificationPrompt";
import CreditManagement from "./CreditManagement";
import EnhancedThemeToggle from "./EnhancedThemeToggle";

// Import new design system components
import {
  Button,
  Card,
  Input,
  Badge,
  StatCard,
  ProgressBar,
  TabHeader,
  GradientText,
  LoadingSpinner as WorldClassSpinner,
} from "./ui/WorldClassComponents";

interface AccountPageProps {
  onNavigateToBilling: () => void;
}

const AccountPage: React.FC<AccountPageProps> = ({ onNavigateToBilling }) => {
  const { user, isEmailVerified, refreshUser } = useAuth();
  const { billingInfo, loading: subscriptionLoading } = useSubscription();
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [isUpdatingDisplayName, setIsUpdatingDisplayName] = useState(false);
  const [displayNameSuccess, setDisplayNameSuccess] = useState("");
  const [displayNameError, setDisplayNameError] = useState("");

  if (!user) {
    return (
      <div className="min-h-screen bg-[var(--background-primary)] flex items-center justify-center">
        <div className="text-[var(--text-primary)]">Please sign in to view your account.</div>
      </div>
    );
  }

  const currentPlan =
    SUBSCRIPTION_PLANS.find(
      (p) => p.id === (billingInfo?.subscription?.planId || "free"),
    ) || SUBSCRIPTION_PLANS[0];

  const usagePercentage =
    currentPlan.limits.generations === -1
      ? 0
      : ((billingInfo?.usage?.generations || 0) /
          currentPlan.limits.generations) *
        100;

  const handleDisplayNameUpdate = async () => {
    if (!displayName.trim()) {
      setDisplayNameError("Display name cannot be empty");
      return;
    }

    setIsUpdatingDisplayName(true);
    setDisplayNameError("");
    setDisplayNameSuccess("");

    try {
      await AuthService.updateProfile({ displayName: displayName.trim() });
      await refreshUser(); // Refresh the user context
      setDisplayNameSuccess("Display name updated successfully!");
    } catch (error: any) {
      setDisplayNameError(AuthService.getErrorMessage(error));
    } finally {
      setIsUpdatingDisplayName(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError("New passwords don't match.");
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters long.");
      return;
    }

    setIsUpdatingProfile(true);
    try {
      await AuthService.changePassword(
        passwordForm.currentPassword,
        passwordForm.newPassword,
      );
      setPasswordSuccess("Password updated successfully!");
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setIsChangingPassword(false);
    } catch (error: any) {
      setPasswordError(AuthService.getErrorMessage(error));
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const formatDate = (date: any) => {
    if (!date) return "N/A";
    const d = date.toDate ? date.toDate() : new Date(date);
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge variant="success" icon={<CheckCircleIcon />}>Pro Active</Badge>;
      case "canceled":
        return <Badge variant="error" icon={<XCircleIcon />}>Canceled</Badge>;
      default:
        return (
          <div className="flex items-center space-x-2">
            <Badge variant="neutral">Free Plan</Badge>
            <Button
              variant="primary"
              size="sm"
              onClick={() =>
                window.open(
                  "https://billing.stripe.com/p/login/28E9AU9IJbTG9Ecb0Cbo400",
                  "_blank",
                )
              }
            >
              UPGRADE
            </Button>
          </div>
        );
    }
  };

  const isPremium = currentPlan.id !== "free";

  return (
    <div className="min-h-screen bg-[var(--background-primary)] relative overflow-hidden">
      {/* Premium Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--brand-primary)]/5 via-transparent to-[var(--brand-secondary)]/5"></div>
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[var(--brand-primary)]/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[var(--brand-secondary)]/10 rounded-full blur-3xl animate-pulse delay-1000"></div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Premium Header using TabHeader */}
          <TabHeader
            title="Account Center"
            subtitle="Manage your premium experience"
            icon={<UserIcon />}
            badge={isPremium ? "Pro" : "Free"}
            actions={
              <div className="flex items-center space-x-3">
                {getStatusBadge(billingInfo?.status || "free")}
              </div>
            }
          />

          {/* Email Verification Banner */}
          {!isEmailVerified && (
            <div className="mb-8">
              <EmailVerificationPrompt />
            </div>
          )}

          {/* Main Grid Layout */}
          <div className="space-y-8">
            {/* Top Section - Profile & Security */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {/* Profile Information Card */}
              <Card variant="hover" className="group">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-[var(--brand-primary)] to-[var(--brand-secondary)] text-white">
                    <UserIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="heading-3">Profile Information</h2>
                    <p className="body-small">Your personal account details</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      label="Display Name"
                      value={displayName}
                      onChange={setDisplayName}
                      placeholder="Enter your display name"
                      error={displayNameError}
                      className="flex-1"
                    />
                    <div className="pt-6">
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={handleDisplayNameUpdate}
                        loading={isUpdatingDisplayName}
                        disabled={displayName === (user?.displayName || "")}
                      >
                        Save
                      </Button>
                    </div>
                  </div>

                  {displayNameSuccess && (
                    <div className="p-3 bg-[var(--color-success)]/20 border border-[var(--color-success)]/30 rounded-lg">
                      <span className="text-[var(--color-success-text)] text-sm">{displayNameSuccess}</span>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        value={user.email || ""}
                        className="input-base opacity-80"
                        readOnly
                      />
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        {isEmailVerified ? (
                          <Badge variant="success" size="sm" icon={<CheckCircleIcon />}>
                            Verified
                          </Badge>
                        ) : (
                          <Badge variant="warning" size="sm" icon={<ExclamationTriangleIcon />}>
                            Pending
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                        Account Created
                      </label>
                      <div className="flex items-center gap-2 px-3 py-2 bg-[var(--surface-tertiary)] border border-[var(--border-primary)] rounded-lg">
                        <CalendarDaysIcon className="w-4 h-4 text-[var(--brand-primary)]" />
                        <span className="text-[var(--text-primary)] text-sm">
                          {formatDate(user.metadata?.creationTime)}
                        </span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                        Last Sign In
                      </label>
                      <div className="flex items-center gap-2 px-3 py-2 bg-[var(--surface-tertiary)] border border-[var(--border-primary)] rounded-lg">
                        <div className="w-2 h-2 bg-[var(--color-success)] rounded-full animate-pulse"></div>
                        <span className="text-[var(--text-primary)] text-sm">
                          {formatDate(user.metadata?.lastSignInTime)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Security Settings Card */}
              <Card variant="hover" className="group">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                    <ShieldCheckIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="heading-3">Security & Privacy</h2>
                    <p className="body-small">Protect your account with advanced security</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-[var(--text-primary)] mb-3">
                      Authentication Methods
                    </label>
                    <div className="flex flex-wrap gap-3">
                      {user.providerData.map((provider, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-3 px-4 py-3 bg-[var(--surface-tertiary)] border border-[var(--border-primary)] rounded-xl"
                        >
                          {provider.providerId === "password" ? (
                            <>
                              <EnvelopeIcon className="w-5 h-5 text-[var(--brand-primary)]" />
                              <span className="text-[var(--text-primary)] font-medium">
                                Email & Password
                              </span>
                              <Badge variant="success" size="sm">SECURE</Badge>
                            </>
                          ) : provider.providerId === "google.com" ? (
                            <>
                              <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center">
                                <span className="text-blue-600 text-xs font-bold">G</span>
                              </div>
                              <span className="text-[var(--text-primary)] font-medium">Google</span>
                              <Badge variant="info" size="sm">OAUTH</Badge>
                            </>
                          ) : (
                            <span className="text-[var(--text-primary)]">{provider.providerId}</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {user.providerData.some((p) => p.providerId === "password") && (
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <label className="block text-sm font-semibold text-[var(--text-primary)]">
                          Password Management
                        </label>
                        <Button
                          variant={isChangingPassword ? "secondary" : "primary"}
                          onClick={() => setIsChangingPassword(!isChangingPassword)}
                        >
                          {isChangingPassword ? "Cancel" : "Change Password"}
                        </Button>
                      </div>

                      {isChangingPassword && (
                        <form
                          onSubmit={handlePasswordChange}
                          className="space-y-4 p-6 bg-[var(--surface-secondary)] border border-[var(--border-primary)] rounded-xl"
                        >
                          <Input
                            type="password"
                            placeholder="Current password"
                            value={passwordForm.currentPassword}
                            onChange={(value) =>
                              setPasswordForm({
                                ...passwordForm,
                                currentPassword: value,
                              })
                            }
                          />
                          <Input
                            type="password"
                            placeholder="New password"
                            value={passwordForm.newPassword}
                            onChange={(value) =>
                              setPasswordForm({
                                ...passwordForm,
                                newPassword: value,
                              })
                            }
                          />
                          <Input
                            type="password"
                            placeholder="Confirm new password"
                            value={passwordForm.confirmPassword}
                            onChange={(value) =>
                              setPasswordForm({
                                ...passwordForm,
                                confirmPassword: value,
                              })
                            }
                          />

                          {passwordError && (
                            <div className="p-3 bg-[var(--color-error)]/20 border border-[var(--color-error)]/30 rounded-xl">
                              <span className="text-[var(--color-error-text)] text-sm">{passwordError}</span>
                            </div>
                          )}
                          {passwordSuccess && (
                            <div className="p-3 bg-[var(--color-success)]/20 border border-[var(--color-success)]/30 rounded-xl">
                              <span className="text-[var(--color-success-text)] text-sm">{passwordSuccess}</span>
                            </div>
                          )}

                          <Button
                            type="submit"
                            variant="primary"
                            fullWidth
                            loading={isUpdatingProfile}
                          >
                            Update Password
                          </Button>
                        </form>
                      )}
                    </div>
                  )}

                  {/* Enhanced Theme Settings Section */}
                  <div>
                    <EnhancedThemeToggle variant="full" showLabel={true} />
                  </div>
                </div>
              </Card>
            </div>

            {/* Subscription Section */}
            <Card variant="hover">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500 to-sky-500 text-white">
                    <CreditCardIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="heading-3">Subscription & Plan</h2>
                    <p className="body-small">Your plan, billing & features</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    window.open(
                      "https://billing.stripe.com/p/login/28E9AU9IJbTG9Ecb0Cbo400",
                      "_blank",
                    )
                  }
                >
                  Manage Billing
                </Button>
              </div>

              {subscriptionLoading ? (
                <div className="flex items-center justify-center py-12">
                  <WorldClassSpinner />
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-1">
                    <div className="p-6 bg-[var(--surface-tertiary)] border border-[var(--border-primary)] rounded-xl">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <div className="text-2xl font-bold text-[var(--text-primary)] mb-1">
                            {currentPlan.name}
                          </div>
                          <div className="text-[var(--text-secondary)]">
                            {currentPlan.price > 0
                              ? `$${currentPlan.price}/${currentPlan.interval}`
                              : "Free Forever"}
                          </div>
                        </div>
                        {getStatusBadge(billingInfo?.status || "free")}
                      </div>

                      {!isPremium && (
                        <div className="mt-4 p-4 bg-gradient-to-r from-[var(--brand-primary)]/10 to-[var(--brand-secondary)]/10 border border-[var(--brand-primary)]/20 rounded-xl">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-2 h-2 bg-[var(--brand-primary)] rounded-full animate-pulse"></div>
                            <GradientText className="font-semibold text-sm">Upgrade to Pro</GradientText>
                          </div>
                          <p className="text-[var(--text-secondary)] text-sm mb-3">
                            Unlock unlimited generations, advanced features, and priority support
                          </p>
                          <Button
                            variant="primary"
                            fullWidth
                            onClick={() =>
                              window.open(
                                "https://billing.stripe.com/p/login/28E9AU9IJbTG9Ecb0Cbo400",
                                "_blank",
                              )
                            }
                          >
                            Upgrade Now
                          </Button>
                        </div>
                      )}

                      {billingInfo?.subscription && (
                        <div className="mt-4 p-4 bg-[var(--surface-secondary)] border border-[var(--border-primary)] rounded-xl">
                          <label className="block text-sm font-semibold text-[var(--text-primary)] mb-2">
                            Next Billing Date
                          </label>
                          <div className="flex items-center gap-3">
                            <CalendarDaysIcon className="w-5 h-5 text-emerald-400" />
                            <span className="text-[var(--text-primary)] font-medium">
                              {formatDate(billingInfo.subscription.currentPeriodEnd)}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="lg:col-span-2">
                    <div>
                      <label className="block text-sm font-semibold text-[var(--text-primary)] mb-4">
                        Plan Features
                      </label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {currentPlan.features.map((feature, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-3 p-3 rounded-lg bg-[var(--surface-tertiary)] hover:bg-[var(--surface-quaternary)] transition-colors"
                          >
                            <CheckCircleIcon className="w-4 h-4 text-[var(--color-success)] flex-shrink-0" />
                            <span className="text-[var(--text-secondary)] text-sm">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </Card>

            {/* Bottom Section - Usage Analytics and Credit Management Side by Side */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Usage Analytics Card */}
              <Card variant="hover">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 text-white">
                    <ChartBarIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="heading-4">Usage Analytics</h2>
                    <p className="body-small">Track your consumption & activity</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label className="text-sm font-semibold text-[var(--text-primary)]">
                        AI Generations This Month
                      </label>
                      <div className="text-right">
                        <div className="text-lg font-bold text-[var(--text-primary)]">
                          {billingInfo?.usage?.generations || 0}
                        </div>
                        <div className="text-xs text-[var(--text-tertiary)]">
                          of{" "}
                          {currentPlan.limits.generations === -1
                            ? "∞"
                            : currentPlan.limits.generations}
                        </div>
                      </div>
                    </div>

                    <ProgressBar
                      value={usagePercentage}
                      color={
                        usagePercentage > 90
                          ? "var(--color-error)"
                          : usagePercentage > 70
                            ? "var(--color-warning)"
                            : "var(--color-success)"
                      }
                    />

                    {usagePercentage > 80 && currentPlan.id === "free" && (
                      <div className="mt-3 p-3 bg-[var(--color-warning)]/10 border border-[var(--color-warning)]/20 rounded-xl">
                        <div className="flex items-center gap-2">
                          <ExclamationTriangleIcon className="w-4 h-4 text-[var(--color-warning)]" />
                          <span className="text-[var(--color-warning-text)] text-sm font-semibold">
                            Usage Warning
                          </span>
                        </div>
                        <p className="text-[var(--color-warning-text)] text-xs mt-1">
                          You're approaching your monthly limit. Upgrade to Pro for unlimited generations.
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { label: "Canvas Access", enabled: currentPlan.limits.canvas },
                      { label: "Analytics", enabled: currentPlan.limits.analytics },
                      { label: "API Access", enabled: currentPlan.limits.apiAccess },
                      { label: "Personas", enabled: currentPlan.limits.customPersonas },
                    ].map((feature, index) => (
                      <StatCard
                        key={index}
                        title={feature.label}
                        value={feature.enabled ? "✓" : "✗"}
                        description={feature.enabled ? "Enabled" : "Upgrade"}
                      />
                    ))}
                  </div>

                  {/* Recent Activity Section */}
                  <div className="border-t border-[var(--border-primary)] pt-6">
                    <div className="flex items-center space-x-2 mb-4">
                      <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500 text-white">
                        <ClockIcon className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-[var(--text-primary)]">Recent Activity</h3>
                        <p className="text-xs text-[var(--text-tertiary)]">Your credit transaction history</p>
                      </div>
                    </div>

                    <div className="space-y-3 max-h-64 overflow-y-auto">
                      {/* Mock transaction data - this would be replaced with real data from useCredits */}
                      {[
                        {
                          id: "1",
                          type: "usage",
                          description: "AI Content Generation",
                          amount: -5,
                          createdAt: new Date(Date.now() - 1000 * 60 * 30) // 30 minutes ago
                        },
                        {
                          id: "2",
                          type: "purchase",
                          description: "Credit Package Purchase",
                          amount: 100,
                          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2) // 2 hours ago
                        },
                        {
                          id: "3",
                          type: "subscription_renewal",
                          description: "Monthly Subscription Renewal",
                          amount: 50,
                          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24) // 1 day ago
                        }
                      ].map((transaction, index) => {
                        const getTransactionIcon = (type: string) => {
                          switch (type) {
                            case "purchase":
                              return <CreditCardIcon className="w-4 h-4 text-[var(--color-success)]" />;
                            case "usage":
                              return <SparklesIcon className="w-4 h-4 text-[var(--brand-primary)]" />;
                            case "subscription_renewal":
                              return <RefreshIcon className="w-4 h-4 text-[var(--accent-cyan)]" />;
                            default:
                              return <ClockIcon className="w-4 h-4 text-[var(--text-tertiary)]" />;
                          }
                        };

                        const getTransactionColor = (amount: number) => {
                          return amount > 0 ? "text-[var(--color-success)]" : "text-[var(--brand-primary)]";
                        };

                        const formatDate = (date: Date) => {
                          return date.toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          });
                        };

                        return (
                          <div
                            key={transaction.id}
                            className="flex items-center justify-between p-3 bg-[var(--surface-tertiary)] border border-[var(--border-primary)] rounded-lg hover:bg-[var(--surface-quaternary)] transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              {getTransactionIcon(transaction.type)}
                              <div>
                                <div className="text-[var(--text-primary)] font-medium text-sm">
                                  {transaction.description}
                                </div>
                                <div className="text-[var(--text-tertiary)] text-xs">
                                  {formatDate(transaction.createdAt)}
                                </div>
                              </div>
                            </div>
                            <div className={`font-bold text-sm ${getTransactionColor(transaction.amount)}`}>
                              {transaction.amount > 0 ? "+" : ""}{transaction.amount}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </Card>

              {/* Credit Management Card */}
              <CreditManagement onNavigateToBilling={onNavigateToBilling} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
