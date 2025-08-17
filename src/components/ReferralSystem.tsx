import React, { useState, useEffect } from "react";
import {
  ShareIcon,
  GiftIcon,
  UsersIcon,
  CopyIcon,
  CheckCircleIcon,
  StarIcon,
  BoltIcon,
  TrophyIcon,
  SparklesIcon,
} from "./IconComponents";

interface ReferralStats {
  totalReferrals: number;
  successfulReferrals: number;
  creditsEarned: number;
  currentTier: string;
  nextTierProgress: number;
  referralCode: string;
}

interface ReferralTier {
  name: string;
  requirement: number;
  creditsPerReferral: number;
  bonusReward: string;
  color: string;
  icon: React.ReactNode;
}

const ReferralSystem: React.FC = () => {
  const [referralStats, setReferralStats] = useState<ReferralStats>({
    totalReferrals: 12,
    successfulReferrals: 8,
    creditsEarned: 120,
    currentTier: "Bronze",
    nextTierProgress: 60,
    referralCode: "CREATE2025",
  });

  const [copied, setCopied] = useState(false);
  const [shareMethod, setShareMethod] = useState<string | null>(null);

  const tiers: ReferralTier[] = [
    {
      name: "Bronze",
      requirement: 0,
      creditsPerReferral: 10,
      bonusReward: "Welcome Kit",
      color: "from-orange-600 to-amber-600",
      icon: <BoltIcon className="h-6 w-6" />,
    },
    {
      name: "Silver",
      requirement: 5,
      creditsPerReferral: 15,
      bonusReward: "Premium Templates",
      color: "from-slate-400 to-slate-600",
      icon: <StarIcon className="h-6 w-6" />,
    },
    {
      name: "Gold",
      requirement: 15,
      creditsPerReferral: 25,
      bonusReward: "1 Month Pro Free",
      color: "from-yellow-400 to-yellow-600",
      icon: <TrophyIcon className="h-6 w-6" />,
    },
    {
      name: "Platinum",
      requirement: 50,
      creditsPerReferral: 50,
      bonusReward: "Lifetime Pro Access",
      color: "from-purple-400 to-purple-600",
      icon: <SparklesIcon className="h-6 w-6" />,
    },
  ];

  const shareOptions = [
    {
      name: "Twitter",
      icon: "🐦",
      url: `https://twitter.com/intent/tweet?text=I'm creating amazing content with CreateGen Studio! Get 25 free AI generations when you sign up with my link: https://creategen.studio?ref=${referralStats.referralCode}`,
    },
    {
      name: "LinkedIn",
      icon: "💼",
      url: `https://www.linkedin.com/sharing/share-offsite/?url=https://creategen.studio?ref=${referralStats.referralCode}`,
    },
    {
      name: "Facebook",
      icon: "📘",
      url: `https://www.facebook.com/sharer/sharer.php?u=https://creategen.studio?ref=${referralStats.referralCode}`,
    },
    {
      name: "WhatsApp",
      icon: "💬",
      url: `https://wa.me/?text=Check out CreateGen Studio! I've been using it to create amazing content with AI. Get 25 free generations: https://creategen.studio?ref=${referralStats.referralCode}`,
    },
  ];

  const currentTier =
    tiers.find((tier) => tier.name === referralStats.currentTier) || tiers[0];
  const nextTier =
    tiers[
      tiers.findIndex((tier) => tier.name === referralStats.currentTier) + 1
    ];

  const copyReferralLink = async () => {
    const referralLink = `https://creategen.studio?ref=${referralStats.referralCode}`;
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  const handleShare = (platform: string, url: string) => {
    setShareMethod(platform);
    window.open(url, "_blank", "width=600,height=400");
    setTimeout(() => setShareMethod(null), 1000);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="w-20 h-20 mx-auto bg-gradient-to-br from-sky-500 to-indigo-600 rounded-full flex items-center justify-center mb-6">
          <GiftIcon className="h-10 w-10 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-4">
          Refer Friends & Earn Rewards
        </h1>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
          Share CreateGen Studio with your friends and earn credits for every
          successful referral. The more you refer, the better the rewards!
        </p>
      </div>

      {/* Current Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <UsersIcon className="h-8 w-8 text-sky-400" />
            <span className="text-2xl font-bold text-white">
              {referralStats.totalReferrals}
            </span>
          </div>
          <h3 className="text-slate-400 text-sm">Total Referrals</h3>
          <p className="text-green-400 text-xs mt-1">+3 this month</p>
        </div>

        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <CheckCircleIcon className="h-8 w-8 text-green-400" />
            <span className="text-2xl font-bold text-white">
              {referralStats.successfulReferrals}
            </span>
          </div>
          <h3 className="text-slate-400 text-sm">Successful Signups</h3>
          <p className="text-green-400 text-xs mt-1">
            {Math.round(
              (referralStats.successfulReferrals /
                referralStats.totalReferrals) *
                100,
            )}
            % conversion rate
          </p>
        </div>

        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <BoltIcon className="h-8 w-8 text-yellow-400" />
            <span className="text-2xl font-bold text-white">
              {referralStats.creditsEarned}
            </span>
          </div>
          <h3 className="text-slate-400 text-sm">Credits Earned</h3>
          <p className="text-yellow-400 text-xs mt-1">
            ≈ ${(referralStats.creditsEarned * 0.1).toFixed(0)} value
          </p>
        </div>

        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <div
              className={`p-2 bg-gradient-to-r ${currentTier.color} rounded-lg text-white`}
            >
              {currentTier.icon}
            </div>
            <span className="text-2xl font-bold text-white">
              {currentTier.name}
            </span>
          </div>
          <h3 className="text-slate-400 text-sm">Current Tier</h3>
          <p className="text-sky-400 text-xs mt-1">
            {currentTier.creditsPerReferral} credits/referral
          </p>
        </div>
      </div>

      {/* Tier Progress */}
      {nextTier && (
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-lg font-semibold text-white">
                Progress to {nextTier.name}
              </h3>
              <p className="text-slate-400 text-sm">
                {referralStats.successfulReferrals}/{nextTier.requirement}{" "}
                successful referrals
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-400">Next Reward</p>
              <p className="font-semibold text-yellow-400">
                {nextTier.bonusReward}
              </p>
            </div>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-3">
            <div
              className={`h-3 rounded-full bg-gradient-to-r ${nextTier.color} transition-all duration-500`}
              style={{
                width: `${Math.min((referralStats.successfulReferrals / nextTier.requirement) * 100, 100)}%`,
              }}
            ></div>
          </div>
          <p className="text-slate-400 text-xs mt-2">
            {Math.max(
              0,
              nextTier.requirement - referralStats.successfulReferrals,
            )}{" "}
            more referrals to unlock {nextTier.name}
          </p>
        </div>
      )}

      {/* Referral Link */}
      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
          <ShareIcon className="h-6 w-6 text-sky-400 mr-3" />
          Your Referral Link
        </h3>
        <div className="flex items-center space-x-3 mb-4">
          <div className="flex-1 bg-slate-900 rounded-lg p-3 font-mono text-sm text-slate-300 border border-slate-700">
            https://creategen.studio?ref={referralStats.referralCode}
          </div>
          <button
            onClick={copyReferralLink}
            className={`px-4 py-3 rounded-lg font-semibold transition-all ${
              copied
                ? "bg-green-600 text-white"
                : "bg-sky-600 hover:bg-sky-700 text-white"
            }`}
          >
            {copied ? (
              <CheckCircleIcon className="h-5 w-5" />
            ) : (
              <CopyIcon className="h-5 w-5" />
            )}
          </button>
        </div>
        <p className="text-slate-400 text-sm">
          Share this link with friends. They get 25 free generations, you get{" "}
          {currentTier.creditsPerReferral} credits!
        </p>
      </div>

      {/* Share Buttons */}
      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <h3 className="text-xl font-semibold text-white mb-4">
          Share on Social Media
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {shareOptions.map((option) => (
            <button
              key={option.name}
              onClick={() => handleShare(option.name, option.url)}
              className={`p-4 rounded-lg border border-slate-600 hover:border-slate-500 transition-all hover:scale-105 ${
                shareMethod === option.name
                  ? "bg-sky-500/20 border-sky-500"
                  : "bg-slate-900"
              }`}
            >
              <div className="text-center">
                <span className="text-2xl mb-2 block">{option.icon}</span>
                <p className="text-white font-medium text-sm">{option.name}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Tier Benefits */}
      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <h3 className="text-xl font-semibold text-white mb-6">
          Referral Tiers & Rewards
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {tiers.map((tier, index) => (
            <div
              key={tier.name}
              className={`p-4 rounded-lg border-2 transition-all ${
                tier.name === referralStats.currentTier
                  ? "border-sky-500 bg-sky-500/10"
                  : "border-slate-600 bg-slate-900"
              }`}
            >
              <div
                className={`w-12 h-12 bg-gradient-to-r ${tier.color} rounded-lg flex items-center justify-center mb-3 text-white`}
              >
                {tier.icon}
              </div>
              <h4 className="font-semibold text-white mb-2">{tier.name}</h4>
              <div className="space-y-1 text-sm">
                <p className="text-slate-400">
                  {tier.requirement === 0
                    ? "Starting tier"
                    : `${tier.requirement}+ referrals`}
                </p>
                <p className="text-green-400">
                  {tier.creditsPerReferral} credits/referral
                </p>
                <p className="text-yellow-400">{tier.bonusReward}</p>
              </div>
              {tier.name === referralStats.currentTier && (
                <div className="mt-2">
                  <span className="inline-block px-2 py-1 bg-sky-500 text-white text-xs rounded-full">
                    Current
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <h3 className="text-xl font-semibold text-white mb-6">How It Works</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-sky-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShareIcon className="h-8 w-8 text-sky-400" />
            </div>
            <h4 className="font-semibold text-white mb-2">
              1. Share Your Link
            </h4>
            <p className="text-slate-400 text-sm">
              Share your unique referral link with friends, family, or on social
              media
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <UsersIcon className="h-8 w-8 text-green-400" />
            </div>
            <h4 className="font-semibold text-white mb-2">
              2. Friends Sign Up
            </h4>
            <p className="text-slate-400 text-sm">
              When someone signs up using your link, they get 25 free
              generations
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <GiftIcon className="h-8 w-8 text-yellow-400" />
            </div>
            <h4 className="font-semibold text-white mb-2">
              3. You Earn Rewards
            </h4>
            <p className="text-slate-400 text-sm">
              Get credits for each successful referral and unlock tier bonuses
            </p>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <h3 className="text-xl font-semibold text-white mb-4">
          Frequently Asked Questions
        </h3>
        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-white mb-1">
              How long do credits last?
            </h4>
            <p className="text-slate-400 text-sm">
              Credits never expire and can be used for any premium features.
            </p>
          </div>
          <div>
            <h4 className="font-medium text-white mb-1">
              Can I refer the same person multiple times?
            </h4>
            <p className="text-slate-400 text-sm">
              No, each unique user can only be referred once per account.
            </p>
          </div>
          <div>
            <h4 className="font-medium text-white mb-1">
              When do I receive my credits?
            </h4>
            <p className="text-slate-400 text-sm">
              Credits are awarded instantly when your referral completes their
              signup.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReferralSystem;
