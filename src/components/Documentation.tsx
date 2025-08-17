import React, { useState } from "react";
import {
  XMarkIcon,
  BookOpenIcon,
  SparklesIcon,
  LightBulbIcon,
  PhotoIcon,
  ShareIcon,
  ChevronRightIcon,
  ChevronDownIcon,
  PlayCircleIcon,
  SearchIcon,
  TagIcon,
  FilmIcon,
  CanvasIcon,
  ColumnsIcon,
  TrendingUpIcon,
  UserCircleIcon,
  QuestionMarkCircleIcon,
} from "./IconComponents";

interface DocumentationProps {
  isOpen: boolean;
  onClose: () => void;
}

interface DocSection {
  id: string;
  title: string;
  icon: React.ReactNode;
  content: React.ReactNode;
}

const Documentation: React.FC<DocumentationProps> = ({ isOpen, onClose }) => {
  const [activeSection, setActiveSection] = useState("getting-started");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(["getting-started"]),
  );

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  const docSections: DocSection[] = [
    {
      id: "getting-started",
      title: "Getting Started",
      icon: <PlayCircleIcon className="h-5 w-5" />,
      content: (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">
              Welcome to CreateGen Studio!
            </h3>
            <p className="text-slate-300 leading-relaxed mb-4">
              CreateGen Studio is an AI-powered content creation platform
              designed to help creators, marketers, and businesses generate
              viral content effortlessly. Whether you're creating social media
              posts, thumbnails, or marketing materials, we've got you covered.
            </p>
          </div>

          <div>
            <h4 className="text-md font-semibold text-sky-400 mb-3">
              Quick Start Guide
            </h4>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-sky-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  1
                </div>
                <div>
                  <p className="text-white font-medium">Sign Up</p>
                  <p className="text-slate-400 text-sm">
                    Create your account to get 25 free AI generations per month.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-sky-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  2
                </div>
                <div>
                  <p className="text-white font-medium">Choose Your Tool</p>
                  <p className="text-slate-400 text-sm">
                    Select from content generation, thumbnail creation, or
                    canvas design.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-sky-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  3
                </div>
                <div>
                  <p className="text-white font-medium">Generate Content</p>
                  <p className="text-slate-400 text-sm">
                    Describe what you want, and let our AI create amazing
                    content for you.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-sky-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  4
                </div>
                <div>
                  <p className="text-white font-medium">Download & Share</p>
                  <p className="text-slate-400 text-sm">
                    Export your content in high quality and share it across
                    platforms.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-sky-900/20 border border-sky-500/30 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <LightBulbIcon className="h-5 w-5 text-yellow-400" />
              <span className="font-semibold text-yellow-400">Pro Tip</span>
            </div>
            <p className="text-slate-300 text-sm">
              Be specific with your prompts! The more detailed your description,
              the better our AI can understand and create exactly what you're
              looking for.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "content-generation",
      title: "Content Generation",
      icon: <SparklesIcon className="h-5 w-5" />,
      content: (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">
              AI Content Generation
            </h3>
            <p className="text-slate-300 leading-relaxed mb-4">
              Our AI content generator can create various types of content
              including social media posts, captions, hashtags, and marketing
              copy.
            </p>
          </div>

          <div>
            <h4 className="text-md font-semibold text-sky-400 mb-3">
              Content Types
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <TagIcon className="h-4 w-4 text-blue-400" />
                  <span className="font-medium text-white">
                    Social Media Posts
                  </span>
                </div>
                <p className="text-slate-400 text-sm">
                  Instagram, Twitter, Facebook, LinkedIn posts with engaging
                  copy.
                </p>
              </div>
              <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <TagIcon className="h-4 w-4 text-green-400" />
                  <span className="font-medium text-white">
                    Hashtag Generator
                  </span>
                </div>
                <p className="text-slate-400 text-sm">
                  Trending and relevant hashtags for maximum reach.
                </p>
              </div>
              <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <SparklesIcon className="h-4 w-4 text-purple-400" />
                  <span className="font-medium text-white">Marketing Copy</span>
                </div>
                <p className="text-slate-400 text-sm">
                  Compelling sales copy and promotional content.
                </p>
              </div>
              <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <FilmIcon className="h-4 w-4 text-red-400" />
                  <span className="font-medium text-white">Video Scripts</span>
                </div>
                <p className="text-slate-400 text-sm">
                  Engaging scripts for YouTube, TikTok, and other platforms.
                </p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-md font-semibold text-sky-400 mb-3">
              Best Practices
            </h4>
            <ul className="space-y-2 text-slate-300">
              <li className="flex items-start space-x-2">
                <span className="text-sky-400 mt-1">•</span>
                <span>Be specific about your target audience and platform</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-sky-400 mt-1">•</span>
                <span>
                  Include tone and style preferences (casual, professional,
                  funny, etc.)
                </span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-sky-400 mt-1">•</span>
                <span>
                  Mention any keywords or hashtags you want to include
                </span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-sky-400 mt-1">•</span>
                <span>Specify content length if you have requirements</span>
              </li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      id: "thumbnail-maker",
      title: "Thumbnail Maker",
      icon: <PhotoIcon className="h-5 w-5" />,
      content: (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">
              AI Thumbnail Generator
            </h3>
            <p className="text-slate-300 leading-relaxed mb-4">
              Create eye-catching thumbnails for YouTube videos, blog posts, and
              social media content. Our AI generates thumbnails optimized for
              click-through rates.
            </p>
          </div>

          <div>
            <h4 className="text-md font-semibold text-sky-400 mb-3">
              Features
            </h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-3 bg-slate-800/30 rounded-lg">
                <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-red-600 rounded-lg flex items-center justify-center">
                  <PhotoIcon className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="text-white font-medium">Multiple Styles</p>
                  <p className="text-slate-400 text-sm">
                    Gaming, tutorial, vlog, and business styles
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-slate-800/30 rounded-lg">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <SparklesIcon className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="text-white font-medium">Custom Text</p>
                  <p className="text-slate-400 text-sm">
                    Add compelling titles and call-to-actions
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-slate-800/30 rounded-lg">
                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                  <CanvasIcon className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="text-white font-medium">
                    Platform Optimization
                  </p>
                  <p className="text-slate-400 text-sm">
                    Perfect dimensions for YouTube, Instagram, and more
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-md font-semibold text-sky-400 mb-3">
              How to Create Great Thumbnails
            </h4>
            <div className="space-y-4">
              <div>
                <h5 className="font-medium text-white mb-2">
                  1. Choose the Right Style
                </h5>
                <p className="text-slate-400 text-sm mb-2">
                  Select a style that matches your content and brand. Gaming
                  thumbnails should be energetic, while educational content
                  benefits from clean, professional designs.
                </p>
              </div>
              <div>
                <h5 className="font-medium text-white mb-2">
                  2. Keep Text Readable
                </h5>
                <p className="text-slate-400 text-sm mb-2">
                  Use large, bold fonts that are easy to read even on mobile
                  devices. Stick to 3-5 words maximum.
                </p>
              </div>
              <div>
                <h5 className="font-medium text-white mb-2">
                  3. Use Contrasting Colors
                </h5>
                <p className="text-slate-400 text-sm mb-2">
                  Ensure your text and main elements stand out from the
                  background. High contrast improves readability.
                </p>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "canvas-editor",
      title: "Canvas Editor",
      icon: <CanvasIcon className="h-5 w-5" />,
      content: (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">
              AI-Powered Canvas Editor
            </h3>
            <p className="text-slate-300 leading-relaxed mb-4">
              Our canvas editor combines the power of AI with intuitive design
              tools. Create professional graphics, social media posts,
              presentations, and more with AI assistance.
            </p>
          </div>

          <div>
            <h4 className="text-md font-semibold text-sky-400 mb-3">
              Tools & Features
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
                    <span className="text-white text-xs">T</span>
                  </div>
                  <span className="text-white font-medium">Text Tools</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-green-600 rounded flex items-center justify-center">
                    <PhotoIcon className="h-3 w-3 text-white" />
                  </div>
                  <span className="text-white font-medium">Image Editing</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-purple-600 rounded flex items-center justify-center">
                    <SparklesIcon className="h-3 w-3 text-white" />
                  </div>
                  <span className="text-white font-medium">AI Generation</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-red-600 rounded flex items-center justify-center">
                    <span className="text-white text-xs">◼</span>
                  </div>
                  <span className="text-white font-medium">
                    Shapes & Objects
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-yellow-600 rounded flex items-center justify-center">
                    <span className="text-white text-xs">🎨</span>
                  </div>
                  <span className="text-white font-medium">Color Palettes</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-indigo-600 rounded flex items-center justify-center">
                    <ColumnsIcon className="h-3 w-3 text-white" />
                  </div>
                  <span className="text-white font-medium">
                    Layouts & Grids
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-md font-semibold text-sky-400 mb-3">
              Premium Features
            </h4>
            <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 border border-purple-500/30 rounded-lg p-4">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <SparklesIcon className="h-4 w-4 text-purple-400" />
                  <span className="text-white font-medium">
                    AI Background Removal
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <SparklesIcon className="h-4 w-4 text-purple-400" />
                  <span className="text-white font-medium">
                    Smart Object Detection
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <SparklesIcon className="h-4 w-4 text-purple-400" />
                  <span className="text-white font-medium">Style Transfer</span>
                </div>
                <div className="flex items-center space-x-2">
                  <SparklesIcon className="h-4 w-4 text-purple-400" />
                  <span className="text-white font-medium">
                    Unlimited Exports
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "analytics",
      title: "Analytics & Insights",
      icon: <TrendingUpIcon className="h-5 w-5" />,
      content: (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">
              Performance Analytics
            </h3>
            <p className="text-slate-300 leading-relaxed mb-4">
              Track your content performance and get AI-powered insights to
              improve engagement and reach.
            </p>
          </div>

          <div>
            <h4 className="text-md font-semibold text-sky-400 mb-3">
              Available Metrics
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <TrendingUpIcon className="h-4 w-4 text-green-400" />
                  <span className="font-medium text-white">
                    Engagement Rate
                  </span>
                </div>
                <p className="text-slate-400 text-sm">
                  Likes, comments, shares, and overall engagement metrics.
                </p>
              </div>
              <div className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <TrendingUpIcon className="h-4 w-4 text-blue-400" />
                  <span className="font-medium text-white">
                    Reach & Impressions
                  </span>
                </div>
                <p className="text-slate-400 text-sm">
                  How many people saw your content and how often.
                </p>
              </div>
              <div className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <TrendingUpIcon className="h-4 w-4 text-purple-400" />
                  <span className="font-medium text-white">
                    Best Posting Times
                  </span>
                </div>
                <p className="text-slate-400 text-sm">
                  AI-powered recommendations for optimal posting schedules.
                </p>
              </div>
              <div className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <TrendingUpIcon className="h-4 w-4 text-yellow-400" />
                  <span className="font-medium text-white">
                    Content Performance
                  </span>
                </div>
                <p className="text-slate-400 text-sm">
                  Which types of content perform best for your audience.
                </p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-md font-semibold text-sky-400 mb-3">
              AI Insights
            </h4>
            <p className="text-slate-300 mb-3">
              Our AI analyzes your content performance and provides actionable
              recommendations:
            </p>
            <ul className="space-y-2 text-slate-300">
              <li className="flex items-start space-x-2">
                <span className="text-sky-400 mt-1">•</span>
                <span>Content optimization suggestions</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-sky-400 mt-1">•</span>
                <span>Trending hashtag recommendations</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-sky-400 mt-1">•</span>
                <span>Audience engagement patterns</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-sky-400 mt-1">•</span>
                <span>Competitor analysis and benchmarking</span>
              </li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      id: "account",
      title: "Account & Billing",
      icon: <UserCircleIcon className="h-5 w-5" />,
      content: (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">
              Account Management
            </h3>
            <p className="text-slate-300 leading-relaxed mb-4">
              Manage your account settings, subscription, and billing
              information.
            </p>
          </div>

          <div>
            <h4 className="text-md font-semibold text-sky-400 mb-3">
              Subscription Plans
            </h4>
            <div className="space-y-4">
              <div className="border border-slate-700/50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h5 className="font-medium text-white">Free Plan</h5>
                  <span className="text-sky-400 font-semibold">$0/month</span>
                </div>
                <ul className="space-y-1 text-sm text-slate-400">
                  <li>• 25 AI generations per month</li>
                  <li>• Basic templates</li>
                  <li>• Standard export quality</li>
                  <li>• Community support</li>
                </ul>
              </div>
              <div className="border border-purple-500/50 rounded-lg p-4 bg-purple-900/10">
                <div className="flex items-center justify-between mb-2">
                  <h5 className="font-medium text-white">Pro Plan</h5>
                  <span className="text-purple-400 font-semibold">
                    $29/month
                  </span>
                </div>
                <ul className="space-y-1 text-sm text-slate-400">
                  <li>• Unlimited AI generations</li>
                  <li>• Premium templates & styles</li>
                  <li>• HD/4K export quality</li>
                  <li>• Advanced analytics</li>
                  <li>• Priority support</li>
                </ul>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-md font-semibold text-sky-400 mb-3">
              Billing & Payments
            </h4>
            <div className="space-y-3">
              <div>
                <h5 className="font-medium text-white mb-2">Payment Methods</h5>
                <p className="text-slate-400 text-sm">
                  We accept all major credit cards, PayPal, and other payment
                  methods via Stripe's secure processing.
                </p>
              </div>
              <div>
                <h5 className="font-medium text-white mb-2">Billing Cycle</h5>
                <p className="text-slate-400 text-sm">
                  Monthly and annual billing options available. Annual plans
                  save 20% compared to monthly billing.
                </p>
              </div>
              <div>
                <h5 className="font-medium text-white mb-2">Cancellation</h5>
                <p className="text-slate-400 text-sm">
                  Cancel anytime from your account settings. No hidden fees or
                  cancellation charges.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-green-400">🛡️</span>
              <span className="font-semibold text-green-400">
                30-Day Money-Back Guarantee
              </span>
            </div>
            <p className="text-slate-300 text-sm">
              Not satisfied? Get a full refund within 30 days of your
              subscription, no questions asked.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "troubleshooting",
      title: "Troubleshooting",
      icon: <QuestionMarkCircleIcon className="h-5 w-5" />,
      content: (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">
              Common Issues & Solutions
            </h3>
            <p className="text-slate-300 leading-relaxed mb-4">
              Find solutions to the most common problems and learn how to get
              the best results from CreateGen Studio.
            </p>
          </div>

          <div className="space-y-4">
            <div className="border border-slate-700/50 rounded-lg p-4">
              <h4 className="font-medium text-white mb-2">
                AI generation is too slow
              </h4>
              <div className="text-slate-400 text-sm space-y-1">
                <p>• Check your internet connection</p>
                <p>• Try generating during off-peak hours</p>
                <p>• Simplify your prompt if it's very complex</p>
                <p>• Contact support if the issue persists</p>
              </div>
            </div>

            <div className="border border-slate-700/50 rounded-lg p-4">
              <h4 className="font-medium text-white mb-2">
                Generated content doesn't match my request
              </h4>
              <div className="text-slate-400 text-sm space-y-1">
                <p>• Be more specific in your prompt</p>
                <p>• Include style and tone preferences</p>
                <p>• Mention your target audience</p>
                <p>• Try regenerating with different keywords</p>
              </div>
            </div>

            <div className="border border-slate-700/50 rounded-lg p-4">
              <h4 className="font-medium text-white mb-2">
                Can't export or download content
              </h4>
              <div className="text-slate-400 text-sm space-y-1">
                <p>• Check if you have sufficient credits</p>
                <p>• Ensure content generation is complete</p>
                <p>• Try a different browser or clear cache</p>
                <p>• Check your download folder permissions</p>
              </div>
            </div>

            <div className="border border-slate-700/50 rounded-lg p-4">
              <h4 className="font-medium text-white mb-2">
                Account or billing issues
              </h4>
              <div className="text-slate-400 text-sm space-y-1">
                <p>• Check your account page for status updates</p>
                <p>• Verify payment method is valid</p>
                <p>• Contact support with your account details</p>
                <p>• Check spam folder for billing emails</p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-md font-semibold text-sky-400 mb-3">
              Still Need Help?
            </h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-3 bg-slate-800/30 rounded-lg">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm">💬</span>
                </div>
                <div>
                  <p className="text-white font-medium">
                    Use the Feedback Widget
                  </p>
                  <p className="text-slate-400 text-sm">
                    Click the help button in the bottom right corner
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-slate-800/30 rounded-lg">
                <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm">📧</span>
                </div>
                <div>
                  <p className="text-white font-medium">Email Support</p>
                  <p className="text-slate-400 text-sm">
                    creategenstudio@gmail.com
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
    },
  ];

  const filteredSections = docSections.filter(
    (section) =>
      section.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      section.content
        .toString()
        .toLowerCase()
        .includes(searchQuery.toLowerCase()),
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm">
      <div className="flex h-full">
        {/* Sidebar */}
        <div className="w-80 bg-slate-900/95 border-r border-slate-700/50 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-700/50">
            <div className="flex items-center space-x-2">
              <BookOpenIcon className="h-6 w-6 text-sky-400" />
              <h1 className="text-xl font-bold text-white">Documentation</h1>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-slate-700/50"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>

          {/* Search */}
          <div className="p-4 border-b border-slate-700/50">
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search documentation..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Navigation */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-2">
              {filteredSections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 text-left ${
                    activeSection === section.id
                      ? "bg-sky-600/20 text-sky-400 border border-sky-500/30"
                      : "text-slate-300 hover:text-white hover:bg-slate-800/50"
                  }`}
                >
                  <div
                    className={`${activeSection === section.id ? "text-sky-400" : "text-slate-400"}`}
                  >
                    {section.icon}
                  </div>
                  <span className="font-medium">{section.title}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 bg-slate-800/95 overflow-y-auto">
          <div className="p-8 max-w-4xl">
            {
              filteredSections.find((section) => section.id === activeSection)
                ?.content
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default Documentation;
