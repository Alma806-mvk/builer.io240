import React, { useState } from "react";
import { useSubscription } from "../context/SubscriptionContext";
import { useCredits } from "../context/CreditContext";
import { mockSubscriptionService } from "../services/mockSubscriptionService";
import { SUBSCRIPTION_PLANS } from "../services/stripeService";
import { auth } from "../config/firebase";
import {
  PlusIcon,
} from "./IconComponents";
import {
  SettingsIcon,
  CreditCardIcon,
} from "./ProfessionalIcons";

const DevTools: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [creditAmount, setCreditAmount] = useState(100);
  const { billingInfo, refreshBilling } = useSubscription();
  const { credits, addCredits, refreshCredits } = useCredits();
  const user = auth.currentUser;

  // Debug logging
  console.log("🔧 DevTools component mounted", {
    user: !!user,
    isProd: import.meta.env.PROD,
    env: import.meta.env.MODE,
  });

  // Only hide in production, show in development even without user
  if (import.meta.env.PROD) {
    return null; // Hide in production
  }

  // Show a different version if no user is authenticated
  if (!user) {
    return (
      <div className="fixed bottom-36 left-4 z-[9999]">
        <button
          onClick={() => {
            console.log("🔧 DevTools button clicked (no user)!");
            setIsOpen(!isOpen);
          }}
          className="bg-purple-600 hover:bg-purple-500 text-white p-3 rounded-full shadow-lg transition-colors border-2 border-purple-400 hover:border-purple-300"
          title="Developer Tools (No User)"
          style={{ minWidth: "40px", minHeight: "40px" }}
        >
          <SettingsIcon className="h-4 w-4" />
        </button>

        {isOpen && (
          <div className="absolute bottom-12 left-0 bg-slate-800 border border-purple-500 rounded-lg p-4 min-w-80 shadow-xl">
            <h3 className="text-purple-400 font-semibold mb-3 text-sm">
              🛠️ Dev Tools (No User)
            </h3>
            <div className="text-red-400 text-xs mb-2">
              ⚠️ No user authenticated. Please sign in to access full dev tools.
            </div>
            <button
              onClick={() => {
                localStorage.setItem("dev_force_premium", "true");
                console.log("🔧 Premium override ENABLED (no user)");
                window.location.reload();
              }}
              className="w-full px-3 py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs rounded"
            >
              🔓 Force Enable Premium (No Auth)
            </button>
          </div>
        )}
      </div>
    );
  }

  const handlePlanChange = async (planId: string) => {
    console.log("🔧 DevTools: Changing plan to", planId);

    if (planId === "free") {
      mockSubscriptionService.resetToFree(user.uid);
    } else {
      mockSubscriptionService.simulateUpgrade(user.uid, planId);
    }

    // Check localStorage after change
    console.log("🔧 LocalStorage after change:", {
      keys: Object.keys(localStorage).filter((k) => k.includes(user.uid)),
      mockSub: mockSubscriptionService.getSubscription(user.uid),
    });

    // Force immediate refresh
    console.log("🔧 Forcing immediate billing refresh...");
    await refreshBilling();

    // Additional refreshes with delays to ensure state propagation
    setTimeout(async () => {
      console.log("🔧 Secondary refresh attempt...");
      await refreshBilling();
    }, 200);

    setTimeout(async () => {
      console.log("🔧 Final refresh attempt...");
      await refreshBilling();
    }, 600);

    // Force a page reload as a last resort if needed
    setTimeout(() => {
      console.log("🔧 Checking if subscription updated correctly...");
      const finalCheck = mockSubscriptionService.getSubscription(user.uid);
      if (finalCheck?.planId === planId) {
        console.log("✅ Subscription update successful!", finalCheck);
      } else {
        console.warn(
          "⚠️ Subscription may not have updated properly, consider page reload",
        );
      }
    }, 1000);
  };

  const handleUsageChange = (amount: number) => {
    if (!billingInfo) return;

    const currentUsage = mockSubscriptionService.getUsage(user.uid);
    const newGenerations = Math.max(0, currentUsage.generations + amount);

    const currentMonth = new Date().toISOString().slice(0, 7);
    const newUsage = {
      ...currentUsage,
      generations: newGenerations,
      lastUpdated: new Date(),
    };

    localStorage.setItem(
      `mock_usage_${user.uid}_${currentMonth}`,
      JSON.stringify(newUsage),
    );
    refreshBilling();
  };

  const currentPlan = billingInfo?.subscription?.planId || "free";

  return (
    <div className="fixed bottom-36 left-4 z-[9999]">
      <button
        onClick={() => {
          console.log("🔧 DevTools button clicked!");
          setIsOpen(!isOpen);
        }}
        className="bg-purple-600 hover:bg-purple-500 text-white p-3 rounded-full shadow-lg transition-colors border-2 border-purple-400 hover:border-purple-300"
        title="Developer Tools"
        style={{ minWidth: "40px", minHeight: "40px" }}
      >
        <SettingsIcon className="h-4 w-4" />
      </button>

      {isOpen && (
        <div className="absolute bottom-12 left-0 bg-slate-800 border border-purple-500 rounded-lg p-4 min-w-80 shadow-xl">
          <h3 className="text-purple-400 font-semibold mb-3 text-sm">
            🛠️ Dev Tools
          </h3>

          {/* Premium Override */}
          <div className="mb-4 p-2 bg-purple-900/30 rounded border border-purple-500/30">
            <button
              onClick={() => {
                const currentState =
                  localStorage.getItem("dev_force_premium") === "true";
                if (currentState) {
                  localStorage.removeItem("dev_force_premium");
                  console.log("🔧 Premium override DISABLED");
                } else {
                  localStorage.setItem("dev_force_premium", "true");
                  console.log("🔧 Premium override ENABLED");
                }
                // Force refresh by triggering a re-render
                refreshBilling();
                setTimeout(() => window.location.reload(), 100);
              }}
              className={`w-full px-3 py-2 rounded font-medium text-sm transition-colors mb-2 ${
                localStorage.getItem("dev_force_premium") === "true"
                  ? "bg-green-600 hover:bg-green-500 text-white"
                  : "bg-purple-600 hover:bg-purple-500 text-white"
              }`}
            >
              {localStorage.getItem("dev_force_premium") === "true"
                ? "🔓 Premium ENABLED"
                : "🔒 Enable Premium"}
            </button>

            {/* Force Refresh Button */}
            <button
              onClick={async () => {
                console.log("🔧 Force refreshing all premium features...");
                await refreshBilling();
                setTimeout(() => window.location.reload(), 500);
              }}
              className="w-full px-3 py-1.5 bg-orange-600 hover:bg-orange-500 text-white rounded font-medium text-xs transition-colors"
            >
              🔄 Force Refresh
            </button>
          </div>

          {/* Current Status */}
          <div className="mb-4 p-2 bg-slate-700/50 rounded text-xs">
            <div className="text-slate-300">
              <strong>Plan:</strong>{" "}
              {SUBSCRIPTION_PLANS.find((p) => p.id === currentPlan)?.name}
            </div>
            <div className="text-slate-300">
              <strong>Usage:</strong> {billingInfo?.usage.generations || 0}
            </div>
          </div>

          {/* Plan Switcher */}
          <div className="mb-3">
            <label className="block text-xs text-slate-400 mb-1">
              Switch Plan:
            </label>
            <select
              value={currentPlan}
              onChange={(e) => handlePlanChange(e.target.value)}
              className="w-full p-1 bg-slate-700 border border-slate-600 rounded text-xs text-white"
            >
              {SUBSCRIPTION_PLANS.map((plan) => (
                <option key={plan.id} value={plan.id}>
                  {plan.name} {plan.price > 0 && `($${plan.price}/mo)`}
                </option>
              ))}
            </select>
          </div>

          {/* Usage Controls */}
          <div className="mb-3">
            <label className="block text-xs text-slate-400 mb-1">
              Adjust Usage:
            </label>
            <div className="flex gap-1">
              <button
                onClick={() => handleUsageChange(-5)}
                className="px-2 py-1 bg-slate-600 hover:bg-slate-500 text-white text-xs rounded"
              >
                -5
              </button>
              <button
                onClick={() => handleUsageChange(-1)}
                className="px-2 py-1 bg-slate-600 hover:bg-slate-500 text-white text-xs rounded"
              >
                -1
              </button>
              <button
                onClick={() => handleUsageChange(1)}
                className="px-2 py-1 bg-slate-600 hover:bg-slate-500 text-white text-xs rounded"
              >
                +1
              </button>
              <button
                onClick={() => handleUsageChange(5)}
                className="px-2 py-1 bg-slate-600 hover:bg-slate-500 text-white text-xs rounded"
              >
                +5
              </button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-1">
            <button
              onClick={() => {
                const isEnabled =
                  localStorage.getItem("dev_force_premium") === "true";
                if (isEnabled) {
                  localStorage.removeItem("dev_force_premium");
                  alert("🔧 Premium features disabled - reload to see changes");
                } else {
                  localStorage.setItem("dev_force_premium", "true");
                  alert(
                    "🔧 Premium features FORCE ENABLED! All premium features should now work.",
                  );
                }
                window.location.reload();
              }}
              className="w-full px-2 py-1 bg-purple-600 hover:bg-purple-500 text-white text-xs rounded"
            >
              {localStorage.getItem("dev_force_premium") === "true"
                ? "🔓 Disable"
                : "🔒 Force"}{" "}
              Premium
            </button>
            <button
              onClick={() => {
                console.log("🔧 Current localStorage:", {
                  allKeys: Object.keys(localStorage),
                  mockSubscription: mockSubscriptionService.getSubscription(
                    user.uid,
                  ),
                  mockUsage: mockSubscriptionService.getUsage(user.uid),
                  billingInfo,
                  devForcePremium: localStorage.getItem("dev_force_premium"),
                });
                console.log("🔧 Forcing upgrade to Creator Pro...");
                mockSubscriptionService.simulateUpgrade(user.uid, "pro");
                refreshBilling();
              }}
              className="w-full px-2 py-1 bg-blue-600 hover:bg-blue-500 text-white text-xs rounded"
            >
              🔧 Debug & Force Pro
            </button>
            <button
              onClick={() => {
                handleUsageChange(10);
                alert("Set usage to near limit for testing paywall!");
              }}
              className="w-full px-2 py-1 bg-yellow-600 hover:bg-yellow-500 text-white text-xs rounded"
            >
              🚨 Trigger Paywall
            </button>
            <button
              onClick={() => {
                mockSubscriptionService.clearAllData(user.uid);
                window.location.reload();
              }}
              className="w-full px-2 py-1 bg-red-600 hover:bg-red-500 text-white text-xs rounded"
            >
              🗑️ Reset All Data
            </button>
          </div>

          {/* Credit Management */}
          <div className="mt-4 p-2 bg-emerald-900/30 rounded border border-emerald-500/30">
            <h4 className="text-emerald-400 font-semibold mb-2 text-xs flex items-center gap-1">
              <CreditCardIcon className="h-3 w-3" />
              Credit Management
            </h4>

            <div className="mb-2 text-xs text-slate-300">
              <strong>Current Credits:</strong> {credits?.totalCredits || 0}
            </div>

            <div className="flex gap-1 mb-2">
              <input
                type="number"
                value={creditAmount}
                onChange={(e) => setCreditAmount(parseInt(e.target.value) || 0)}
                className="flex-1 p-1 bg-slate-700 border border-slate-600 rounded text-xs text-white"
                placeholder="Amount"
                min="1"
                max="10000"
              />
              <button
                onClick={async () => {
                  if (creditAmount > 0) {
                    await addCredits(
                      creditAmount,
                      "bonus",
                      `Dev Tools: Added ${creditAmount} credits`,
                    );
                    await refreshCredits();
                    console.log(`🔧 Added ${creditAmount} credits`);
                    alert(`��� Added ${creditAmount} credits successfully!`);
                  }
                }}
                className="px-2 py-1 bg-emerald-600 hover:bg-emerald-500 text-white text-xs rounded flex items-center gap-1"
              >
                <PlusIcon className="h-3 w-3" />
                Add
              </button>
            </div>

            <div className="flex gap-1">
              <button
                onClick={async () => {
                  await addCredits(
                    25,
                    "bonus",
                    "Dev Tools: Quick add 25 credits",
                  );
                  await refreshCredits();
                  console.log("🔧 Added 25 credits");
                }}
                className="flex-1 px-2 py-1 bg-emerald-700 hover:bg-emerald-600 text-white text-xs rounded"
              >
                +25
              </button>
              <button
                onClick={async () => {
                  await addCredits(
                    100,
                    "bonus",
                    "Dev Tools: Quick add 100 credits",
                  );
                  await refreshCredits();
                  console.log("🔧 Added 100 credits");
                }}
                className="flex-1 px-2 py-1 bg-emerald-700 hover:bg-emerald-600 text-white text-xs rounded"
              >
                +100
              </button>
              <button
                onClick={async () => {
                  await addCredits(
                    500,
                    "bonus",
                    "Dev Tools: Quick add 500 credits",
                  );
                  await refreshCredits();
                  console.log("🔧 Added 500 credits");
                }}
                className="flex-1 px-2 py-1 bg-emerald-700 hover:bg-emerald-600 text-white text-xs rounded"
              >
                +500
              </button>
            </div>
          </div>

          <div className="text-xs text-slate-500 mt-2 text-center">
            Development Mode Only
          </div>
        </div>
      )}
    </div>
  );
};

export default DevTools;
