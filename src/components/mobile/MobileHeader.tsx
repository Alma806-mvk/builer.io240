import React, { useState } from 'react';
import {
  MenuIcon,
  CloseIcon,
  NotificationIcon,
  CreditCardIcon,
  SettingsIcon,
  HelpIcon,
  LogOutIcon,
} from '../ProfessionalIcons';

interface MobileHeaderProps {
  user: any;
  userPlan?: string;
  title?: string;
  onSignOut?: () => void;
  onNavigateToBilling?: () => void;
  onNavigateToAccount?: () => void;
  credits?: number;
}

const MobileHeader: React.FC<MobileHeaderProps> = ({
  user,
  userPlan = 'free',
  title = 'CreateGen Studio',
  onSignOut,
  onNavigateToBilling,
  onNavigateToAccount,
  credits = 0,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
    setIsMenuOpen(!isMenuOpen);
  };

  const handleMenuItemClick = (action?: () => void) => {
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
    setIsMenuOpen(false);
    action?.();
  };

  const menuItems = [
    {
      icon: CreditCardIcon,
      label: 'Billing & Credits',
      subtitle: `${credits} credits remaining`,
      action: onNavigateToBilling,
    },
    {
      icon: SettingsIcon,
      label: 'Account Settings',
      subtitle: 'Manage your profile',
      action: onNavigateToAccount,
    },
    {
      icon: HelpIcon,
      label: 'Help & Support',
      subtitle: 'Get assistance',
      action: () => window.open('https://docs.creategen.studio', '_blank'),
    },
    {
      icon: LogOutIcon,
      label: 'Sign Out',
      subtitle: 'End your session',
      action: onSignOut,
      danger: true,
    },
  ];

  return (
    <>
      <header className="mobile-header">
        <div className="flex items-center justify-between w-full">
          {/* Logo & Title */}
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            <img
              src="https://cdn.builder.io/api/v1/image/assets%2F64ff045265d44798a3091f704fc3d25a%2F233e717aa17f46c180d3e8a805cd77d4?format=webp&width=800"
              alt="CreateGen Studio"
              className="w-8 h-8 rounded-lg flex-shrink-0"
            />
            <div className="min-w-0 flex-1">
              <h1 className="text-lg font-bold text-white truncate">
                <span className="bg-gradient-to-r from-sky-400 to-purple-400 bg-clip-text text-transparent">
                  {title}
                </span>
              </h1>
            </div>
          </div>

          {/* User Info & Menu */}
          <div className="flex items-center space-x-3">
            {/* Credits Display */}
            {user && (
              <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 rounded-xl px-3 py-1.5">
                <span className="text-xs font-medium text-slate-300">
                  {credits} 
                  <span className="text-sky-400 ml-1">credits</span>
                </span>
              </div>
            )}

            {/* Plan Badge */}
            {user && userPlan !== 'free' && (
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                PRO
              </div>
            )}

            {/* Menu Button */}
            {user && (
              <button
                onClick={toggleMenu}
                className="mobile-btn-secondary p-2 min-h-0"
                aria-label="Open menu"
              >
                <div className="mobile-hamburger">
                  <div className="mobile-hamburger-line" />
                  <div className="mobile-hamburger-line" />
                  <div className="mobile-hamburger-line" />
                </div>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      <div className={`mobile-drawer-overlay ${isMenuOpen ? 'active' : ''}`} onClick={toggleMenu} />
      <div className={`mobile-drawer ${isMenuOpen ? 'active' : ''}`}>
        {/* User Profile Section */}
        {user && (
          <div className="mobile-card mb-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-sky-500/20 to-purple-500/20 rounded-full flex items-center justify-center border border-sky-500/30">
                <span className="text-lg font-bold text-sky-400">
                  {user.displayName?.[0] || user.email?.[0] || 'U'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-white truncate">
                  {user.displayName || 'User'}
                </h3>
                <p className="text-sm text-slate-400 truncate">{user.email}</p>
                <div className="flex items-center mt-1">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    userPlan === 'free'
                      ? 'bg-slate-700/50 text-slate-400'
                      : 'bg-gradient-to-r from-purple-600/20 to-blue-600/20 text-purple-400 border border-purple-500/30'
                  }`}>
                    {userPlan === 'free' ? 'Free Plan' : 'Pro Plan'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Menu Items */}
        <div className="space-y-2">
          {menuItems.map((item, index) => (
            <button
              key={index}
              onClick={() => handleMenuItemClick(item.action)}
              className={`w-full text-left p-4 rounded-xl transition-all duration-200 flex items-center space-x-3 ${
                item.danger
                  ? 'hover:bg-red-600/10 text-red-400 hover:text-red-300'
                  : 'hover:bg-slate-700/50 text-slate-300 hover:text-white'
              }`}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-medium">{item.label}</p>
                <p className="text-xs opacity-75 truncate">{item.subtitle}</p>
              </div>
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-slate-700/50">
          <p className="text-xs text-slate-500 text-center">
            CreateGen Studio v1.0
          </p>
          <p className="text-xs text-slate-500 text-center mt-1">
            Built for creators, by creators
          </p>
        </div>
      </div>
    </>
  );
};

export default MobileHeader;
