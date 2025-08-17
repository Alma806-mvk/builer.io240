import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useSubscription } from "../context/SubscriptionContext";
import { AuthService } from "../services/authService";
import { SUBSCRIPTION_PLANS } from "../services/stripeService";
import {
  UserCircleIcon,
  EnvelopeIcon,
  CalendarDaysIcon,
  CheckCircleIcon,
  XCircleIcon,
  CreditCardIcon,
  ChartBarIcon,
  KeyIcon,
  ExclamationTriangleIcon,
  ShieldCheckIcon,
} from "./IconComponents";
import LoadingSpinner from "./LoadingSpinner";
import EmailVerificationPrompt from "./EmailVerificationPrompt";
import CreditManagement from "./CreditManagement";
import EnhancedThemeToggle from "./EnhancedThemeToggle";

interface AccountPageProps {
  onNavigateToBilling: () => void;
}

const AccountPageBackup: React.FC<AccountPageProps> = ({ onNavigateToBilling }) => {
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
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-black flex items-center justify-center">
        <div className="text-white">Please sign in to view your account.</div>
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
        return (
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-emerald-500/20 to-green-500/20 border border-emerald-400/30 shadow-lg shadow-emerald-500/20">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
            <span className="text-emerald-300 font-semibold text-sm">
              Pro Active
            </span>
            <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
              <CheckCircleIcon className="w-4 h-4 text-white" />
            </div>
          </div>
        );
      case "canceled":
        return (
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-red-500/20 to-pink-500/20 border border-red-400/30">
            <XCircleIcon className="w-4 h-4 text-red-400" />
            <span className="text-red-300 font-semibold text-sm">Canceled</span>
          </div>
        );
      default:
        return (
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-slate-600/40 to-slate-500/40 border border-slate-500/50">
            <div className="w-2 h-2 bg-slate-400 rounded-full"></div>
            <span className="text-slate-300 font-semibold text-sm">
              Free Plan
            </span>
            <div
              className="px-2 py-1 bg-gradient-to-r from-sky-500 to-purple-500 rounded-full text-xs text-white font-bold cursor-pointer hover:scale-105 transition-transform"
              onClick={() =>
                window.open(
                  "https://billing.stripe.com/p/login/28E9AU9IJbTG9Ecb0Cbo400",
                  "_blank",
                )
              }
            >
              UPGRADE
            </div>
          </div>
        );
    }
  };

  const isPremium = currentPlan.id !== "free";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-black relative overflow-hidden">
      {/* Premium Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-sky-900/20 via-transparent to-purple-900/20"></div>
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Premium Header */}
          <div className="mb-12 text-center">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-sky-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg shadow-sky-500/25">
                <UserCircleIcon className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-sky-200 to-purple-200 bg-clip-text text-transparent">
                  Account Center
                </h1>
                <p className="text-slate-400 text-lg">
                  Manage your premium experience
                </p>
              </div>
            </div>

            {/* Account Status Banner */}
            <div className="flex justify-center mb-8">
              {getStatusBadge(billingInfo?.status || "free")}
            </div>
          </div>

          {/* Email Verification Banner */}
          {!isEmailVerified && (
            <div className="mb-8">
              <EmailVerificationPrompt />
            </div>
          )}

          {/* Main Grid Layout */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Left Column - Profile & Security */}
            <div className="xl:col-span-2 space-y-6">
              {/* Profile Information Card */}
              <div className="group relative bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-xl p-6 shadow-xl shadow-slate-900/50 hover:shadow-sky-500/10 transition-all duration-500">
                <div className="absolute inset-0 bg-gradient-to-r from-sky-500/5 to-purple-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-r from-sky-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                      <UserCircleIcon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white mb-1">
                        Profile Information
                      </h2>
                      <p className="text-slate-400 text-sm">
                        Your personal account details
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="block text-sm font-medium text-slate-300 mb-1">
                        Display Name
                      </label>
                      <div className="relative flex gap-2">
                        <div className="flex-1 relative">
                          <input
                            type="text"
                            value={displayName}
                            onChange={(e) => setDisplayName(e.target.value)}
                            className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500/50 transition-all duration-300 text-sm"
                            placeholder="Enter your display name"
                            maxLength={50}
                          />
                        </div>
                        <button
                          onClick={handleDisplayNameUpdate}
                          disabled={
                            isUpdatingDisplayName ||
                            displayName === (user?.displayName || "")
                          }
                          className="px-3 py-2 bg-gradient-to-r from-sky-600 to-purple-600 hover:from-sky-500 hover:to-purple-500 disabled:from-slate-600 disabled:to-slate-600 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-all duration-300 text-sm whitespace-nowrap"
                        >
                          {isUpdatingDisplayName ? "Saving..." : "Save"}
                        </button>
                      </div>

                      {displayNameError && (
                        <div className="p-2 bg-red-500/20 border border-red-400/30 rounded-lg text-red-300 text-sm">
                          {displayNameError}
                        </div>
                      )}
                      {displayNameSuccess && (
                        <div className="p-2 bg-emerald-500/20 border border-emerald-400/30 rounded-lg text-emerald-300 text-sm">
                          {displayNameSuccess}
                        </div>
                      )}
                    </div>

                    <div className="space-y-1">
                      <label className="block text-sm font-medium text-slate-300 mb-1">
                        Email Address
                      </label>
                      <div className="relative">
                        <input
                          type="email"
                          value={user.email || ""}
                          className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white opacity-80 text-sm"
                          readOnly
                        />
                        <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                          {isEmailVerified ? (
                            <div className="flex items-center gap-1 px-2 py-1 bg-emerald-500/20 border border-emerald-400/30 rounded-full">
                              <CheckCircleIcon className="h-3 w-3 text-emerald-400" />
                              <span className="text-emerald-300 text-xs font-medium">
                                Verified
                              </span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1 px-2 py-1 bg-amber-500/20 border border-amber-400/30 rounded-full">
                              <ExclamationTriangleIcon className="h-3 w-3 text-amber-400" />
                              <span className="text-amber-300 text-xs font-medium">
                                Pending
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-sm font-medium text-slate-300 mb-1">
                        Account Created
                      </label>
                      <div className="flex items-center gap-2 px-3 py-2 bg-slate-700/30 border border-slate-600/30 rounded-lg">
                        <CalendarDaysIcon className="h-4 w-4 text-sky-400" />
                        <span className="text-white text-sm">
                          {formatDate(user.metadata?.creationTime)}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-sm font-medium text-slate-300 mb-1">
                        Last Sign In
                      </label>
                      <div className="flex items-center gap-2 px-3 py-2 bg-slate-700/30 border border-slate-600/30 rounded-lg">
                        <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                        <span className="text-white text-sm">
                          {formatDate(user.metadata?.lastSignInTime)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Security Settings Card */}
              <div className="group relative bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-xl p-6 shadow-xl shadow-slate-900/50 hover:shadow-purple-500/10 transition-all duration-500">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-pink-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                      <ShieldCheckIcon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white mb-1">
                        Security & Privacy
                      </h2>
                      <p className="text-slate-400 text-sm">
                        Protect your account with advanced security
                      </p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-slate-300 mb-3">
                        Authentication Methods
                      </label>
                      <div className="flex flex-wrap gap-3">
                        {user.providerData.map((provider, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-slate-700/50 to-slate-600/50 border border-slate-600/50 rounded-xl"
                          >
                            {provider.providerId === "password" ? (
                              <>
                                <EnvelopeIcon className="w-5 h-5 text-sky-400" />
                                <span className="text-white font-medium">
                                  Email & Password
                                </span>
                                <div className="px-2 py-1 bg-emerald-500/20 border border-emerald-400/30 rounded-full">
                                  <span className="text-emerald-300 text-xs font-bold">
                                    SECURE
                                  </span>
                                </div>
                              </>
                            ) : provider.providerId === "google.com" ? (
                              <>
                                <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center">
                                  <span className="text-blue-600 text-xs font-bold">
                                    G
                                  </span>
                                </div>
                                <span className="text-white font-medium">
                                  Google
                                </span>
                                <div className="px-2 py-1 bg-blue-500/20 border border-blue-400/30 rounded-full">
                                  <span className="text-blue-300 text-xs font-bold">
                                    OAUTH
                                  </span>
                                </div>
                              </>
                            ) : (
                              <span className="text-white">
                                {provider.providerId}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {user.providerData.some(
                      (p) => p.providerId === "password",
                    ) && (
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <label className="block text-sm font-semibold text-slate-300">
                            Password Management
                          </label>
                          <button
                            onClick={() =>
                              setIsChangingPassword(!isChangingPassword)
                            }
                            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-purple-500/25 hover:scale-105"
                          >
                            {isChangingPassword ? "Cancel" : "Change Password"}
                          </button>
                        </div>

                        {isChangingPassword && (
                          <form
                            onSubmit={handlePasswordChange}
                            className="space-y-4 p-6 bg-slate-800/30 border border-slate-700/50 rounded-xl"
                          >
                            <input
                              type="password"
                              placeholder="Current password"
                              value={passwordForm.currentPassword}
                              onChange={(e) =>
                                setPasswordForm({
                                  ...passwordForm,
                                  currentPassword: e.target.value,
                                })
                              }
                              className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50"
                              required
                            />
                            <input
                              type="password"
                              placeholder="New password"
                              value={passwordForm.newPassword}
                              onChange={(e) =>
                                setPasswordForm({
                                  ...passwordForm,
                                  newPassword: e.target.value,
                                })
                              }
                              className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50"
                              required
                            />
                            <input
                              type="password"
                              placeholder="Confirm new password"
                              value={passwordForm.confirmPassword}
                              onChange={(e) =>
                                setPasswordForm({
                                  ...passwordForm,
                                  confirmPassword: e.target.value,
                                })
                              }
                              className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50"
                              required
                            />

                            {passwordError && (
                              <div className="p-3 bg-red-500/20 border border-red-400/30 rounded-xl text-red-300 text-sm">
                                {passwordError}
                              </div>
                            )}
                            {passwordSuccess && (
                              <div className="p-3 bg-emerald-500/20 border border-emerald-400/30 rounded-xl text-emerald-300 text-sm">
                                {passwordSuccess}
                              </div>
                            )}

                            <button
                              type="submit"
                              disabled={isUpdatingProfile}
                              className="w-full py-3 px-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:from-slate-600 disabled:to-slate-600 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all duration-300 shadow-lg"
                            >
                              {isUpdatingProfile
                                ? "Updating..."
                                : "Update Password"}
                            </button>
                          </form>
                        )}
                      </div>
                    )}

                    {/* Enhanced Theme Settings Section */}
                    <div>
                      <EnhancedThemeToggle variant="full" showLabel={true} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Subscription & Usage */}
            <div className="space-y-6">
              {/* Subscription Status Card */}
              <div className="group relative bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-xl p-4 shadow-xl shadow-slate-900/50 hover:shadow-emerald-500/10 transition-all duration-500">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-sky-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-sky-500 rounded-lg flex items-center justify-center shadow-lg">
                        <CreditCardIcon className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <h2 className="text-lg font-bold text-white">
                          Subscription
                        </h2>
                        <p className="text-slate-400 text-xs">
                          Your plan & billing
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() =>
                        window.open(
                          "https://billing.stripe.com/p/login/28E9AU9IJbTG9Ecb0Cbo400",
                          "_blank",
                        )
                      }
                      className="px-3 py-1 bg-gradient-to-r from-sky-600 to-purple-600 hover:from-sky-500 hover:to-purple-500 text-white text-xs font-medium rounded-lg transition-all duration-300"
                    >
                      Manage Billing
                    </button>
                  </div>

                  {subscriptionLoading ? (
                    <div className="flex items-center justify-center py-12">
                      <LoadingSpinner />
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="p-6 bg-gradient-to-r from-slate-700/30 to-slate-600/30 border border-slate-600/30 rounded-xl">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <div className="text-2xl font-bold text-white mb-1">
                              {currentPlan.name}
                            </div>
                            <div className="text-slate-400">
                              {currentPlan.price > 0
                                ? `$${currentPlan.price}/${currentPlan.interval}`
                                : "Free Forever"}
                            </div>
                          </div>
                          {getStatusBadge(billingInfo?.status || "free")}
                        </div>

                        {!isPremium && (
                          <div className="mt-4 p-4 bg-gradient-to-r from-sky-500/10 to-purple-500/10 border border-sky-400/20 rounded-xl">
                            <div className="flex items-center gap-2 mb-2">
                              <div className="w-2 h-2 bg-sky-400 rounded-full animate-pulse"></div>
                              <span className="text-sky-300 font-semibold text-sm">
                                Upgrade to Pro
                              </span>
                            </div>
                            <p className="text-slate-300 text-sm mb-3">
                              Unlock unlimited generations, advanced features,
                              and priority support
                            </p>
                            <button
                              onClick={() =>
                                window.open(
                                  "https://billing.stripe.com/p/login/28E9AU9IJbTG9Ecb0Cbo400",
                                  "_blank",
                                )
                              }
                              className="w-full py-2 bg-gradient-to-r from-sky-500 to-purple-500 hover:from-sky-400 hover:to-purple-400 text-white font-semibold rounded-lg transition-all duration-300 text-sm hover:scale-105"
                            >
                              Upgrade Now
                            </button>
                          </div>
                        )}
                      </div>

                      {billingInfo?.subscription && (
                        <div className="p-4 bg-slate-700/20 border border-slate-600/30 rounded-xl">
                          <label className="block text-sm font-semibold text-slate-300 mb-2">
                            Next Billing Date
                          </label>
                          <div className="flex items-center gap-3">
                            <CalendarDaysIcon className="h-5 w-5 text-emerald-400" />
                            <span className="text-white font-medium">
                              {formatDate(
                                billingInfo.subscription.currentPeriodEnd,
                              )}
                            </span>
                          </div>
                        </div>
                      )}

                      <div>
                        <label className="block text-sm font-semibold text-slate-300 mb-3">
                          Plan Features
                        </label>
                        <div className="space-y-2">
                          {currentPlan.features
                            .slice(0, 4)
                            .map((feature, index) => (
                              <div
                                key={index}
                                className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-700/20 transition-colors"
                              >
                                <CheckCircleIcon className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                                <span className="text-slate-300 text-sm">
                                  {feature}
                                </span>
                              </div>
                            ))}
                          {currentPlan.features.length > 4 && (
                            <div className="text-slate-400 text-sm mt-2 pl-7">
                              +{currentPlan.features.length - 4} more premium
                              features
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Usage Analytics Card */}
              <div className="group relative bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-xl p-4 shadow-xl shadow-slate-900/50 hover:shadow-blue-500/10 transition-all duration-500">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-indigo-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center shadow-lg">
                      <ChartBarIcon className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-white">
                        Usage Analytics
                      </h2>
                      <p className="text-slate-400 text-xs">
                        Track your consumption
                      </p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <label className="text-sm font-semibold text-slate-300">
                          AI Generations This Month
                        </label>
                        <div className="text-right">
                          <div className="text-lg font-bold text-white">
                            {billingInfo?.usage?.generations || 0}
                          </div>
                          <div className="text-xs text-slate-400">
                            of{" "}
                            {currentPlan.limits.generations === -1
                              ? "∞"
                              : currentPlan.limits.generations}
                          </div>
                        </div>
                      </div>

                      <div className="relative">
                        <div className="w-full bg-slate-700/50 rounded-full h-3 overflow-hidden">
                          <div
                            className={`h-3 rounded-full transition-all duration-1000 ${
                              usagePercentage > 90
                                ? "bg-gradient-to-r from-red-500 to-pink-500"
                                : usagePercentage > 70
                                  ? "bg-gradient-to-r from-amber-500 to-orange-500"
                                  : "bg-gradient-to-r from-emerald-500 to-sky-500"
                            }`}
                            style={{
                              width: `${Math.min(usagePercentage, 100)}%`,
                            }}
                          />
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent rounded-full animate-pulse"></div>
                      </div>

                      {usagePercentage > 80 && currentPlan.id === "free" && (
                        <div className="mt-3 p-3 bg-amber-500/10 border border-amber-400/20 rounded-xl">
                          <div className="flex items-center gap-2">
                            <ExclamationTriangleIcon className="h-4 w-4 text-amber-400" />
                            <span className="text-amber-300 text-sm font-semibold">
                              Usage Warning
                            </span>
                          </div>
                          <p className="text-amber-200 text-xs mt-1">
                            You're approaching your monthly limit. Upgrade to
                            Pro for unlimited generations.
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-slate-700/20 border border-slate-600/30 rounded-xl text-center">
                        <div className="text-sm text-slate-400 mb-1">
                          Canvas Access
                        </div>
                        <div
                          className={`font-bold ${currentPlan.limits.canvas ? "text-emerald-400" : "text-slate-500"}`}
                        >
                          {currentPlan.limits.canvas
                            ? "✓ Enabled"
                            : "✗ Upgrade"}
                        </div>
                      </div>
                      <div className="p-4 bg-slate-700/20 border border-slate-600/30 rounded-xl text-center">
                        <div className="text-sm text-slate-400 mb-1">
                          Analytics
                        </div>
                        <div
                          className={`font-bold ${currentPlan.limits.analytics ? "text-emerald-400" : "text-slate-500"}`}
                        >
                          {currentPlan.limits.analytics
                            ? "✓ Enabled"
                            : "✗ Upgrade"}
                        </div>
                      </div>
                      <div className="p-4 bg-slate-700/20 border border-slate-600/30 rounded-xl text-center">
                        <div className="text-sm text-slate-400 mb-1">
                          API Access
                        </div>
                        <div
                          className={`font-bold ${currentPlan.limits.apiAccess ? "text-emerald-400" : "text-slate-500"}`}
                        >
                          {currentPlan.limits.apiAccess
                            ? "✓ Enabled"
                            : "✗ Upgrade"}
                        </div>
                      </div>
                      <div className="p-4 bg-slate-700/20 border border-slate-600/30 rounded-xl text-center">
                        <div className="text-sm text-slate-400 mb-1">
                          Personas
                        </div>
                        <div
                          className={`font-bold ${currentPlan.limits.customPersonas ? "text-emerald-400" : "text-slate-500"}`}
                        >
                          {currentPlan.limits.customPersonas
                            ? "✓ Enabled"
                            : "✗ Upgrade"}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Credit Management Card */}
              <CreditManagement onNavigateToBilling={onNavigateToBilling} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountPageBackup;
