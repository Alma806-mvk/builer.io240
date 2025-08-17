import React, { useState, useEffect, useRef, useMemo } from "react";
import { Platform, ContentType } from "../../types";

interface SuggestionItem {
  id: string;
  text: string;
  type: "trending" | "template" | "completion" | "related";
  platform?: Platform;
  contentType?: ContentType;
  score: number;
  icon: string;
  reason: string;
}

interface SmartSuggestionsProps {
  input: string;
  platform: Platform;
  contentType: ContentType;
  onSuggestionSelect: (suggestion: string) => void;
  onClose: () => void;
  isVisible: boolean;
  targetAudience?: string;
}

// Comprehensive suggestion database
const SUGGESTION_DATABASE = {
  trending: {
    [Platform.YouTube]: [
      "How to start a YouTube channel in 2025",
      "AI tools that changed my life",
      "Day in my life as a content creator",
      "Things I wish I knew before starting YouTube",
      "Passive income streams for beginners",
      "Morning routine for productivity",
      "Tech that actually improved my workflow",
      "Minimalist lifestyle changes that work",
      "Side hustles you can start today",
      "Books that changed my perspective",
      "Building a personal brand from scratch",
      "Productivity hacks that actually work",
      "The future of remote work",
      "Crypto and Web3 explained simply",
      "Mental health tips for entrepreneurs",
      "Zero waste lifestyle challenges",
      "Learning new skills after 30",
      "Travel on a budget guide",
      "Home workout routines that work",
      "Meal prep for busy professionals",
      "Digital detox experiments",
      "Investment strategies for beginners",
      "Photography tips using just your phone",
      "Language learning shortcuts",
      "Time management secrets",
      "Building healthy relationships",
      "Creative problem solving techniques",
      "Sustainable fashion choices",
      "Home organization systems",
      "Mindfulness and meditation practices",
      "Career pivot strategies",
      "Freelancing from zero to six figures",
      "Building multiple income streams",
      "Public speaking confidence tips",
      "Content creation behind the scenes",
      "Work-life balance myths debunked",
      "Digital nomad lifestyle reality",
      "Overcoming impostor syndrome",
      "Building online communities",
      "Mastering video editing basics",
      "The psychology of success",
      "Habits of highly creative people",
      "Money mindset transformation",
      "Building confidence from zero",
      "Productivity vs procrastination",
      "The art of saying no",
      "Creating viral content strategies",
      "Networking for introverts",
      "Personal finance for creatives",
      "Building resilience and grit",
      "The power of compound habits",
      "Transforming failure into success",
      "Building a growth mindset",
      "Communication skills that matter",
      "Leadership lessons from failure",
      "The future of artificial intelligence",
      "Building authentic relationships",
      "Overcoming creative blocks",
      "The science of motivation",
      "Building emotional intelligence",
      "Sustainable living on a budget",
      "Digital marketing for beginners",
      "Building a profitable blog",
      "The art of storytelling",
      "Creating engaging presentations",
      "Building a strong online presence",
      "The future of work and automation",
      "Personal development reading list",
      "Building multiple revenue streams",
      "The psychology of productivity",
      "Creating effective morning routines",
      "Building lasting professional relationships",
      "The art of decision making",
      "Creating content that converts",
      "Building a loyal audience",
      "The science of goal achievement",
      "Creating passive income streams",
      "Building expertise in any field",
      "The power of consistent action",
      "Creating memorable brand experiences",
      "Building mental toughness",
      "The future of entrepreneurship",
      "Creating systems for success",
      "Building a learning mindset",
      "The art of self-promotion",
      "Creating impactful content",
      "Building long-term wealth",
      "The psychology of persuasion",
      "Creating authentic content",
      "Building a sustainable business",
      "The power of intentional living",
      "Creating breakthrough moments",
      "Building unshakeable confidence",
      "The art of continuous improvement",
      "Creating content that matters",
      "Building a legacy that lasts",
      "The science of peak performance",
    ],
    [Platform.TikTok]: [
      "POV: You just discovered this life hack",
      "Things nobody tells you about adulting",
      "Red flags in friends/relationships",
      "Underrated apps you need to try",
      "Plot twist: this actually works",
      "That girl who always has her life together",
      "Things that make me feel old",
      "Unpopular opinions that are actually true",
      "Signs you're becoming successful",
      "Daily habits that changed everything",
      "Get ready with me for productivity",
      "Aesthetic morning routine that works",
      "Room makeover on a budget",
      "Outfit formulas for every occasion",
      "Study tips that actually help",
      "Glow up tips that cost nothing",
      "Money saving hacks for students",
      "Self-care Sunday routine",
      "Manifestation techniques that work",
      "Productive night routine",
      "Confidence building exercises",
      "Healthy recipes under 5 minutes",
      "Phone organization and cleanup",
      "Workout routine for busy people",
      "Journaling prompts for growth",
      "Social anxiety coping strategies",
      "Goal setting methods that stick",
      "Creative date ideas on a budget",
      "Toxic traits to unlearn",
      "Green flags in healthy relationships",
      "Academic comeback strategies",
      "Side hustle ideas for students",
      "Mental health check-in routine",
      "Minimalist wardrobe essentials",
      "Digital wellness habits",
      "Friendship red flags to avoid",
      "Career advice for Gen Z",
      "Budgeting tips for beginners",
      "Self-improvement challenge ideas",
      "Mindset shifts that changed everything",
      "POV: You just found your dream job",
      "Things successful people do quietly",
      "That one friend who's always motivated",
      "Plot twist: it's actually good for you",
      "Aesthetic study session with me",
      "Glow up transformation timeline",
      "Level up your life in 30 days",
      "Romanticize your life challenge",
      "Main character energy activation",
      "Soft life era has begun",
      "The art of not caring",
      "Becoming THAT person checklist",
      "Energy management over time management",
      "Digital minimalism experiment",
      "Authenticity over perfection",
      "Slow living lifestyle changes",
      "Mindful consumption habits",
      "Intentional relationship building",
      "Creative problem solving hacks",
      "Sustainable self-care routine",
      "Productivity without burnout",
      "Financial literacy basics",
      "Emotional regulation techniques",
      "Communication boundary setting",
      "Personal brand development",
      "Confidence building exercises",
      "Stress management strategies",
      "Career development planning",
      "Investment mindset building",
      "Leadership skills development",
      "Creative expression exploration",
      "Health optimization tips",
      "Relationship quality improvement",
      "Life design principles",
      "Success habit formation",
      "Personal growth acceleration",
      "Mindfulness practice integration",
      "Goal achievement systems",
      "Life balance optimization",
    ],
    [Platform.Instagram]: [
      "Behind the scenes of my creative process",
      "What I eat in a day for energy",
      "Outfit inspiration for every occasion",
      "Self-care Sunday essentials",
      "Travel destinations on my bucket list",
      "Small business tips that actually work",
      "Photo editing techniques for beginners",
      "Sustainable living made simple",
      "Confidence tips that changed my life",
      "Weekend reset routine for productivity",
      "Content creation setup and tools",
      "Aesthetic flat lay photography tips",
      "Color palette inspiration for brands",
      "Minimalist home decor ideas",
      "Healthy meal prep inspiration",
      "Fashion trends worth trying",
      "Skincare routine for glowing skin",
      "Workspace organization ideas",
      "Budget-friendly room makeover",
      "Plant care tips for beginners",
      "Photography lighting techniques",
      "Instagram story template ideas",
      "Brand aesthetic consistency tips",
      "Seasonal outfit inspiration",
      "Wellness routine essentials",
      "Creative photography challenges",
      "Home cafe setup inspiration",
      "Jewelry and accessories styling",
      "Natural makeup looks tutorial",
      "Goal planning and tracking methods",
      "Digital planning and organization",
      "Fitness motivation and progress",
      "Book recommendations and reviews",
      "Art and craft project ideas",
      "Cozy evening routine inspiration",
      "Productive morning rituals",
      "Self-love and body positivity",
      "Travel packing tips and tricks",
      "Home cooking recipe experiments",
      "Creative writing and journaling",
      "Personal branding photography tips",
      "Sustainable lifestyle inspiration",
      "Entrepreneurship journey highlights",
      "Creative workspace organization",
      "Fashion styling fundamentals",
      "Wellness routine documentation",
      "Professional development insights",
      "Creative process documentation",
      "Lifestyle design inspiration",
      "Personal growth milestones",
      "Career transition stories",
      "Investment learning journey",
      "Skill development progress",
      "Health transformation timeline",
      "Creative project showcases",
      "Professional networking events",
      "Industry conference highlights",
      "Mentorship experience sharing",
      "Leadership development journey",
      "Innovation project documentation",
      "Community building efforts",
      "Social impact initiatives",
      "Personal finance education",
      "Creative collaboration projects",
      "Thought leadership content",
      "Industry insights and trends",
      "Professional achievement celebrations",
    ],
    [Platform.LinkedIn]: [
      "Career lessons I learned the hard way",
      "Remote work productivity strategies",
      "Networking tips for introverts",
      "Skills that future-proof your career",
      "Leadership mistakes I made early on",
      "Work-life balance myths debunked",
      "How I landed my dream job",
      "Salary negotiation strategies that work",
      "Building personal brand on LinkedIn",
      "Industry trends to watch in 2025",
      "AI and automation impact on jobs",
      "Upskilling strategies for professionals",
      "Mentorship lessons from successful leaders",
      "Entrepreneurship vs corporate career",
      "Building resilience in tough times",
      "Communication skills that matter most",
      "Project management best practices",
      "Team building in hybrid environments",
      "Innovation strategies for businesses",
      "Customer success stories and insights",
      "Data-driven decision making",
      "Diversity and inclusion in the workplace",
      "Startup funding and investment tips",
      "Professional development planning",
      "Crisis management lessons learned",
      "Digital transformation strategies",
      "Emotional intelligence in leadership",
      "Performance management techniques",
      "Building high-performing teams",
      "Career transition success stories",
      "Marketing automation trends",
      "Sales techniques that actually work",
      "Product development methodologies",
      "Sustainable business practices",
      "Company culture transformation",
      "Professional networking strategies",
      "Industry disruption predictions",
      "Freelancing vs full-time employment",
      "Executive coaching insights",
      "Business strategy development",
    ],
    [Platform.Twitter]: [
      "Unpopular opinion: most productivity advice is useless",
      "Thread: Things I wish I knew at 25",
      "Hot take on the future of remote work",
      "Startup lessons from my biggest failures",
      "Tech predictions that aged like milk",
      "Books that completely changed my mindset",
      "Simple habits with compound effects",
      "Why most content marketing fails",
      "Underrated skills for career growth",
      "Controversial takes on work culture",
      "AI tools everyone should be using",
      "Investment mistakes I made early on",
      "Thread: Building in public lessons",
      "Unpopular opinion about social media",
      "Indie hacker mindset shifts",
      "No-code tools that replace developers",
      "Creator economy predictions for 2025",
      "Why most side hustles fail",
      "Thread: Mental health for entrepreneurs",
      "Hot take on the education system",
      "Crypto lessons from the trenches",
      "SaaS metrics that actually matter",
      "Growth hacking tactics that work",
      "Personal finance myths debunked",
      "Thread: Remote work productivity hacks",
      "Why hustle culture is toxic",
      "Minimalism vs maximalism debate",
      "Thread: Building passive income streams",
      "Hot take on venture capital",
      "Design principles everyone ignores",
      "Marketing psychology tricks exposed",
      "Thread: Burnout recovery strategies",
      "Why most courses are scams",
      "Developer tools worth paying for",
      "Thread: Building audience from zero",
      "Unpopular opinion about networking",
      "Startup metrics that don't matter",
      "Thread: Time management reality check",
      "Why perfectionism kills progress",
      "Content creation harsh truths",
    ],
    [Platform.Facebook]: [
      "Local business spotlight and review",
      "Community event planning tips",
      "Family-friendly activities this weekend",
      "Home improvement projects on a budget",
      "Neighborhood recommendations and hidden gems",
      "Parenting tips from experienced parents",
      "Local food scene and restaurant reviews",
      "DIY projects for the home",
      "Community volunteer opportunities",
      "Seasonal activities for families",
    ],
  },

  templates: {
    [ContentType.Script]: [
      "Step-by-step tutorial on [topic]",
      "Behind the scenes of [process]",
      "Day in the life of [profession/lifestyle]",
      "Before and after transformation",
      "Common mistakes people make with [topic]",
      "Ultimate guide to [skill/topic]",
      "Beginner's introduction to [complex topic]",
      "Advanced techniques for [topic]",
      "My honest review of [product/service]",
      "Comparing different approaches to [problem]",
    ],
    [ContentType.Idea]: [
      "Creative ways to [solve common problem]",
      "Unexpected benefits of [activity/habit]",
      "Why [popular belief] might be wrong",
      "Hidden secrets of [industry/field]",
      "Simple hacks for [daily task]",
      "Trends that will shape [industry] in 2025",
      "Underrated [tools/strategies] for [goal]",
      "What [successful people] do differently",
      "Myths about [topic] finally debunked",
      "Future of [industry/technology]",
    ],
    [ContentType.Title]: [
      "How to [achieve goal] in [timeframe]",
      "[Number] Ways to [improve something]",
      "The Ultimate Guide to [topic]",
      "Why [surprising fact] Will Change Everything",
      "Secret [strategies/tips] That [outcome]",
      "From [starting point] to [end goal]",
      "What [experts] Don't Tell You About [topic]",
      "The [superlative] Way to [achieve something]",
      "[Unexpected thing] That [positive outcome]",
      "Stop [common mistake] and Start [better approach]",
    ],
  },

  completions: {
    "how to": [
      "start a successful business",
      "build confidence naturally",
      "improve productivity daily",
      "create passive income",
      "master time management",
      "develop better habits",
      "grow your social media",
      "learn new skills faster",
      "build meaningful relationships",
      "achieve work-life balance",
      "overcome impostor syndrome",
      "negotiate salary effectively",
      "build a personal brand",
      "create viral content",
      "network authentically",
      "manage stress and anxiety",
      "increase creativity",
      "build financial freedom",
      "develop leadership skills",
      "create multiple income streams",
      "build lasting habits",
      "overcome perfectionism",
      "develop emotional intelligence",
      "create engaging content",
      "build a profitable side hustle",
      "master public speaking",
      "develop critical thinking",
      "build resilience and grit",
      "create systems for success",
      "build authentic connections",
      "overcome fear of failure",
      "develop better communication",
      "create sustainable growth",
      "build mental toughness",
      "master the art of focus",
      "develop strategic thinking",
      "create compelling stories",
      "build unshakeable confidence",
      "overcome analysis paralysis",
      "develop innovative solutions",
    ],
    best: [
      "productivity apps for entrepreneurs",
      "books for personal development",
      "morning routines for success",
      "strategies for content creation",
      "tools for remote work",
      "habits for mental health",
      "investments for beginners",
      "exercises for busy people",
      "meal prep ideas for health",
      "ways to learn new skills",
      "AI tools for creators",
      "meditation apps for focus",
      "time tracking methods",
      "note-taking systems",
      "project management tools",
      "design resources for non-designers",
      "email marketing platforms",
      "social media schedulers",
      "video editing software",
      "accounting tools for freelancers",
      "networking strategies for introverts",
      "sleep optimization techniques",
      "stress management methods",
      "goal setting frameworks",
      "learning acceleration techniques",
      "creativity boosting methods",
      "decision making frameworks",
      "problem solving approaches",
      "leadership development strategies",
      "communication improvement tips",
      "financial planning tools",
      "workflow optimization systems",
      "team collaboration platforms",
      "personal branding strategies",
      "content marketing tools",
      "automation software for business",
      "mindfulness practices for focus",
      "habit tracking applications",
      "skill development platforms",
      "performance monitoring tools",
    ],
    why: [
      "most people fail at their goals",
      "consistency beats perfection",
      "mindset is everything in business",
      "authenticity wins on social media",
      "less is more in productivity",
      "habits matter more than motivation",
      "networking is overrated",
      "quality trumps quantity",
      "storytelling sells better than features",
      "emotional intelligence is crucial",
      "most startups fail within 5 years",
      "personal branding matters more than ever",
      "remote work is here to stay",
      "AI will transform every industry",
      "mental health should be a priority",
      "diversification reduces financial risk",
      "continuous learning is essential",
      "authentic content performs better",
      "community building beats selling",
      "sustainable practices are profitable",
    ],
    what: [
      "successful people do differently",
      "nobody tells you about entrepreneurship",
      "I wish I knew before starting",
      "the future holds for creators",
      "makes content go viral",
      "investors look for in startups",
      "productivity really means",
      "authentic leadership looks like",
      "sustainable growth requires",
      "customers actually want",
    ],
    top: [
      "mistakes new entrepreneurs make",
      "habits of successful people",
      "skills for the future workforce",
      "trends shaping digital marketing",
      "tools for content creators",
      "books every leader should read",
      "AI applications for business",
      "productivity techniques that work",
      "investment strategies for beginners",
      "social media platforms for growth",
    ],
    secrets: [
      "to building a loyal audience",
      "successful people won't tell you",
      "to mastering time management",
      "to creating viral content",
      "to effective networking",
      "to financial independence",
      "to building confidence",
      "to productive mornings",
      "to stress management",
      "to creative breakthroughs",
    ],
    "5 ways": [
      "to boost productivity instantly",
      "to build confidence today",
      "to improve your mindset",
      "to create better content",
      "to network more effectively",
      "to manage stress naturally",
      "to increase creativity",
      "to build better habits",
      "to improve communication",
      "to grow your business",
    ],
    "things that": [
      "successful people do differently",
      "changed my perspective on life",
      "every entrepreneur should know",
      "will make you more productive",
      "highly creative people do",
      "confident people never do",
      "will transform your mindset",
      "wealthy people understand",
      "leaders do when no one's watching",
      "will improve your relationships",
    ],
    "ultimate guide": [
      "to building passive income",
      "to personal branding",
      "to content creation",
      "to productivity mastery",
      "to networking success",
      "to financial freedom",
      "to skill development",
      "to goal achievement",
      "to leadership excellence",
      "to creative breakthrough",
    ],
    "common mistakes": [
      "new entrepreneurs make",
      "content creators avoid",
      "productivity enthusiasts make",
      "people make with money",
      "that kill creativity",
      "in personal branding",
      "when building habits",
      "in goal setting",
      "when networking",
      "that prevent success",
    ],
    "simple strategies": [
      "to boost creativity",
      "for better productivity",
      "to build confidence",
      "for effective communication",
      "to manage time better",
      "for building wealth",
      "to improve relationships",
      "for stress management",
      "to achieve goals faster",
      "for personal growth",
    ],
    "proven methods": [
      "to increase productivity",
      "for building habits",
      "to overcome procrastination",
      "for creative breakthrough",
      "to build confidence",
      "for effective learning",
      "to manage stress",
      "for goal achievement",
      "to improve focus",
      "for personal development",
    ],
    "habits of": [
      "highly successful people",
      "productive entrepreneurs",
      "creative professionals",
      "effective leaders",
      "confident individuals",
      "wealthy people",
      "happy people",
      "influential people",
      "innovative thinkers",
      "resilient people",
    ],
    "psychology of": [
      "success and achievement",
      "productivity and focus",
      "creativity and innovation",
      "confidence and self-esteem",
      "leadership and influence",
      "habit formation",
      "goal achievement",
      "decision making",
      "motivation and drive",
      "peak performance",
    ],
    "science behind": [
      "habit formation",
      "productivity and focus",
      "creativity and innovation",
      "goal achievement",
      "success and failure",
      "motivation and drive",
      "confidence building",
      "stress management",
      "peak performance",
      "decision making",
    ],
  },
};

