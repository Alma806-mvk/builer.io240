import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  CreditCardIcon,
  UserCircleIcon,
  CogIcon,
  BoltIcon,
  StarIcon,
} from "./IconComponents";
import {
  Button,
  Card,
  Input,
  Badge,
  StatCard,
  ProgressBar,
  TabHeader,
  GradientText,
  LoadingSpinner,
  QuickActionCard,
} from "./ui/WorldClassComponents";
import LoadingSpinnerLegacy from "./LoadingSpinner";
import EmailVerificationPrompt from "./EmailVerificationPrompt";
import CreditManagement from "./CreditManagement";
import EnhancedThemeToggle from "./EnhancedThemeToggle";

interface AccountPageProps {
  onNavigateToBilling: () => void;
}

const AccountPage: React.FC<AccountPageProps> = ({ onNavigateToBilling }) => {
  const { user, isEmailVerified, refreshUser } = useAuth();
  const { billingInfo, loading: subscriptionLoading } = useSubscription();
  const [activeTab, setActiveTab] = useState<"profile" | "billing" | "security" | "preferences">("profile");
  
  // Form states
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [isUpdatingDisplayName, setIsUpdatingDisplayName] = useState(false);
  const [displayNameSuccess, setDisplayNameSuccess] = useState("");
  const [displayNameError, setDisplayNameError] = useState("");

  if (!user) {
    return (
      <div className="min-h-screen bg-[var(--surface-primary)] flex items-center justify-center">
        <Card className="text-center">
          <UserCircleIcon className="text-6xl text-[var(--text-tertiary)] mx-auto mb-4" />
          <h2 className="heading-3 mb-2">Authentication Required</h2>
          <p className="body-base text-[var(--text-secondary)]">
            Please sign in to view your account settings.
          </p>
        </Card>
      </div>
    );
  }

  const currentPlan = SUBSCRIPTION_PLANS.find(
    (p) => p.id === (billingInfo?.subscription?.planId || "free"),
  ) || SUBSCRIPTION_PLANS[0];

  const usagePercentage = currentPlan.limits.generations === -1
    ? 0
    : ((billingInfo?.usage?.generations || 0) / currentPlan.limits.generations) * 100;

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
      await refreshUser();
      setDisplayNameSuccess("Display name updated successfully!");
      setTimeout(() => setDisplayNameSuccess(""), 3000);
    } catch (error: any) {
      setDisplayNameError(AuthService.getErrorMessage(error));
    } finally {
      setIsUpdatingDisplayName(false);
    }
  };

  const handlePasswordChange = async () => {
    setPasswordError("");
    setPasswordSuccess("");

    if (!passwordForm.currentPassword || !passwordForm.newPassword) {
      setPasswordError("Please fill in all fields");
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError("New passwords don't match");
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters");
      return;
    }

    setIsChangingPassword(true);

    try {
      await AuthService.changePassword(passwordForm.currentPassword, passwordForm.newPassword);
      setPasswordSuccess("Password changed successfully!");
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setTimeout(() => setPasswordSuccess(""), 3000);
    } catch (error: any) {
      setPasswordError(AuthService.getErrorMessage(error));
    } finally {
      setIsChangingPassword(false);
    }
  };

  const tabConfig = [
    { id: "profile", label: "Profile", icon: <UserCircleIcon /> },
    { id: "billing", label: "Billing", icon: <CreditCardIcon /> },
    { id: "security", label: "Security", icon: <ShieldCheckIcon /> },
    { id: "preferences", label: "Preferences", icon: <CogIcon /> },
  ];

  return (
    <div className="min-h-screen bg-[var(--surface-primary)]">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <TabHeader
            title="Account Settings"
            subtitle="Manage your profile, billing, and preferences"
            icon={<UserCircleIcon />}
            badge={currentPlan.name}
          />
        </motion.div>

        {/* Email Verification Alert */}
        {!isEmailVerified && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <EmailVerificationPrompt />
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <Card padding="sm">
              <nav className="space-y-2">
                {tabConfig.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                      activeTab === tab.id
                        ? "bg-[var(--brand-primary)] text-white shadow-lg"
                        : "text-[var(--text-secondary)] hover:bg-[var(--surface-tertiary)] hover:text-[var(--text-primary)]"
                    }`}
                  >
                    <div className="text-lg">{tab.icon}</div>
                    <span className="font-medium">{tab.label}</span>
                  </button>
                ))}
              </nav>
            </Card>

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-6"
            >
              <Card padding="sm">
                <h4 className="font-semibold text-[var(--text-primary)] mb-4">Quick Stats</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-[var(--text-secondary)]">Plan</span>
                    <Badge variant={currentPlan.id === "free" ? "neutral" : "success"}>
                      {currentPlan.name}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-[var(--text-secondary)]">Status</span>
                    <Badge variant={billingInfo?.status === "active" ? "success" : "warning"}>
                      {billingInfo?.status || "Unknown"}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-[var(--text-secondary)]">Usage</span>
                    <span className="text-sm font-medium text-[var(--text-primary)]">
                      {Math.round(usagePercentage)}%
                    </span>
                  </div>
                </div>
              </Card>
            </motion.div>
          </motion.div>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-3"
          >
            <AnimatePresence mode="wait">
              {activeTab === "profile" && (
                <motion.div
                  key="profile"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  {/* Profile Information */}
                  <Card>
                    <div className="flex items-center space-x-4 mb-6">
                      <div className="w-16 h-16 bg-gradient-to-br from-[var(--brand-primary)] to-[var(--brand-secondary)] rounded-2xl flex items-center justify-center">
                        <UserCircleIcon className="text-white text-2xl" />
                      </div>
                      <div>
                        <h3 className="heading-4">Profile Information</h3>
                        <p className="body-small text-[var(--text-secondary)]">
                          Update your personal information and preferences
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Input
                          label="Display Name"
                          value={displayName}
                          onChange={setDisplayName}
                          placeholder="Enter your display name"
                          icon={<UserCircleIcon />}
                          error={displayNameError}
                        />
                        {displayNameSuccess && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-2"
                          >
                            <Badge variant="success" size="sm">
                              <CheckCircleIcon className="mr-1" />
                              {displayNameSuccess}
                            </Badge>
                          </motion.div>
                        )}
                        <div className="mt-4">
                          <Button
                            variant="primary"
                            onClick={handleDisplayNameUpdate}
                            loading={isUpdatingDisplayName}
                            disabled={displayName === (user?.displayName || "")}
                          >
                            Update Display Name
                          </Button>
                        </div>
                      </div>

                      <div>
                        <Input
                          label="Email Address"
                          value={user?.email || ""}
                          disabled
                          icon={<EnvelopeIcon />}
                        />
                        <div className="mt-2">
                          <Badge variant={isEmailVerified ? "success" : "warning"} size="sm">
                            {isEmailVerified ? (
                              <>
                                <CheckCircleIcon className="mr-1" />
                                Verified
                              </>
                            ) : (
                              <>
                                <ExclamationTriangleIcon className="mr-1" />
                                Unverified
                              </>
                            )}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 pt-6 border-t border-[var(--border-primary)]">
                      <div className="flex items-center space-x-4 text-sm text-[var(--text-secondary)]">
                        <div className="flex items-center space-x-2">
                          <CalendarDaysIcon />
                          <span>Joined {new Date(user.metadata?.creationTime || "").toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <ClockIcon />
                          <span>Last sign in {new Date(user.metadata?.lastSignInTime || "").toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              )}

              {activeTab === "billing" && (
                <motion.div
                  key="billing"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  {/* Billing Overview */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <StatCard
                      title="Current Plan"
                      value={currentPlan.name}
                      description={`$${currentPlan.price}/${currentPlan.interval}`}
                      icon={<StarIcon />}
                      changeType={currentPlan.id === "free" ? "neutral" : "positive"}
                    />
                    
                    <StatCard
                      title="Monthly Usage"
                      value={`${billingInfo?.usage?.generations || 0}`}
                      description={`of ${currentPlan.limits.generations === -1 ? "∞" : currentPlan.limits.generations} generations`}
                      icon={<ChartBarIcon />}
                      changeType={usagePercentage > 80 ? "negative" : "positive"}
                    />
                    
                    <StatCard
                      title="Account Status"
                      value={billingInfo?.status?.charAt(0).toUpperCase() + (billingInfo?.status?.slice(1) || "")}
                      description={billingInfo?.status === "active" ? "All features available" : "Limited access"}
                      icon={billingInfo?.status === "active" ? <CheckCircleIcon /> : <XCircleIcon />}
                      changeType={billingInfo?.status === "active" ? "positive" : "negative"}
                    />
                  </div>

                  {/* Usage Progress */}
                  <Card>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="heading-4">Monthly Usage</h3>
                      <Badge variant="neutral">
                        Resets in {new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate() - new Date().getDate()} days
                      </Badge>
                    </div>
                    <ProgressBar
                      value={billingInfo?.usage?.generations || 0}
                      max={currentPlan.limits.generations === -1 ? 100 : currentPlan.limits.generations}
                      label="AI Content Generations"
                      color={usagePercentage > 90 ? "var(--color-error)" : usagePercentage > 70 ? "var(--color-warning)" : "var(--brand-primary)"}
                      showLabel
                    />
                    <div className="flex justify-between text-sm mt-3">
                      <span className="text-[var(--text-tertiary)]">
                        {billingInfo?.usage?.generations || 0} used this month
                      </span>
                      <span className={usagePercentage > 80 ? "text-[var(--color-warning-text)]" : "text-[var(--color-success-text)]"}>
                        {currentPlan.limits.generations === -1
                          ? "Unlimited remaining"
                          : `${currentPlan.limits.generations - (billingInfo?.usage?.generations || 0)} remaining`}
                      </span>
                    </div>
                  </Card>

                  {/* Quick Actions */}
                  <Card>
                    <h3 className="heading-4 mb-6">Billing Actions</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <QuickActionCard
                        title="Manage Subscription"
                        description="Update your plan, payment method, and billing details"
                        icon={<CreditCardIcon />}
                        color="var(--brand-primary)"
                        onClick={onNavigateToBilling}
                      />
                      
                      <QuickActionCard
                        title="Upgrade Plan"
                        description="Unlock premium features and unlimited generations"
                        icon={<SparklesIcon />}
                        color="var(--brand-secondary)"
                        onClick={onNavigateToBilling}
                        badge={currentPlan.id === "free" ? "Recommended" : undefined}
                      />
                    </div>
                  </Card>

                  {/* Credit Management */}
                  <Card>
                    <h3 className="heading-4 mb-4">Credit Management</h3>
                    <CreditManagement />
                  </Card>
                </motion.div>
              )}

              {activeTab === "security" && (
                <motion.div
                  key="security"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  {/* Password Change */}
                  <Card>
                    <div className="flex items-center space-x-4 mb-6">
                      <div className="w-12 h-12 bg-gradient-to-br from-[var(--color-warning)] to-[var(--color-error)] rounded-xl flex items-center justify-center">
                        <KeyIcon className="text-white" />
                      </div>
                      <div>
                        <h3 className="heading-4">Change Password</h3>
                        <p className="body-small text-[var(--text-secondary)]">
                          Update your password to keep your account secure
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4 max-w-md">
                      <Input
                        label="Current Password"
                        type="password"
                        value={passwordForm.currentPassword}
                        onChange={(value) => setPasswordForm(prev => ({ ...prev, currentPassword: value }))}
                        placeholder="Enter current password"
                        error={passwordError}
                      />
                      
                      <Input
                        label="New Password"
                        type="password"
                        value={passwordForm.newPassword}
                        onChange={(value) => setPasswordForm(prev => ({ ...prev, newPassword: value }))}
                        placeholder="Enter new password"
                      />
                      
                      <Input
                        label="Confirm New Password"
                        type="password"
                        value={passwordForm.confirmPassword}
                        onChange={(value) => setPasswordForm(prev => ({ ...prev, confirmPassword: value }))}
                        placeholder="Confirm new password"
                      />

                      {passwordSuccess && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                        >
                          <Badge variant="success">
                            <CheckCircleIcon className="mr-1" />
                            {passwordSuccess}
                          </Badge>
                        </motion.div>
                      )}

                      <Button
                        variant="primary"
                        onClick={handlePasswordChange}
                        loading={isChangingPassword}
                        disabled={!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword}
                      >
                        Update Password
                      </Button>
                    </div>
                  </Card>

                  {/* Security Status */}
                  <Card>
                    <h3 className="heading-4 mb-4">Security Status</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-[var(--surface-tertiary)] rounded-lg">
                        <div className="flex items-center space-x-3">
                          <CheckCircleIcon className="text-[var(--color-success)]" />
                          <div>
                            <p className="font-medium text-[var(--text-primary)]">Email Verification</p>
                            <p className="text-sm text-[var(--text-secondary)]">Your email address is verified</p>
                          </div>
                        </div>
                        <Badge variant={isEmailVerified ? "success" : "warning"}>
                          {isEmailVerified ? "Verified" : "Pending"}
                        </Badge>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-[var(--surface-tertiary)] rounded-lg">
                        <div className="flex items-center space-x-3">
                          <ShieldCheckIcon className="text-[var(--color-success)]" />
                          <div>
                            <p className="font-medium text-[var(--text-primary)]">Account Security</p>
                            <p className="text-sm text-[var(--text-secondary)]">Your account is secured with password authentication</p>
                          </div>
                        </div>
                        <Badge variant="success">Active</Badge>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              )}

              {activeTab === "preferences" && (
                <motion.div
                  key="preferences"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  {/* Theme Settings */}
                  <Card>
                    <div className="flex items-center space-x-4 mb-6">
                      <div className="w-12 h-12 bg-gradient-to-br from-[var(--accent-cyan)] to-[var(--brand-primary)] rounded-xl flex items-center justify-center">
                        <CogIcon className="text-white" />
                      </div>
                      <div>
                        <h3 className="heading-4">Appearance</h3>
                        <p className="body-small text-[var(--text-secondary)]">
                          Customize the look and feel of your interface
                        </p>
                      </div>
                    </div>

                    <EnhancedThemeToggle />
                  </Card>

                  {/* Notification Preferences */}
                  <Card>
                    <h3 className="heading-4 mb-4">Notifications</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-[var(--text-primary)]">Usage Alerts</p>
                          <p className="text-sm text-[var(--text-secondary)]">Get notified when approaching usage limits</p>
                        </div>
                        <Badge variant="info">Coming Soon</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-[var(--text-primary)]">Feature Updates</p>
                          <p className="text-sm text-[var(--text-secondary)]">Receive updates about new features and improvements</p>
                        </div>
                        <Badge variant="info">Coming Soon</Badge>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
