import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Wand2,
  Zap,
  Target,
  Globe,
  Users,
  Trending,
  Video,
  Image,
  FileText,
  Mic,
  Hash,
  Send,
  Save,
  Share2,
  Download,
  RefreshCw,
  Settings,
  ChevronDown,
  Plus,
  Star,
  Clock,
  TrendingUp,
  Eye,
  Heart,
  MessageSquare,
  BarChart3,
  Brain,
  Lightbulb,
  Rocket,
  Award,
  Filter,
  Search,
  History,
  BookOpen,
  Palette,
  Volume2,
  CheckCircle,
  AlertCircle,
  Copy,
} from "lucide-react";
import {
  YouTubeIcon,
  TikTokIcon,
  InstagramIcon,
  TwitterIcon,
  LinkedInIcon,
  BlogPostIcon,
} from './ProfessionalIcons';

// Import our world-class components
import {
  Button,
  Card,
  Badge,
  GradientText,
  StatCard,
  ProgressBar,
  Input,
} from "./ui/WorldClassComponents";

interface ContentTemplate {
  id: string;
  name: string;
  description: string;
  type: string;
  platform: string;
  icon: React.ReactNode;
  popular?: boolean;
  premium?: boolean;
  tags: string[];
}

interface GeneratedContent {
  id: string;
  content: string;
  type: string;
  platform: string;
  timestamp: Date;
  performance?: {
    engagement: number;
    reach: number;
    conversions: number;
  };
  variations?: string[];
}

interface GeneratorWorldClassProps {
  userInput: string;
  setUserInput: (input: string) => void;
  contentType: string;
  setContentType: (type: string) => void;
  platform: string;
  setPlatform: (platform: string) => void;
  targetAudience: string;
  setTargetAudience: (audience: string) => void;
  generatedOutput: string;
  isLoading: boolean;
  onGenerate: () => void;
  onSaveToHistory: (content: string) => void;
  userPlan?: string;
  history?: any[];
}