const SmartSuggestions: React.FC<SmartSuggestionsProps> = ({
  input,
  platform,
  contentType,
  onSuggestionSelect,
  onClose,
  isVisible,
  targetAudience,
}) => {
  const [suggestions, setSuggestions] = useState<SuggestionItem[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const suggestionRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Generate intelligent suggestions based on input
  const generateSuggestions = useMemo(() => {
    if (!input.trim() || input.length < 2) return [];

    const inputLower = input.toLowerCase();
    const suggestions: SuggestionItem[] = [];
    let idCounter = 0;

    // 1. Trending suggestions for platform
    const trendingForPlatform = SUGGESTION_DATABASE.trending[platform] || [];
    trendingForPlatform.forEach((trend) => {
      if (
        trend.toLowerCase().includes(inputLower) ||
        inputLower.split(" ").some((word) => trend.toLowerCase().includes(word))
      ) {
        suggestions.push({
          id: `trending-${idCounter++}`,
          text: trend,
          type: "trending",
          platform,
          contentType,
          score: 0.9,
          icon: "🔥",
          reason: "Trending on " + platform,
        });
      }
    });

    // 2. Template suggestions for content type
    const templatesForType = SUGGESTION_DATABASE.templates[contentType] || [];
    templatesForType.forEach((template) => {
      if (template.toLowerCase().includes(inputLower)) {
        suggestions.push({
          id: `template-${idCounter++}`,
          text: template,
          type: "template",
          platform,
          contentType,
          score: 0.8,
          icon: "📝",
          reason: "Proven template",
        });
      }
    });

    // 3. Smart completions
    Object.entries(SUGGESTION_DATABASE.completions).forEach(
      ([prefix, completions]) => {
        if (inputLower.includes(prefix)) {
          completions.forEach((completion) => {
            if (
              completion
                .toLowerCase()
                .includes(inputLower.replace(prefix, "").trim())
            ) {
              suggestions.push({
                id: `completion-${idCounter++}`,
                text: `${prefix} ${completion}`,
                type: "completion",
                platform,
                contentType,
                score: 0.7,
                icon: "💡",
                reason: "Smart completion",
              });
            }
          });
        }
      },
    );

    // 4. Related topic suggestions
    const relatedKeywords = [
      "tips",
      "guide",
      "tutorial",
      "review",
      "comparison",
      "beginner",
      "advanced",
      "secret",
      "hack",
      "strategy",
      "method",
      "technique",
    ];

    relatedKeywords.forEach((keyword) => {
      if (!inputLower.includes(keyword)) {
        suggestions.push({
          id: `related-${idCounter++}`,
          text: `${input.trim()} ${keyword}`,
          type: "related",
          platform,
          contentType,
          score: 0.6,
          icon: "🎯",
          reason: "Related topic",
        });
      }
    });

    // Sort by score and relevance
    return suggestions.sort((a, b) => b.score - a.score).slice(0, 8); // Limit to top 8 suggestions
  }, [input, platform, contentType]);

  useEffect(() => {
    if (!isVisible) return;

    setIsLoading(true);
    const timer = setTimeout(() => {
      setSuggestions(generateSuggestions);
      setSelectedIndex(0);
      setIsLoading(false);
    }, 150); // Small delay for better UX

    return () => clearTimeout(timer);
  }, [generateSuggestions, isVisible]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isVisible || suggestions.length === 0) return;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setSelectedIndex((prev) =>
            Math.min(prev + 1, suggestions.length - 1),
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          setSelectedIndex((prev) => Math.max(prev - 1, 0));
          break;
        case "Enter":
          e.preventDefault();
          if (suggestions[selectedIndex]) {
            onSuggestionSelect(suggestions[selectedIndex].text);
          }
          break;
        case "Escape":
          e.preventDefault();
          onClose();
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isVisible, suggestions, selectedIndex, onSuggestionSelect, onClose]);

  // Scroll selected item into view
  useEffect(() => {
    if (suggestionRefs.current[selectedIndex]) {
      suggestionRefs.current[selectedIndex]?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [selectedIndex]);

  if (!isVisible || suggestions.length === 0) return null;

  return (
    <div
      className="absolute top-full left-0 right-0 z-50 mt-1 bg-slate-800/95 backdrop-blur-xl border border-slate-700/50 rounded-xl shadow-2xl overflow-hidden"
      style={{
        animation: "slideDown 0.2s ease-out",
        maxHeight: "320px",
        overflowY: "auto",
      }}
    >
      {isLoading ? (
        <div className="p-4 text-center">
          <div className="inline-flex items-center gap-2 text-slate-400">
            <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm">Finding suggestions...</span>
          </div>
        </div>
      ) : (
        <>
          {/* Header */}
          <div className="px-4 py-2 bg-slate-700/30 border-b border-slate-600/30 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-slate-300">
                Smart Suggestions
              </span>
              <span className="px-2 py-0.5 bg-indigo-500/20 text-indigo-300 text-xs rounded-full">
                {suggestions.length}
              </span>
            </div>
            <div className="text-xs text-slate-500">
              ↑↓ navigate • ↵ select • esc close
            </div>
          </div>

          {/* Suggestions */}
          <div className="py-2">
            {suggestions.map((suggestion, index) => (
              <div
                key={suggestion.id}
                ref={(el) => (suggestionRefs.current[index] = el)}
                className={`px-4 py-3 cursor-pointer transition-all duration-150 ${
                  index === selectedIndex
                    ? "bg-indigo-500/20 border-l-2 border-indigo-400"
                    : "hover:bg-slate-700/30"
                }`}
                onClick={() => onSuggestionSelect(suggestion.text)}
              >
                <div className="flex items-start gap-3">
                  <span className="text-lg flex-shrink-0 mt-0.5">
                    {suggestion.icon}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-white font-medium truncate">
                      {suggestion.text}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-slate-400">
                        {suggestion.reason}
                      </span>
                      {suggestion.type === "trending" && (
                        <span className="px-1.5 py-0.5 bg-orange-500/20 text-orange-300 text-xs rounded">
                          Hot
                        </span>
                      )}
                      {suggestion.type === "template" && (
                        <span className="px-1.5 py-0.5 bg-green-500/20 text-green-300 text-xs rounded">
                          Template
                        </span>
                      )}
                    </div>
                  </div>
                  {index === selectedIndex && (
                    <div className="flex-shrink-0 text-indigo-400">↵</div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Footer tip */}
          <div className="px-4 py-2 bg-slate-700/20 border-t border-slate-600/30">
            <div className="text-xs text-slate-500">
              💡 Tip: Keep typing to see more specific suggestions
            </div>
          </div>
        </>
      )}

      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default SmartSuggestions;
