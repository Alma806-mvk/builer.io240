import React from "react";
import {
  UserCircleIcon,
  ChevronDownIcon,
  CreditCardIcon,
  MenuIcon,
} from "../IconComponents";
import { Search, Command } from "lucide-react";

interface AppHeaderProps {
  user: any;
  showUserMenu: boolean;
  setShowUserMenu: (show: boolean) => void;
  billingInfo: any;
  onSignInClick: () => void;
  onNavigateToBilling: () => void;
  onNavigateToAccount: () => void;
  onSignOut: () => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  user,
  showUserMenu,
  setShowUserMenu,
  billingInfo,
  onSignInClick,
  onNavigateToBilling,
  onNavigateToAccount,
  onSignOut,
}) => {

  return (
    <header className="border-b border-slate-700/50 bg-slate-800/30 backdrop-blur-sm relative z-50">
      <div className="container mx-auto px-4 py-2">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1">
              <img
                src="https://cdn.builder.io/api/v1/image/assets%2F64ff045265d44798a3091f704fc3d25a%2F233e717aa17f46c180d3e8a805cd77d4?format=webp&width=800"
                alt="CreateGen Studio Logo"
                className="w-8 h-8 rounded-lg flex-shrink-0"
              />
              <div className="text-sm font-medium tracking-tight text-white">
                <span className="relative overflow-hidden font-semibold creategen-glow">
                  CreateGen
                  <span className="creategen-shimmer"></span>
                </span>
                <span className="text-slate-300 ml-1">Studio</span>
              </div>
            </div>
          </div>

          {/* Command Palette Trigger - 8-Figure Brand Pattern */}
          <div className="flex-1 max-w-md mx-8">
            <button
              onClick={() => {
                // Trigger command palette with keyboard event
                const event = new KeyboardEvent('keydown', {
                  key: 'k',
                  metaKey: true,
                  ctrlKey: true,
                  bubbles: true
                });
                document.dispatchEvent(event);
              }}
              className="w-full flex items-center space-x-3 px-4 py-2.5 bg-slate-800/60 hover:bg-slate-700/80 border border-slate-600/50 hover:border-slate-500/70 rounded-xl transition-all duration-200 group"
              title="Search everything (⌘K)"
            >
              <Search className="w-4 h-4 text-slate-400 group-hover:text-slate-300 transition-colors" />
              <span className="text-slate-400 text-sm font-medium group-hover:text-slate-300 transition-colors">
                Search tools, generate content...
              </span>
              <div className="ml-auto flex items-center space-x-1 px-2 py-1 bg-slate-700/50 rounded-md">
                <Command className="w-3 h-3 text-slate-500" />
                <span className="text-xs text-slate-500 font-medium">K</span>
              </div>
            </button>
          </div>

          {/* User Menu or Sign In */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  data-tour="user-menu"
                  className="flex items-center space-x-2 px-3 py-2 bg-slate-700/50 hover:bg-slate-600/50 rounded-xl border border-slate-600/50 hover:border-slate-500/70 transition-all duration-200 group"
                >
                  <div className="relative">
                    <UserCircleIcon className="h-6 w-6 text-slate-300 group-hover:text-white transition-colors" />
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-gradient-to-r from-sky-400 to-purple-400 rounded-full ring-2 ring-slate-800"></div>
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="text-sm font-medium text-slate-200 group-hover:text-white transition-colors">
                      {user.displayName || "User"}
                    </span>
                    <span className="text-xs text-slate-400">
                      {billingInfo?.status === "active" ? "Pro" : "Free"}
                    </span>
                  </div>
                  <ChevronDownIcon
                    className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${
                      showUserMenu ? "rotate-180" : ""
                    }`}
                  />
                </button>
              </div>
            ) : (
              <button
                onClick={onSignInClick}
                className="px-4 py-2 bg-gradient-to-r from-sky-600 to-purple-600 hover:from-sky-500 hover:to-purple-500 text-white rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center space-x-2"
              >
                <UserCircleIcon className="h-5 w-5" />
                <span>Sign In</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* User Dropdown Menu */}
      {user && showUserMenu && (
        <div className="absolute top-full right-4 mt-2 w-72 bg-slate-800/95 backdrop-blur-xl border border-slate-600/50 rounded-2xl shadow-2xl z-50">
          {/* User Info Section */}
          <div className="p-6 border-b border-slate-700/50">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <UserCircleIcon className="h-12 w-12 text-slate-300" />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gradient-to-r from-sky-400 to-purple-400 rounded-full ring-2 ring-slate-800 flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              </div>
              <div className="flex-grow">
                <p className="text-lg font-semibold text-white">
                  {user.displayName || "User"}
                </p>
                <p className="text-sm text-slate-400">{user.email}</p>
                <div className="flex items-center mt-2">
                  <span
                    className={`text-xs px-3 py-1 rounded-full font-medium ${
                      billingInfo?.status === "active"
                        ? "bg-gradient-to-r from-sky-500/20 to-purple-500/20 text-sky-400 border border-sky-400/30"
                        : "bg-slate-700/50 text-slate-400 border border-slate-600/50"
                    }`}
                  >
                    {billingInfo?.status === "active"
                      ? "Pro Account"
                      : "Free Account"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="p-3">
            <button
              onClick={() => {
                onNavigateToAccount();
                setShowUserMenu(false);
              }}
              className="w-full text-left px-4 py-3 text-slate-300 hover:bg-slate-700/50 hover:text-white rounded-xl flex items-center space-x-3 transition-all duration-200 group"
            >
              <UserCircleIcon className="h-5 w-5 group-hover:text-sky-400 transition-colors" />
              <div>
                <p className="font-medium">Account Settings</p>
                <p className="text-xs text-slate-500">Manage your profile</p>
              </div>
            </button>

            <button
              onClick={() => {
                onNavigateToBilling();
                setShowUserMenu(false);
              }}
              className="w-full text-left px-4 py-3 text-slate-300 hover:bg-slate-700/50 hover:text-white rounded-xl flex items-center space-x-3 transition-all duration-200 group"
            >
              <CreditCardIcon className="h-5 w-5 group-hover:text-purple-400 transition-colors" />
              <div>
                <p className="font-medium">Billing & Usage</p>
                <p className="text-xs text-slate-500">Manage subscription</p>
              </div>
            </button>

            <div className="border-t border-slate-700/50 my-3"></div>

            <button
              onClick={() => {
                onSignOut();
                setShowUserMenu(false);
              }}
              className="w-full text-left px-4 py-3 text-slate-300 hover:bg-red-600/20 hover:text-red-400 rounded-xl flex items-center space-x-3 transition-all duration-200 group"
            >
              <svg
                className="h-5 w-5 group-hover:text-red-400 transition-colors"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              <div>
                <p className="font-medium">Sign Out</p>
                <p className="text-xs text-slate-500">End your session</p>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* Overlay */}
      {user && showUserMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowUserMenu(false)}
        />
      )}
    </header>
  );
};

export default AppHeader;