const GeneratorWorldClass: React.FC<GeneratorWorldClassProps> = ({
  userInput,
  setUserInput,
  contentType,
  setContentType,
  platform,
  setPlatform,
  targetAudience,
  setTargetAudience,
  generatedOutput,
  isLoading,
  onGenerate,
  onSaveToHistory,
  userPlan = "free",
  history = [],
}) => {
  const [activeView, setActiveView] = useState<'create' | 'templates' | 'history' | 'insights'>('create');
  const [selectedTemplate, setSelectedTemplate] = useState<ContentTemplate | null>(null);
  const [advancedMode, setAdvancedMode] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [generationCount, setGenerationCount] = useState(0);
  const [todayGenerations, setTodayGenerations] = useState(12);
  const [weeklyGoal] = useState(50);

  // Content templates
  const templates: ContentTemplate[] = [
    {
      id: 'viral-hook',
      name: 'Viral Hook',
      description: 'Create attention-grabbing opening lines',
      type: 'hook',
      platform: 'all',
      icon: <Zap className="w-4 h-4" />,
      popular: true,
      tags: ['viral', 'engagement', 'opening']
    },
    {
      id: 'story-thread',
      name: 'Story Thread',
      description: 'Engaging multi-part storytelling',
      type: 'thread',
      platform: 'twitter',
      icon: <MessageSquare className="w-4 h-4" />,
      premium: true,
      tags: ['storytelling', 'thread', 'narrative']
    },
    {
      id: 'youtube-script',
      name: 'YouTube Script',
      description: 'Complete video script with timestamps',
      type: 'script',
      platform: 'youtube',
      icon: <Video className="w-4 h-4" />,
      popular: true,
      tags: ['video', 'script', 'youtube']
    },
    {
      id: 'linkedin-post',
      name: 'LinkedIn Post',
      description: 'Professional networking content',
      type: 'post',
      platform: 'linkedin',
      icon: <Users className="w-4 h-4" />,
      tags: ['professional', 'networking', 'business']
    },
    {
      id: 'tiktok-script',
      name: 'TikTok Script',
      description: 'Short-form video content',
      type: 'script',
      platform: 'tiktok',
      icon: <Volume2 className="w-4 h-4" />,
      popular: true,
      tags: ['short-form', 'trending', 'viral']
    },
    {
      id: 'email-sequence',
      name: 'Email Sequence',
      description: 'Multi-part email campaign',
      type: 'email',
      platform: 'email',
      icon: <Send className="w-4 h-4" />,
      premium: true,
      tags: ['email', 'sequence', 'marketing']
    }
  ];

  const platforms = [
    { id: 'youtube', name: 'YouTube', icon: <YouTubeIcon className="w-4 h-4" />, color: '#FF0000' },
    { id: 'tiktok', name: 'TikTok', icon: <TikTokIcon className="w-4 h-4" />, color: '#000000' },
    { id: 'instagram', name: 'Instagram', icon: <InstagramIcon className="w-4 h-4" />, color: '#E4405F' },
    { id: 'twitter', name: 'Twitter', icon: <TwitterIcon className="w-4 h-4" />, color: '#1DA1F2' },
    { id: 'linkedin', name: 'LinkedIn', icon: <LinkedInIcon className="w-4 h-4" />, color: '#0077B5' },
    { id: 'blog', name: 'Blog', icon: <BlogPostIcon className="w-4 h-4" />, color: '#6B46C1' },
  ];

  const contentTypes = [
    { id: 'post', name: 'Social Post', icon: <MessageSquare className="w-4 h-4" /> },
    { id: 'script', name: 'Video Script', icon: <Video className="w-4 h-4" /> },
    { id: 'thread', name: 'Thread', icon: <Hash className="w-4 h-4" /> },
    { id: 'story', name: 'Story', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'email', name: 'Email', icon: <Send className="w-4 h-4" /> },
    { id: 'ad', name: 'Advertisement', icon: <Target className="w-4 h-4" /> },
  ];

  const handleGenerate = () => {
    setGenerationCount(prev => prev + 1);
    onGenerate();
  };

  const handleTemplateSelect = (template: ContentTemplate) => {
    setSelectedTemplate(template);
    setContentType(template.type);
    setPlatform(template.platform);
    setUserInput(`Create a ${template.name.toLowerCase()} for ${platform}`);
  };

  const recentGenerations = history.slice(0, 3);

  return (
    <div className="h-full flex flex-col bg-[var(--surface-primary)]">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800 via-slate-900 to-slate-800 p-6 text-white border-b border-slate-700/50 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-sky-300 via-purple-300 to-emerald-300 bg-clip-text text-transparent drop-shadow-lg">
              AI Content Generator
            </h1>
            <p className="text-xl text-slate-200 font-medium leading-relaxed tracking-wide">
              Create viral content that engages your audience
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{todayGenerations}</div>
              <div className="text-sm opacity-75">Today</div>
            </div>
            <div className="w-16 h-16 relative">
              <svg className="w-16 h-16 transform -rotate-90">
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  fill="none"
                  stroke="rgba(255,255,255,0.2)"
                  strokeWidth="4"
                />
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  fill="none"
                  stroke="white"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeDasharray={`${(todayGenerations / weeklyGoal) * 175.93} 175.93`}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-sm font-bold">{Math.round((todayGenerations / weeklyGoal) * 100)}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-[var(--surface-secondary)] border-b border-[var(--border-primary)]">
        <div className="flex space-x-6 px-6">
          {[
            { id: 'create', label: 'Create', icon: <Sparkles className="w-4 h-4" /> },
            { id: 'templates', label: 'Templates', icon: <BookOpen className="w-4 h-4" /> },
            { id: 'history', label: 'History', icon: <History className="w-4 h-4" /> },
            { id: 'insights', label: 'Insights', icon: <BarChart3 className="w-4 h-4" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveView(tab.id as any)}
              className={`flex items-center space-x-2 py-4 px-2 border-b-2 transition-colors ${
                activeView === tab.id
                  ? 'border-[var(--brand-primary)] text-[var(--brand-primary)]'
                  : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              {tab.icon}
              <span className="font-medium">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          {activeView === 'create' && (
            <motion.div
              key="create"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="h-full flex"
            >
              {/* Input Panel */}
              <div className="w-1/2 p-6 border-r border-[var(--border-primary)] overflow-y-auto">
                <div className="space-y-6">
                  {/* Platform Selection */}
                  <Card>
                    <div className="space-y-4">
                      <h3 className="heading-4">Platform</h3>
                      <div className="grid grid-cols-3 gap-3">
                        {platforms.map((p) => (
                          <Button
                            key={p.id}
                            variant={platform === p.id ? "primary" : "ghost"}
                            onClick={() => setPlatform(p.id)}
                            className="justify-start"
                          >
                            <span style={{ color: platform === p.id ? 'white' : p.color }}>
                              {p.icon}
                            </span>
                            <span className="ml-2">{p.name}</span>
                          </Button>
                        ))}
                      </div>
                    </div>
                  </Card>

                  {/* Content Type */}
                  <Card>
                    <div className="space-y-4">
                      <h3 className="heading-4">Content Type</h3>
                      <div className="grid grid-cols-2 gap-3">
                        {contentTypes.map((type) => (
                          <Button
                            key={type.id}
                            variant={contentType === type.id ? "primary" : "ghost"}
                            onClick={() => setContentType(type.id)}
                            className="justify-start"
                          >
                            {type.icon}
                            <span className="ml-2">{type.name}</span>
                          </Button>
                        ))}
                      </div>
                    </div>
                  </Card>

                  {/* Input Field */}
                  <Card>
                    <div className="space-y-4">
                      <h3 className="heading-4">Describe Your Content</h3>
                      <textarea
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        placeholder="Describe what you want to create... Be specific about your goals, tone, and key points."
                        className="w-full h-32 p-4 bg-[var(--surface-tertiary)] border border-[var(--border-primary)] rounded-xl resize-none focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent outline-none"
                      />
                      
                      <div className="flex items-center justify-between text-sm text-[var(--text-secondary)]">
                        <span>{userInput.length}/500 characters</span>
                        <Button variant="ghost" size="sm">
                          <Mic className="w-4 h-4" />
                          Voice Input
                        </Button>
                      </div>
                    </div>
                  </Card>

                  {/* Target Audience */}
                  <Card>
                    <div className="space-y-4">
                      <h3 className="heading-4">Target Audience</h3>
                      <Input
                        value={targetAudience}
                        onChange={(e) => setTargetAudience(e.target.value)}
                        placeholder="e.g., Small business owners, Tech enthusiasts, Students..."
                      />
                    </div>
                  </Card>

                  {/* Advanced Options */}
                  <Card>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="heading-4">Advanced Options</h3>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setAdvancedMode(!advancedMode)}
                        >
                          <Settings className="w-4 h-4" />
                          <ChevronDown className={`w-4 h-4 ml-1 transition-transform ${advancedMode ? 'rotate-180' : ''}`} />
                        </Button>
                      </div>
                      
                      <AnimatePresence>
                        {advancedMode && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="space-y-4"
                          >
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium mb-2">Tone</label>
                                <select className="w-full p-2 bg-[var(--surface-tertiary)] border border-[var(--border-primary)] rounded-lg">
                                  <option>Professional</option>
                                  <option>Casual</option>
                                  <option>Humorous</option>
                                  <option>Educational</option>
                                  <option>Inspirational</option>
                                </select>
                              </div>
                              
                              <div>
                                <label className="block text-sm font-medium mb-2">Length</label>
                                <select className="w-full p-2 bg-[var(--surface-tertiary)] border border-[var(--border-primary)] rounded-lg">
                                  <option>Short</option>
                                  <option>Medium</option>
                                  <option>Long</option>
                                  <option>Custom</option>
                                </select>
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-4">
                              <label className="flex items-center space-x-2">
                                <input type="checkbox" className="w-4 h-4" />
                                <span className="text-sm">Include CTA</span>
                              </label>
                              <label className="flex items-center space-x-2">
                                <input type="checkbox" className="w-4 h-4" />
                                <span className="text-sm">SEO Optimized</span>
                              </label>
                              <label className="flex items-center space-x-2">
                                <input type="checkbox" className="w-4 h-4" />
                                <span className="text-sm">Include Hashtags</span>
                              </label>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </Card>

                  {/* Generate Button */}
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={handleGenerate}
                    disabled={isLoading || !userInput.trim()}
                    className="w-full"
                  >
                    {isLoading ? (
                      <>
                        <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5 mr-2" />
                        Generate Content
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {/* Output Panel */}
              <div className="w-1/2 p-6 overflow-y-auto">
                <div className="space-y-6">
                  {!generatedOutput && !isLoading && (
                    <div className="text-center py-16">
                      <div className="w-24 h-24 bg-gradient-to-br from-[var(--brand-primary)] to-[var(--brand-secondary)] rounded-2xl flex items-center justify-center text-white mx-auto mb-4">
                        <Sparkles className="w-12 h-12" />
                      </div>
                      <h3 className="heading-4 mb-2">Ready to Create Amazing Content?</h3>
                      <p className="text-[var(--text-secondary)]">
                        Fill in your requirements and let AI generate viral content for you.
                      </p>
                    </div>
                  )}

                  {isLoading && (
                    <div className="text-center py-16">
                      <div className="w-16 h-16 border-4 border-[var(--brand-primary)] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                      <h3 className="heading-4 mb-2">Creating Your Content...</h3>
                      <p className="text-[var(--text-secondary)]">
                        Our AI is crafting the perfect content for your audience.
                      </p>
                    </div>
                  )}

                  {generatedOutput && (
                    <Card>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="heading-4">Generated Content</h3>
                          <div className="flex space-x-2">
                            <Button variant="ghost" size="sm" onClick={() => navigator.clipboard.writeText(generatedOutput)}>
                              <Copy className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => onSaveToHistory(generatedOutput)}>
                              <Save className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Share2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        
                        <div className="bg-[var(--surface-tertiary)] rounded-xl p-4">
                          <div className="whitespace-pre-wrap text-[var(--text-primary)]">
                            {generatedOutput}
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between pt-4 border-t border-[var(--border-primary)]">
                          <div className="flex items-center space-x-4 text-sm text-[var(--text-secondary)]">
                            <span>Words: {generatedOutput.split(' ').length}</span>
                            <span>Characters: {generatedOutput.length}</span>
                            <Badge variant="success">Quality: A+</Badge>
                          </div>
                          
                          <div className="flex space-x-2">
                            <Button variant="secondary" size="sm">
                              <RefreshCw className="w-4 h-4 mr-1" />
                              Regenerate
                            </Button>
                            <Button variant="primary" size="sm">
                              <Wand2 className="w-4 h-4 mr-1" />
                              Refine
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  )}

                  {/* Recent Generations */}
                  {recentGenerations.length > 0 && (
                    <Card>
                      <div className="space-y-4">
                        <h3 className="heading-4">Recent Generations</h3>
                        <div className="space-y-3">
                          {recentGenerations.map((item, index) => (
                            <div key={index} className="p-3 bg-[var(--surface-tertiary)] rounded-lg">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium">{item.contentType}</span>
                                <span className="text-xs text-[var(--text-secondary)]">
                                  {new Date(item.timestamp).toLocaleDateString()}
                                </span>
                              </div>
                              <p className="text-sm text-[var(--text-secondary)] line-clamp-2">
                                {item.output}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </Card>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {activeView === 'templates' && (
            <motion.div
              key="templates"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="p-6 overflow-y-auto"
            >
              <div className="max-w-6xl mx-auto space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="heading-3">Content Templates</h2>
                    <p className="body-base">Professional templates to jumpstart your content creation</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm">
                      <Filter className="w-4 h-4" />
                      Filter
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Search className="w-4 h-4" />
                      Search
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {templates.map((template) => (
                    <Card
                      key={template.id}
                      className="cursor-pointer hover:shadow-lg transition-shadow"
                      onClick={() => handleTemplateSelect(template)}
                    >
                      <div className="space-y-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-[var(--brand-primary)]20 rounded-lg flex items-center justify-center text-[var(--brand-primary)]">
                              {template.icon}
                            </div>
                            <div>
                              <h3 className="font-semibold text-[var(--text-primary)]">{template.name}</h3>
                              <p className="text-sm text-[var(--text-secondary)]">{template.platform}</p>
                            </div>
                          </div>
                          <div className="flex flex-col items-end space-y-1">
                            {template.popular && <Badge variant="success">Popular</Badge>}
                            {template.premium && <Badge variant="warning">Pro</Badge>}
                          </div>
                        </div>
                        
                        <p className="text-sm text-[var(--text-secondary)]">{template.description}</p>
                        
                        <div className="flex flex-wrap gap-1">
                          {template.tags.map((tag) => (
                            <Badge key={tag} variant="neutral" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default GeneratorWorldClass;
