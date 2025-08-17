import React from "react";
import { ContentType } from "../../types";
import {
  PREMIUM_CONTENT_TYPES,
  USER_SELECTABLE_CONTENT_TYPES,
} from "../../constants";
import AppNotifications from "../utils/appNotifications";
import {
  ChartIcon,
  FilmStripIcon,
  MicrophoneIcon,
  EmailIcon,
  WorkflowIcon,
  GraduationIcon,
  YouTubeIcon,
  RocketIcon,
  StarIcon,
} from './ProfessionalIcons';

interface PremiumContentTypesShowcaseProps {
  userPlan?: "free" | "pro" | "enterprise";
  isPremiumUser?: boolean;
  onSelectContentType?: (contentType: ContentType) => void;
  onClose?: () => void;
  onUpgrade?: () => void;
}

export const PremiumContentTypesShowcase: React.FC<
  PremiumContentTypesShowcaseProps
> = ({
  userPlan = "free",
  isPremiumUser = false,
  onSelectContentType,
  onClose,
  onUpgrade,
}) => {
  const premiumContentTypeDetails = USER_SELECTABLE_CONTENT_TYPES.filter((ct) =>
    PREMIUM_CONTENT_TYPES.includes(ct.value),
  );

  const handleSelectContentType = (contentType: ContentType) => {
    if (!isPremiumUser) {
      AppNotifications.custom(
        "Premium Feature Required",
        `${USER_SELECTABLE_CONTENT_TYPES.find((ct) => ct.value === contentType)?.label} requires Creator Pro or Enterprise plan. Upgrade to access advanced content generation.`,
        "warning",
        {
          icon: "⭐",
          duration: 8000,
          actionText: "Upgrade Now",
          onAction: () => onUpgrade?.(),
        },
      );
      return;
    }

    onSelectContentType?.(contentType);
  };

  return (
    <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-3xl border border-slate-700/50 p-8 shadow-2xl">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent mb-2">
            ⭐ Premium Content Types
          </h2>
          <p className="text-slate-300 text-sm">
            Advanced content generation for serious creators
          </p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        )}
      </div>

      {!isPremiumUser && (
        <div className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 rounded-xl p-4 mb-6">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🚀</span>
            <div className="flex-1">
              <h3 className="text-amber-300 font-semibold text-sm mb-1">
                Unlock Advanced Content Creation
              </h3>
              <p className="text-amber-200/80 text-xs leading-relaxed">
                Get access to professional-grade content types including video
                scripts with shot lists, email sequences, sales funnels, and
                more. Perfect for creators who want to scale.
              </p>
            </div>
            <button
              onClick={() => onUpgrade?.()}
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white px-4 py-2 rounded-lg text-xs font-medium transition-all shrink-0"
            >
              Upgrade to Pro
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {premiumContentTypeDetails.map((contentType) => {
          const isAccessible = isPremiumUser;

          return (
            <div
              key={contentType.value}
              onClick={() => handleSelectContentType(contentType.value)}
              className={`
                group relative overflow-hidden rounded-xl border border-slate-600/50 p-4 cursor-pointer transition-all duration-300
                ${
                  isAccessible
                    ? "hover:border-amber-400/50 hover:bg-gradient-to-br hover:from-amber-500/10 hover:to-orange-500/10 hover:scale-105"
                    : "opacity-70 hover:opacity-90"
                }
              `}
            >
              {!isAccessible && (
                <div className="absolute top-3 right-3">
                  <span className="text-amber-400 text-lg">🔒</span>
                </div>
              )}

              <div className="flex items-start gap-3">
                <div className="shrink-0">
                  {getContentTypeIcon(contentType.value)}
                </div>
                <div className="flex-1 min-w-0">
                  <h3
                    className={`font-semibold text-sm mb-2 ${isAccessible ? "text-white" : "text-slate-300"}`}
                  >
                    {contentType.label}
                    {!isAccessible && (
                      <span className="text-amber-400 ml-2 text-xs">Pro</span>
                    )}
                  </h3>
                  <p className="text-slate-400 text-xs leading-relaxed line-clamp-3">
                    {contentType.description}
                  </p>

                  {isAccessible && (
                    <div className="mt-3 text-xs text-amber-400 opacity-0 group-hover:opacity-100 transition-opacity">
                      Click to use →
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {isPremiumUser && (
        <div className="mt-6 text-center">
          <p className="text-slate-400 text-sm">
            You have access to all premium content types! 🎉
          </p>
        </div>
      )}
    </div>
  );
};

// Helper function to get appropriate icon for each content type
const getContentTypeIcon = (contentType: ContentType) => {
  const iconMap = {
    [ContentType.InteractivePollsQuizzes]: (
      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
        <ChartIcon className="w-4 h-4 text-white" />
      </div>
    ),
    [ContentType.VideoScriptWithShotList]: (
      <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-pink-500 rounded-lg flex items-center justify-center">
        <FilmStripIcon className="w-4 h-4 text-white" />
      </div>
    ),
    [ContentType.PodcastEpisodeOutline]: (
      <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-teal-500 rounded-lg flex items-center justify-center">
        <MicrophoneIcon className="w-4 h-4 text-white" />
      </div>
    ),
    [ContentType.EmailMarketingSequence]: (
      <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-amber-500 rounded-lg flex items-center justify-center">
        <EmailIcon className="w-4 h-4 text-white" />
      </div>
    ),
    [ContentType.SalesFunnelContent]: (
      <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-lg flex items-center justify-center">
        <WorkflowIcon className="w-4 h-4 text-white" />
      </div>
    ),
    [ContentType.CourseEducationalContent]: (
      <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center">
        <GraduationIcon className="w-4 h-4 text-white" />
      </div>
    ),
    [ContentType.LiveStreamScript]: (
      <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-rose-500 rounded-lg flex items-center justify-center">
        <YouTubeIcon className="w-4 h-4 text-white" />
      </div>
    ),
    [ContentType.ProductLaunchCampaign]: (
      <div className="w-8 h-8 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
        <RocketIcon className="w-4 h-4 text-white" />
      </div>
    ),
  };

  return (
    iconMap[contentType] || (
      <div className="w-8 h-8 bg-gradient-to-br from-slate-500 to-slate-600 rounded-lg flex items-center justify-center">
        <StarIcon className="w-4 h-4 text-white" />
      </div>
    )
  );
};

export default PremiumContentTypesShowcase;
