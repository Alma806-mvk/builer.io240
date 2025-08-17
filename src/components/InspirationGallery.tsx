import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LightBulbIcon,
  SparklesIcon,
  FireIcon,
  ArrowTrendingUpIcon,
  EyeIcon,
  HeartIcon,
  ShareIcon,
  ClockIcon,
  TagIcon,
  ArrowTopRightOnSquareIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";

interface TrendingContent {
  id: string;
  title: string;
  platform: "YouTube" | "TikTok" | "Instagram" | "Twitter" | "LinkedIn";
  category: "Tech" | "Lifestyle" | "Business" | "Entertainment" | "Education" | "Gaming" | "Fitness" | "Food" | "Travel" | "Finance" | "Health" | "Fashion" | "Beauty" | "Parenting" | "DIY" | "Music" | "Art" | "Photography" | "Science" | "History" | "Politics" | "Sports" | "Anime" | "Books" | "Movies" | "Comedy" | "Motivation" | "Productivity" | "Mental Health" | "Relationships" | "Career" | "Real Estate" | "Investing" | "Cryptocurrency" | "Sustainability" | "Pets" | "Gardening" | "Cooking" | "Baking" | "Home Decor" | "Minimalism" | "Self Improvement" | "Spirituality" | "Philosophy";
  views: string;
  engagement: string;
  timeAgo: string;
  thumbnail?: string;
  description: string;
  tags: string[];
  performance: "viral" | "trending" | "rising";
  type: "video" | "post" | "story" | "reel";
}

const PLATFORM_COLORS = {
  YouTube: "text-red-400 bg-red-500/10 border-red-500/30",
  TikTok: "text-pink-400 bg-pink-500/10 border-pink-500/30",
  Instagram: "text-purple-400 bg-purple-500/10 border-purple-500/30",
  Twitter: "text-blue-400 bg-blue-500/10 border-blue-500/30",
  LinkedIn: "text-blue-300 bg-blue-600/10 border-blue-600/30",
};

const PERFORMANCE_BADGES = {
  viral: { icon: FireIcon, color: "text-red-400", label: "🔥 Viral" },
  trending: { icon: ArrowTrendingUpIcon, color: "text-yellow-400", label: "📈 Trending" },
  rising: { icon: SparklesIcon, color: "text-green-400", label: "⭐ Rising" },
};

const MOCK_TRENDING_CONTENT: TrendingContent[] = [
  // TECH & PROGRAMMING
  {
    id: "1",
    title: "I Built an AI That Codes Better Than Me",
    platform: "YouTube",
    category: "Tech",
    views: "2.3M",
    engagement: "94%",
    timeAgo: "2h",
    description: "Exploring the latest AI coding assistants and how they're changing development",
    tags: ["AI", "Coding", "Tech", "Tutorial"],
    performance: "viral",
    type: "video",
    thumbnail: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=200&h=120&fit=crop",
  },
  {
    id: "2",
    title: "Building a Full-Stack App in 60 Seconds",
    platform: "TikTok",
    category: "Tech",
    views: "1.8M",
    engagement: "89%",
    timeAgo: "5h",
    description: "Speed-running modern web development with the latest tools",
    tags: ["FullStack", "WebDev", "Speed", "Tutorial"],
    performance: "viral",
    type: "video",
    thumbnail: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=200&h=120&fit=crop",
  },
  {
    id: "3",
    title: "Why Every Developer Needs to Learn Rust in 2024",
    platform: "LinkedIn",
    category: "Tech",
    views: "345K",
    engagement: "87%",
    timeAgo: "1d",
    description: "The programming language taking over systems programming",
    tags: ["Rust", "Programming", "Systems", "Career"],
    performance: "trending",
    type: "post",
  },
  {
    id: "4",
    title: "CSS Grid vs Flexbox: When to Use What",
    platform: "Instagram",
    category: "Tech",
    views: "567K",
    engagement: "92%",
    timeAgo: "3h",
    description: "Ultimate guide to CSS layout systems for modern web design",
    tags: ["CSS", "WebDesign", "Layout", "Tutorial"],
    performance: "rising",
    type: "reel",
    thumbnail: "https://images.unsplash.com/photo-1508317469940-e3de49ba902e?w=200&h=120&fit=crop",
  },
  {
    id: "5",
    title: "I Tried 20 AI Tools for Programming (Here's What Works)",
    platform: "YouTube",
    category: "Tech",
    views: "892K",
    engagement: "95%",
    timeAgo: "6h",
    description: "Testing every AI coding tool so you don't have to",
    tags: ["AI", "Tools", "Productivity", "Review"],
    performance: "viral",
    type: "video",
    thumbnail: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=200&h=120&fit=crop",
  },

  // LIFESTYLE & WELLNESS
  {
    id: "6",
    title: "Morning routine that changed my life ✨",
    platform: "TikTok",
    category: "Lifestyle",
    views: "847K",
    engagement: "87%",
    timeAgo: "4h",
    description: "5 simple habits that transformed my productivity and mindset",
    tags: ["Morning", "Routine", "Productivity", "SelfCare"],
    performance: "trending",
    type: "video",
    thumbnail: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&h=120&fit=crop",
  },
  {
    id: "7",
    title: "Digital Detox: 30 Days Without Social Media",
    platform: "Instagram",
    category: "Lifestyle",
    views: "456K",
    engagement: "91%",
    timeAgo: "8h",
    description: "What I learned from completely disconnecting",
    tags: ["DigitalDetox", "Mindfulness", "SelfCare", "Wellness"],
    performance: "rising",
    type: "reel",
    thumbnail: "https://images.unsplash.com/photo-1519452575417-564c1401ecc0?w=200&h=120&fit=crop",
  },
  {
    id: "8",
    title: "Minimalist Home Tour: Living with Less",
    platform: "YouTube",
    category: "Lifestyle",
    views: "1.2M",
    engagement: "93%",
    timeAgo: "2d",
    description: "How I simplified my space and found more happiness",
    tags: ["Minimalism", "Home", "Declutter", "Simple"],
    performance: "viral",
    type: "video",
    thumbnail: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=200&h=120&fit=crop",
  },

  // BUSINESS & ENTREPRENEURSHIP
  {
    id: "9",
    title: "The $100K mistake every startup makes",
    platform: "LinkedIn",
    category: "Business",
    views: "156K",
    engagement: "92%",
    timeAgo: "6h",
    description: "Critical insights from 50+ failed startups and how to avoid common pitfalls",
    tags: ["Startup", "Business", "Entrepreneurship", "Mistakes"],
    performance: "rising",
    type: "post",
  },
  {
    id: "10",
    title: "Building a $1M Business with No Funding",
    platform: "YouTube",
    category: "Business",
    views: "2.1M",
    engagement: "96%",
    timeAgo: "1d",
    description: "The bootstrap journey that changed everything",
    tags: ["Startup", "Bootstrap", "Entrepreneur", "Success"],
    performance: "viral",
    type: "video",
    thumbnail: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=200&h=120&fit=crop",
  },
  {
    id: "11",
    title: "Why 90% of Side Hustles Fail (And How to Be the 10%)",
    platform: "TikTok",
    category: "Business",
    views: "678K",
    engagement: "88%",
    timeAgo: "5h",
    description: "The hard truth about side business success",
    tags: ["SideHustle", "Business", "Success", "Failure"],
    performance: "trending",
    type: "video",
    thumbnail: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=200&h=120&fit=crop",
  },

  // FITNESS & HEALTH
  {
    id: "12",
    title: "30-Day Transformation: No Gym Required",
    platform: "Instagram",
    category: "Fitness",
    views: "1.5M",
    engagement: "94%",
    timeAgo: "3h",
    description: "Home workout routine that actually works",
    tags: ["Fitness", "HomeWorkout", "Transformation", "NoEquipment"],
    performance: "viral",
    type: "reel",
    thumbnail: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=120&fit=crop",
  },
  {
    id: "13",
    title: "The Science of Sleep: Why You're Always Tired",
    platform: "YouTube",
    category: "Health",
    views: "892K",
    engagement: "91%",
    timeAgo: "1d",
    description: "Understanding your circadian rhythm and sleep cycles",
    tags: ["Sleep", "Health", "Science", "Wellness"],
    performance: "trending",
    type: "video",
    thumbnail: "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=200&h=120&fit=crop",
  },
  {
    id: "14",
    title: "5-Minute Morning Yoga for Beginners",
    platform: "TikTok",
    category: "Fitness",
    views: "743K",
    engagement: "89%",
    timeAgo: "6h",
    description: "Start your day with gentle movement and mindfulness",
    tags: ["Yoga", "Morning", "Beginner", "Mindfulness"],
    performance: "rising",
    type: "video",
    thumbnail: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=200&h=120&fit=crop",
  },

  // FOOD & COOKING
  {
    id: "15",
    title: "15-Minute Gourmet Meals That Look Expensive",
    platform: "Instagram",
    category: "Food",
    views: "967K",
    engagement: "93%",
    timeAgo: "4h",
    description: "Quick recipes that impress without the stress",
    tags: ["Cooking", "QuickMeals", "Gourmet", "Budget"],
    performance: "viral",
    type: "reel",
    thumbnail: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=200&h=120&fit=crop",
  },
  {
    id: "16",
    title: "I Tried Every Viral Food Trend (So You Don't Have To)",
    platform: "YouTube",
    category: "Food",
    views: "1.8M",
    engagement: "88%",
    timeAgo: "2h",
    description: "Testing TikTok's most popular recipes and rating them",
    tags: ["FoodTrends", "Viral", "Review", "Testing"],
    performance: "viral",
    type: "video",
    thumbnail: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=200&h=120&fit=crop",
  },
  {
    id: "17",
    title: "Meal Prep Like a Pro: Week's Worth in 2 Hours",
    platform: "TikTok",
    category: "Food",
    views: "654K",
    engagement: "90%",
    timeAgo: "7h",
    description: "Efficient meal prep strategies for busy lifestyles",
    tags: ["MealPrep", "Efficiency", "HealthyEating", "TimeHacks"],
    performance: "trending",
    type: "video",
    thumbnail: "https://images.unsplash.com/photo-1547592180-85f173990554?w=200&h=120&fit=crop",
  },

  // TRAVEL & ADVENTURE
  {
    id: "18",
    title: "Solo Travel: 30 Days, 12 Countries, $2000",
    platform: "YouTube",
    category: "Travel",
    views: "1.3M",
    engagement: "95%",
    timeAgo: "1d",
    description: "How to travel Europe on an extreme budget",
    tags: ["Travel", "Budget", "Solo", "Europe"],
    performance: "viral",
    type: "video",
    thumbnail: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=200&h=120&fit=crop",
  },
  {
    id: "19",
    title: "Hidden Gems: Places Tourists Never Find",
    platform: "Instagram",
    category: "Travel",
    views: "789K",
    engagement: "92%",
    timeAgo: "5h",
    description: "Secret spots around the world worth visiting",
    tags: ["Travel", "HiddenGems", "Adventure", "Explore"],
    performance: "trending",
    type: "reel",
    thumbnail: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=200&h=120&fit=crop",
  },
  {
    id: "20",
    title: "Travel Hacks Flight Attendants Don't Want You to Know",
    platform: "TikTok",
    category: "Travel",
    views: "2.2M",
    engagement: "87%",
    timeAgo: "3h",
    description: "Insider tips for comfortable and cheap flights",
    tags: ["Travel", "Hacks", "Flight", "Tips"],
    performance: "viral",
    type: "video",
    thumbnail: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=200&h=120&fit=crop",
  },

  // FINANCE & INVESTING
  {
    id: "21",
    title: "I Turned $100 into $10,000 in 1 Year (Not Crypto)",
    platform: "YouTube",
    category: "Finance",
    views: "1.7M",
    engagement: "94%",
    timeAgo: "8h",
    description: "Real investing strategies that actually work",
    tags: ["Investing", "Finance", "Stocks", "Growth"],
    performance: "viral",
    type: "video",
    thumbnail: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=200&h=120&fit=crop",
  },
  {
    id: "22",
    title: "Why Your Budget Isn't Working (And What to Do Instead)",
    platform: "TikTok",
    category: "Finance",
    views: "856K",
    engagement: "89%",
    timeAgo: "6h",
    description: "Psychology-based approach to managing money",
    tags: ["Budget", "MoneyTips", "Finance", "Psychology"],
    performance: "trending",
    type: "video",
    thumbnail: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=200&h=120&fit=crop",
  },
  {
    id: "23",
    title: "Passive Income: 7 Streams That Actually Work",
    platform: "Instagram",
    category: "Finance",
    views: "923K",
    engagement: "91%",
    timeAgo: "12h",
    description: "Realistic ways to build income without active work",
    tags: ["PassiveIncome", "Finance", "Investing", "SideHustle"],
    performance: "rising",
    type: "reel",
    thumbnail: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=200&h=120&fit=crop",
  },

  // ENTERTAINMENT & COMEDY
  {
    id: "24",
    title: "When you realize your plant has been fake for 3 years",
    platform: "Twitter",
    category: "Entertainment",
    views: "1.2M",
    engagement: "78%",
    timeAgo: "1h",
    description: "That moment when you water your plant and realize it's plastic 😭",
    tags: ["Funny", "Plants", "Meme", "Relatable"],
    performance: "viral",
    type: "post",
  },
  {
    id: "25",
    title: "POV: You're a Parent Trying to Use Gen Z Slang",
    platform: "TikTok",
    category: "Comedy",
    views: "1.9M",
    engagement: "95%",
    timeAgo: "2h",
    description: "When millennials try to be cool and fail spectacularly",
    tags: ["Comedy", "Parenting", "GenZ", "Millennial"],
    performance: "viral",
    type: "video",
    thumbnail: "https://images.unsplash.com/photo-1566492031773-4f4e44671d66?w=200&h=120&fit=crop",
  },
  {
    id: "26",
    title: "Netflix Recommendations Based on Your Red Flags",
    platform: "Instagram",
    category: "Entertainment",
    views: "678K",
    engagement: "88%",
    timeAgo: "4h",
    description: "What your streaming choices say about your dating life",
    tags: ["Netflix", "Dating", "Funny", "RedFlags"],
    performance: "trending",
    type: "reel",
    thumbnail: "https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=200&h=120&fit=crop",
  },

  // EDUCATION & LEARNING
  {
    id: "27",
    title: "Learning Japanese in 30 Days: Day 1 vs Day 30",
    platform: "YouTube",
    category: "Education",
    views: "1.4M",
    engagement: "92%",
    timeAgo: "1d",
    description: "Documenting my language learning journey",
    tags: ["LanguageLearning", "Japanese", "Challenge", "Progress"],
    performance: "viral",
    type: "video",
    thumbnail: "https://images.unsplash.com/photo-1528164344705-47542687000d?w=200&h=120&fit=crop",
  },
  {
    id: "28",
    title: "Study Techniques That Actually Work (Science-Backed)",
    platform: "TikTok",
    category: "Education",
    views: "743K",
    engagement: "89%",
    timeAgo: "5h",
    description: "Evidence-based methods for better learning",
    tags: ["Study", "Learning", "Science", "Memory"],
    performance: "trending",
    type: "video",
    thumbnail: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=200&h=120&fit=crop",
  },
  {
    id: "29",
    title: "Free Online Courses Better Than College Classes",
    platform: "LinkedIn",
    category: "Education",
    views: "456K",
    engagement: "94%",
    timeAgo: "8h",
    description: "Quality education without the debt",
    tags: ["OnlineLearning", "Free", "Education", "Skills"],
    performance: "rising",
    type: "post",
  },

  // GAMING & ESPORTS
  {
    id: "30",
    title: "I Spent 1000 Hours Learning Every Fighting Game",
    platform: "YouTube",
    category: "Gaming",
    views: "892K",
    engagement: "91%",
    timeAgo: "6h",
    description: "From button masher to tournament player",
    tags: ["Gaming", "FightingGames", "Skill", "Tournament"],
    performance: "trending",
    type: "video",
    thumbnail: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=200&h=120&fit=crop",
  },
  {
    id: "31",
    title: "Gaming Setup Under $500 That Beats Most Streamers",
    platform: "TikTok",
    category: "Gaming",
    views: "1.1M",
    engagement: "88%",
    timeAgo: "3h",
    description: "Budget builds that don't compromise on performance",
    tags: ["Gaming", "Budget", "Setup", "PC"],
    performance: "viral",
    type: "video",
    thumbnail: "https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=200&h=120&fit=crop",
  },
  {
    id: "32",
    title: "The Psychology of Gaming Addiction (And How to Break It)",
    platform: "Instagram",
    category: "Gaming",
    views: "567K",
    engagement: "93%",
    timeAgo: "9h",
    description: "Understanding healthy gaming habits",
    tags: ["Gaming", "Psychology", "Addiction", "Health"],
    performance: "rising",
    type: "reel",
    thumbnail: "https://images.unsplash.com/photo-1556438064-2d7646166914?w=200&h=120&fit=crop",
  },

  // FASHION & BEAUTY
  {
    id: "33",
    title: "Thrift Flip: $5 Outfit to Designer Look",
    platform: "TikTok",
    category: "Fashion",
    views: "1.3M",
    engagement: "92%",
    timeAgo: "2h",
    description: "Transforming thrift store finds into high-fashion pieces",
    tags: ["ThriftFlip", "Fashion", "Sustainable", "DIY"],
    performance: "viral",
    type: "video",
    thumbnail: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=200&h=120&fit=crop",
  },
  {
    id: "34",
    title: "Skincare Routine That Costs Less Than Your Coffee",
    platform: "Instagram",
    category: "Beauty",
    views: "834K",
    engagement: "90%",
    timeAgo: "5h",
    description: "Affordable skincare that actually works",
    tags: ["Skincare", "Budget", "Beauty", "Routine"],
    performance: "trending",
    type: "reel",
    thumbnail: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=200&h=120&fit=crop",
  },
  {
    id: "35",
    title: "Fast Fashion vs Sustainable: The Real Cost",
    platform: "YouTube",
    category: "Fashion",
    views: "678K",
    engagement: "89%",
    timeAgo: "1d",
    description: "Environmental and social impact of clothing choices",
    tags: ["Fashion", "Sustainable", "Environment", "Ethics"],
    performance: "rising",
    type: "video",
    thumbnail: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=200&h=120&fit=crop",
  },

  // PARENTING & FAMILY
  {
    id: "36",
    title: "Gentle Parenting: What It Actually Looks Like",
    platform: "Instagram",
    category: "Parenting",
    views: "721K",
    engagement: "94%",
    timeAgo: "7h",
    description: "Real examples of gentle parenting in action",
    tags: ["Parenting", "GentleParenting", "Kids", "Family"],
    performance: "trending",
    type: "reel",
    thumbnail: "https://images.unsplash.com/photo-1476703993599-0035a21b17a9?w=200&h=120&fit=crop",
  },
  {
    id: "37",
    title: "Teaching Kids About Money: Age-by-Age Guide",
    platform: "YouTube",
    category: "Parenting",
    views: "543K",
    engagement: "91%",
    timeAgo: "12h",
    description: "Financial literacy starts early",
    tags: ["Parenting", "Money", "Kids", "Finance"],
    performance: "rising",
    type: "video",
    thumbnail: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200&h=120&fit=crop",
  },

  // DIY & CRAFTS
  {
    id: "38",
    title: "Home Renovation: DIY vs Hiring Pros",
    platform: "TikTok",
    category: "DIY",
    views: "987K",
    engagement: "87%",
    timeAgo: "4h",
    description: "When to save money and when to spend it",
    tags: ["DIY", "HomeReno", "Budget", "HomeImprovement"],
    performance: "trending",
    type: "video",
    thumbnail: "https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?w=200&h=120&fit=crop",
  },
  {
    id: "39",
    title: "Upcycling Furniture: Trash to Treasure",
    platform: "Instagram",
    category: "DIY",
    views: "456K",
    engagement: "88%",
    timeAgo: "8h",
    description: "Transforming old furniture into statement pieces",
    tags: ["Upcycling", "Furniture", "DIY", "Sustainable"],
    performance: "rising",
    type: "reel",
    thumbnail: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=200&h=120&fit=crop",
  },

  // MUSIC & ARTS
  {
    id: "40",
    title: "Learning Piano as an Adult: 6 Month Progress",
    platform: "YouTube",
    category: "Music",
    views: "634K",
    engagement: "92%",
    timeAgo: "1d",
    description: "It's never too late to start music",
    tags: ["Piano", "Music", "Learning", "Adult"],
    performance: "trending",
    type: "video",
    thumbnail: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=120&fit=crop",
  },
  {
    id: "41",
    title: "Digital Art in 60 Seconds: Speed Paint",
    platform: "TikTok",
    category: "Art",
    views: "1.2M",
    engagement: "89%",
    timeAgo: "3h",
    description: "Mesmerizing time-lapse digital painting",
    tags: ["DigitalArt", "SpeedPaint", "Art", "Creative"],
    performance: "viral",
    type: "video",
    thumbnail: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=200&h=120&fit=crop",
  },

  // PHOTOGRAPHY
  {
    id: "42",
    title: "Phone Photography: Pro Tips for Better Photos",
    platform: "Instagram",
    category: "Photography",
    views: "789K",
    engagement: "90%",
    timeAgo: "6h",
    description: "You don't need expensive gear for great photos",
    tags: ["Photography", "PhoneCamera", "Tips", "Mobile"],
    performance: "trending",
    type: "reel",
    thumbnail: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=200&h=120&fit=crop",
  },
  {
    id: "43",
    title: "Street Photography Ethics: Do's and Don'ts",
    platform: "YouTube",
    category: "Photography",
    views: "345K",
    engagement: "94%",
    timeAgo: "2d",
    description: "Capturing life while respecting people's privacy",
    tags: ["Photography", "Street", "Ethics", "Privacy"],
    performance: "rising",
    type: "video",
    thumbnail: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=200&h=120&fit=crop",
  },

  // SCIENCE & TECHNOLOGY
  {
    id: "44",
    title: "Quantum Computing Explained in 5 Minutes",
    platform: "TikTok",
    category: "Science",
    views: "1.1M",
    engagement: "85%",
    timeAgo: "5h",
    description: "Complex science made simple and accessible",
    tags: ["Science", "QuantumComputing", "Physics", "Technology"],
    performance: "viral",
    type: "video",
    thumbnail: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=200&h=120&fit=crop",
  },
  {
    id: "45",
    title: "Climate Change: What's Actually Happening",
    platform: "YouTube",
    category: "Science",
    views: "876K",
    engagement: "91%",
    timeAgo: "1d",
    description: "Data-driven look at our changing planet",
    tags: ["Climate", "Science", "Environment", "Data"],
    performance: "trending",
    type: "video",
    thumbnail: "https://images.unsplash.com/photo-1569163139394-de4e4f43e4e5?w=200&h=120&fit=crop",
  },

  // HISTORY & CULTURE
  {
    id: "46",
    title: "Lost Civilizations: What Really Happened",
    platform: "Instagram",
    category: "History",
    views: "567K",
    engagement: "88%",
    timeAgo: "9h",
    description: "Mysteries of ancient cultures finally explained",
    tags: ["History", "Ancient", "Civilization", "Mystery"],
    performance: "rising",
    type: "reel",
    thumbnail: "https://images.unsplash.com/photo-1539650116574-75c0c6d73c3e?w=200&h=120&fit=crop",
  },
  {
    id: "47",
    title: "Why Medieval People Weren't Actually Dirty",
    platform: "TikTok",
    category: "History",
    views: "943K",
    engagement: "87%",
    timeAgo: "7h",
    description: "Debunking common historical myths",
    tags: ["History", "Medieval", "Myths", "Facts"],
    performance: "trending",
    type: "video",
    thumbnail: "https://images.unsplash.com/photo-1594736797933-d0d8d7e67e88?w=200&h=120&fit=crop",
  },

  // SPORTS & FITNESS SPECIFIC
  {
    id: "48",
    title: "Soccer Skills That Look Impossible (But Aren't)",
    platform: "TikTok",
    category: "Sports",
    views: "1.5M",
    engagement: "92%",
    timeAgo: "2h",
    description: "Breaking down advanced football techniques",
    tags: ["Soccer", "Skills", "Tutorial", "Sports"],
    performance: "viral",
    type: "video",
    thumbnail: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=200&h=120&fit=crop",
  },
  {
    id: "49",
    title: "Why Athletes Are Getting Faster (Science Breakdown)",
    platform: "YouTube",
    category: "Sports",
    views: "678K",
    engagement: "89%",
    timeAgo: "1d",
    description: "The evolution of human athletic performance",
    tags: ["Sports", "Science", "Athletes", "Performance"],
    performance: "trending",
    type: "video",
    thumbnail: "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=200&h=120&fit=crop",
  },

  // ANIME & MANGA
  {
    id: "50",
    title: "Anime That Changed Everything (Deep Dive)",
    platform: "YouTube",
    category: "Anime",
    views: "1.2M",
    engagement: "95%",
    timeAgo: "8h",
    description: "How certain anime revolutionized the industry",
    tags: ["Anime", "Analysis", "Culture", "Impact"],
    performance: "viral",
    type: "video",
    thumbnail: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=200&h=120&fit=crop",
  },
  {
    id: "51",
    title: "Reading Manga vs Watching Anime: The Eternal Debate",
    platform: "TikTok",
    category: "Anime",
    views: "834K",
    engagement: "88%",
    timeAgo: "4h",
    description: "Exploring the differences between mediums",
    tags: ["Anime", "Manga", "Debate", "Media"],
    performance: "trending",
    type: "video",
    thumbnail: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=200&h=120&fit=crop",
  },

  // BOOKS & LITERATURE
  {
    id: "52",
    title: "BookTok Recommendations That Are Actually Good",
    platform: "TikTok",
    category: "Books",
    views: "723K",
    engagement: "91%",
    timeAgo: "6h",
    description: "Separating quality literature from hype",
    tags: ["Books", "BookTok", "Reading", "Literature"],
    performance: "trending",
    type: "video",
    thumbnail: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=200&h=120&fit=crop",
  },
  {
    id: "53",
    title: "Speed Reading: Myth or Superpower?",
    platform: "YouTube",
    category: "Books",
    views: "445K",
    engagement: "87%",
    timeAgo: "2d",
    description: "Testing speed reading techniques and their effectiveness",
    tags: ["Reading", "Speed", "Learning", "Productivity"],
    performance: "rising",
    type: "video",
    thumbnail: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=120&fit=crop",
  },

  // MOVIES & FILM
  {
    id: "54",
    title: "Why Movies Today Feel Different (Video Essay)",
    platform: "YouTube",
    category: "Movies",
    views: "1.1M",
    engagement: "93%",
    timeAgo: "1d",
    description: "Analyzing changes in modern filmmaking",
    tags: ["Movies", "Film", "Analysis", "Cinema"],
    performance: "viral",
    type: "video",
    thumbnail: "https://images.unsplash.com/photo-1489599988363-5d4c79cdaa65?w=200&h=120&fit=crop",
  },
  {
    id: "55",
    title: "Hidden Details in Popular Movies",
    platform: "Instagram",
    category: "Movies",
    views: "656K",
    engagement: "89%",
    timeAgo: "5h",
    description: "Easter eggs and details you probably missed",
    tags: ["Movies", "EasterEggs", "Details", "Film"],
    performance: "trending",
    type: "reel",
    thumbnail: "https://images.unsplash.com/photo-1489599988363-5d4c79cdaa65?w=200&h=120&fit=crop",
  },

  // MOTIVATION & SELF IMPROVEMENT
  {
    id: "56",
    title: "The Uncomfortable Truth About Success",
    platform: "LinkedIn",
    category: "Motivation",
    views: "789K",
    engagement: "94%",
    timeAgo: "8h",
    description: "Why motivation is overrated and discipline matters more",
    tags: ["Success", "Motivation", "Discipline", "Growth"],
    performance: "viral",
    type: "post",
  },
  {
    id: "57",
    title: "Building Confidence: What Nobody Tells You",
    platform: "TikTok",
    category: "Self Improvement",
    views: "1.3M",
    engagement: "91%",
    timeAgo: "3h",
    description: "Practical steps to genuine self-confidence",
    tags: ["Confidence", "SelfImprovement", "Growth", "Mindset"],
    performance: "viral",
    type: "video",
    thumbnail: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=120&fit=crop",
  },

  // PRODUCTIVITY & LIFE HACKS
  {
    id: "58",
    title: "Time Blocking: The System That Changed My Life",
    platform: "YouTube",
    category: "Productivity",
    views: "567K",
    engagement: "92%",
    timeAgo: "1d",
    description: "How to actually manage your time effectively",
    tags: ["Productivity", "TimeManagement", "Organization", "Efficiency"],
    performance: "trending",
    type: "video",
    thumbnail: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&h=120&fit=crop",
  },
  {
    id: "59",
    title: "Procrastination: The Science Behind Why We Do It",
    platform: "Instagram",
    category: "Productivity",
    views: "834K",
    engagement: "88%",
    timeAgo: "6h",
    description: "Understanding and overcoming procrastination patterns",
    tags: ["Procrastination", "Psychology", "Productivity", "Habits"],
    performance: "rising",
    type: "reel",
    thumbnail: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=120&fit=crop",
  },

  // MENTAL HEALTH & WELLNESS
  {
    id: "60",
    title: "Anxiety vs Intuition: How to Tell the Difference",
    platform: "TikTok",
    category: "Mental Health",
    views: "1.1M",
    engagement: "95%",
    timeAgo: "4h",
    description: "Understanding your inner voice and emotional responses",
    tags: ["Anxiety", "MentalHealth", "Intuition", "Wellness"],
    performance: "viral",
    type: "video",
    thumbnail: "https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=200&h=120&fit=crop",
  },
  {
    id: "61",
    title: "Therapy Myths vs Reality: What to Expect",
    platform: "YouTube",
    category: "Mental Health",
    views: "723K",
    engagement: "91%",
    timeAgo: "2d",
    description: "Demystifying mental health treatment",
    tags: ["Therapy", "MentalHealth", "Treatment", "Wellness"],
    performance: "trending",
    type: "video",
    thumbnail: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=120&fit=crop",
  },

  // RELATIONSHIPS & DATING
  {
    id: "62",
    title: "Green Flags in Dating (That Everyone Ignores)",
    platform: "Instagram",
    category: "Relationships",
    views: "943K",
    engagement: "89%",
    timeAgo: "5h",
    description: "Positive signs of healthy relationships",
    tags: ["Dating", "Relationships", "GreenFlags", "Healthy"],
    performance: "viral",
    type: "reel",
    thumbnail: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=200&h=120&fit=crop",
  },
  {
    id: "63",
    title: "Communication Skills That Save Relationships",
    platform: "TikTok",
    category: "Relationships",
    views: "1.2M",
    engagement: "93%",
    timeAgo: "7h",
    description: "How to talk through problems effectively",
    tags: ["Communication", "Relationships", "Skills", "Conflict"],
    performance: "viral",
    type: "video",
    thumbnail: "https://images.unsplash.com/photo-1491438590914-bc09fcaaf77a?w=200&h=120&fit=crop",
  },

  // CAREER & PROFESSIONAL DEVELOPMENT
  {
    id: "64",
    title: "How to negotiate your salary (even if you're shy)",
    platform: "YouTube",
    category: "Career",
    views: "489K",
    engagement: "91%",
    timeAgo: "12h",
    description: "Step-by-step guide to asking for what you're worth",
    tags: ["Career", "Salary", "Negotiation", "Tips"],
    performance: "rising",
    type: "video",
    thumbnail: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=120&fit=crop",
  },
  {
    id: "65",
    title: "Resume Red Flags Recruiters Instantly Reject",
    platform: "LinkedIn",
    category: "Career",
    views: "678K",
    engagement: "94%",
    timeAgo: "1d",
    description: "Common mistakes that kill your job applications",
    tags: ["Resume", "Career", "JobSearch", "Recruiting"],
    performance: "trending",
    type: "post",
  },

  // REAL ESTATE & INVESTING
  {
    id: "66",
    title: "House Hacking: Live for Free While Building Wealth",
    platform: "YouTube",
    category: "Real Estate",
    views: "834K",
    engagement: "92%",
    timeAgo: "1d",
    description: "Using real estate to eliminate housing costs",
    tags: ["RealEstate", "Investing", "HouseHacking", "Wealth"],
    performance: "viral",
    type: "video",
    thumbnail: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=200&h=120&fit=crop",
  },
  {
    id: "67",
    title: "Real Estate vs Stocks: Which Builds More Wealth?",
    platform: "TikTok",
    category: "Investing",
    views: "765K",
    engagement: "88%",
    timeAgo: "6h",
    description: "Comparing long-term investment strategies",
    tags: ["Investing", "RealEstate", "Stocks", "Wealth"],
    performance: "trending",
    type: "video",
    thumbnail: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=200&h=120&fit=crop",
  },

  // CRYPTOCURRENCY & BLOCKCHAIN
  {
    id: "68",
    title: "Crypto for Beginners: Start Here in 2024",
    platform: "YouTube",
    category: "Cryptocurrency",
    views: "1.1M",
    engagement: "87%",
    timeAgo: "8h",
    description: "Safe introduction to cryptocurrency investing",
    tags: ["Crypto", "Bitcoin", "Investing", "Beginner"],
    performance: "viral",
    type: "video",
    thumbnail: "https://images.unsplash.com/photo-1518544866330-4e35dc2d1710?w=200&h=120&fit=crop",
  },
  {
    id: "69",
    title: "NFTs: Dead Trend or Just Getting Started?",
    platform: "Instagram",
    category: "Cryptocurrency",
    views: "456K",
    engagement: "83%",
    timeAgo: "12h",
    description: "Realistic look at NFT market evolution",
    tags: ["NFT", "Crypto", "Digital", "Investment"],
    performance: "rising",
    type: "reel",
    thumbnail: "https://images.unsplash.com/photo-1621504450181-5d356f61d307?w=200&h=120&fit=crop",
  },

  // SUSTAINABILITY & ENVIRONMENT
  {
    id: "70",
    title: "Zero Waste Living: Is It Actually Possible?",
    platform: "TikTok",
    category: "Sustainability",
    views: "923K",
    engagement: "91%",
    timeAgo: "5h",
    description: "Realistic approach to sustainable living",
    tags: ["ZeroWaste", "Sustainability", "Environment", "Lifestyle"],
    performance: "viral",
    type: "video",
    thumbnail: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=200&h=120&fit=crop",
  },
  {
    id: "71",
    title: "Greenwashing: How Companies Trick You",
    platform: "YouTube",
    category: "Sustainability",
    views: "567K",
    engagement: "89%",
    timeAgo: "2d",
    description: "Identifying real vs fake environmental claims",
    tags: ["Greenwashing", "Environment", "Corporate", "Awareness"],
    performance: "trending",
    type: "video",
    thumbnail: "https://images.unsplash.com/photo-1569163139394-de4e4f43e4e5?w=200&h=120&fit=crop",
  },

  // PETS & ANIMALS
  {
    id: "72",
    title: "Dog Training Mistakes Every Owner Makes",
    platform: "Instagram",
    category: "Pets",
    views: "678K",
    engagement: "92%",
    timeAgo: "7h",
    description: "Common errors that confuse your pet",
    tags: ["Dogs", "Training", "Pets", "Behavior"],
    performance: "trending",
    type: "reel",
    thumbnail: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=200&h=120&fit=crop",
  },
  {
    id: "73",
    title: "Cats vs Dogs: Science Settles the Debate",
    platform: "TikTok",
    category: "Pets",
    views: "1.4M",
    engagement: "85%",
    timeAgo: "3h",
    description: "Research-based comparison of pet personalities",
    tags: ["Cats", "Dogs", "Pets", "Science"],
    performance: "viral",
    type: "video",
    thumbnail: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=200&h=120&fit=crop",
  },

  // GARDENING & NATURE
  {
    id: "74",
    title: "Indoor Garden That Feeds a Family of 4",
    platform: "YouTube",
    category: "Gardening",
    views: "743K",
    engagement: "94%",
    timeAgo: "1d",
    description: "Maximizing food production in small spaces",
    tags: ["Gardening", "Indoor", "Food", "Sustainable"],
    performance: "viral",
    type: "video",
    thumbnail: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=200&h=120&fit=crop",
  },
  {
    id: "75",
    title: "Plants That Are Impossible to Kill",
    platform: "TikTok",
    category: "Gardening",
    views: "1.2M",
    engagement: "88%",
    timeAgo: "4h",
    description: "Perfect plants for beginners and plant killers",
    tags: ["Plants", "Gardening", "Beginner", "Indoor"],
    performance: "viral",
    type: "video",
    thumbnail: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=200&h=120&fit=crop",
  },

  // HOME DECOR & DESIGN
  {
    id: "76",
    title: "Small Space, Big Impact: Apartment Transformation",
    platform: "Instagram",
    category: "Home Decor",
    views: "834K",
    engagement: "91%",
    timeAgo: "6h",
    description: "Making tiny spaces feel luxurious",
    tags: ["HomeDecor", "SmallSpace", "Design", "Apartment"],
    performance: "viral",
    type: "reel",
    thumbnail: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=200&h=120&fit=crop",
  },
  {
    id: "77",
    title: "Interior Design Rules You Can Break",
    platform: "TikTok",
    category: "Home Decor",
    views: "567K",
    engagement: "87%",
    timeAgo: "8h",
    description: "When to ignore traditional design advice",
    tags: ["InteriorDesign", "Rules", "Creative", "Home"],
    performance: "trending",
    type: "video",
    thumbnail: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=200&h=120&fit=crop",
  },

  // SPIRITUALITY & PHILOSOPHY
  {
    id: "78",
    title: "Meditation for Skeptics: What Actually Works",
    platform: "YouTube",
    category: "Spirituality",
    views: "456K",
    engagement: "89%",
    timeAgo: "2d",
    description: "Science-backed mindfulness practices",
    tags: ["Meditation", "Mindfulness", "Science", "Wellness"],
    performance: "rising",
    type: "video",
    thumbnail: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=200&h=120&fit=crop",
  },
  {
    id: "79",
    title: "Philosophy Explained Through Memes",
    platform: "TikTok",
    category: "Philosophy",
    views: "923K",
    engagement: "92%",
    timeAgo: "5h",
    description: "Complex ideas made simple and funny",
    tags: ["Philosophy", "Memes", "Education", "Funny"],
    performance: "viral",
    type: "video",
    thumbnail: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=120&fit=crop",
  },

  // COOKING & BAKING ADVANCED
  {
    id: "80",
    title: "Professional Chef Techniques Anyone Can Master",
    platform: "YouTube",
    category: "Cooking",
    views: "1.1M",
    engagement: "93%",
    timeAgo: "1d",
    description: "Restaurant secrets for home cooking",
    tags: ["Cooking", "ChefTechniques", "Professional", "Skills"],
    performance: "viral",
    type: "video",
    thumbnail: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=200&h=120&fit=crop",
  },
  {
    id: "81",
    title: "Sourdough Starter Mistakes That Kill Your Bread",
    platform: "Instagram",
    category: "Baking",
    views: "678K",
    engagement: "90%",
    timeAgo: "9h",
    description: "Common errors in sourdough maintenance",
    tags: ["Sourdough", "Baking", "Bread", "Mistakes"],
    performance: "trending",
    type: "reel",
    thumbnail: "https://images.unsplash.com/photo-1547747951-6e56af83ce35?w=200&h=120&fit=crop",
  },

  // MINIMALISM & SIMPLE LIVING
  {
    id: "82",
    title: "Extreme Minimalism: Living with 50 Items",
    platform: "TikTok",
    category: "Minimalism",
    views: "1.3M",
    engagement: "88%",
    timeAgo: "2h",
    description: "What it's really like to own almost nothing",
    tags: ["Minimalism", "Simple", "Lifestyle", "Extreme"],
    performance: "viral",
    type: "video",
    thumbnail: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=200&h=120&fit=crop",
  },
  {
    id: "83",
    title: "Digital Minimalism: Cleaning Up Your Online Life",
    platform: "YouTube",
    category: "Minimalism",
    views: "567K",
    engagement: "91%",
    timeAgo: "1d",
    description: "Simplifying your digital presence and habits",
    tags: ["DigitalMinimalism", "Technology", "Simple", "Wellness"],
    performance: "trending",
    type: "video",
    thumbnail: "https://images.unsplash.com/photo-1519452575417-564c1401ecc0?w=200&h=120&fit=crop",
  },

  // ADDITIONAL DIVERSE CONTENT
  {
    id: "84",
    title: "Learning to Code at 40: My Journey",
    platform: "LinkedIn",
    category: "Tech",
    views: "789K",
    engagement: "96%",
    timeAgo: "6h",
    description: "It's never too late to change careers",
    tags: ["Coding", "Career", "Change", "Age"],
    performance: "viral",
    type: "post",
  },
  {
    id: "85",
    title: "Why Everyone Should Learn a Musical Instrument",
    platform: "Instagram",
    category: "Music",
    views: "456K",
    engagement: "87%",
    timeAgo: "11h",
    description: "Cognitive and emotional benefits of music",
    tags: ["Music", "Learning", "Brain", "Benefits"],
    performance: "rising",
    type: "reel",
    thumbnail: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200&h=120&fit=crop",
  },
  {
    id: "86",
    title: "Street Food Around the World (Ranked)",
    platform: "TikTok",
    category: "Food",
    views: "1.6M",
    engagement: "89%",
    timeAgo: "1h",
    description: "Rating the best street food from 20 countries",
    tags: ["StreetFood", "Travel", "Food", "Culture"],
    performance: "viral",
    type: "video",
    thumbnail: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=200&h=120&fit=crop",
  },
  {
    id: "87",
    title: "Remote Work: The Skills Nobody Talks About",
    platform: "YouTube",
    category: "Career",
    views: "634K",
    engagement: "92%",
    timeAgo: "2d",
    description: "Soft skills for distributed work success",
    tags: ["RemoteWork", "Skills", "Career", "Work"],
    performance: "trending",
    type: "video",
    thumbnail: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=120&fit=crop",
  },
  {
    id: "88",
    title: "Why Introverts Make Better Leaders",
    platform: "Instagram",
    category: "Business",
    views: "543K",
    engagement: "88%",
    timeAgo: "10h",
    description: "Challenging assumptions about leadership styles",
    tags: ["Leadership", "Introvert", "Business", "Management"],
    performance: "rising",
    type: "reel",
    thumbnail: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=120&fit=crop",
  },
  {
    id: "89",
    title: "Sleep Hacks from Different Cultures",
    platform: "TikTok",
    category: "Health",
    views: "987K",
    engagement: "90%",
    timeAgo: "4h",
    description: "Ancient wisdom meets modern sleep science",
    tags: ["Sleep", "Culture", "Health", "Wellness"],
    performance: "viral",
    type: "video",
    thumbnail: "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=200&h=120&fit=crop",
  },
  {
    id: "90",
    title: "The Psychology of Color in Marketing",
    platform: "LinkedIn",
    category: "Business",
    views: "345K",
    engagement: "89%",
    timeAgo: "1d",
    description: "How colors influence consumer behavior",
    tags: ["Marketing", "Psychology", "Color", "Business"],
    performance: "rising",
    type: "post",
  }
];

const InspirationGallery: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedPlatform, setSelectedPlatform] = useState<string>("All");
  const [trendingContent, setTrendingContent] = useState<TrendingContent[]>(MOCK_TRENDING_CONTENT);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const categories = ["All", "Tech", "Lifestyle", "Business", "Entertainment", "Education", "Gaming", "Fitness", "Food", "Travel", "Finance", "Health", "Fashion", "Beauty", "Parenting", "DIY", "Music", "Art", "Photography", "Science", "History", "Politics", "Sports", "Anime", "Books", "Movies", "Comedy", "Motivation", "Productivity", "Mental Health", "Relationships", "Career", "Real Estate", "Investing", "Cryptocurrency", "Sustainability", "Pets", "Gardening", "Cooking", "Baking", "Home Decor", "Minimalism", "Self Improvement", "Spirituality", "Philosophy"];
  const platforms = ["All", "YouTube", "TikTok", "Instagram", "Twitter", "LinkedIn"];

  const filteredContent = trendingContent.filter((content) => {
    const categoryMatch = selectedCategory === "All" || content.category === selectedCategory;
    const platformMatch = selectedPlatform === "All" || content.platform === selectedPlatform;
    return categoryMatch && platformMatch;
  });

  const refreshContent = async () => {
    setIsRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Shuffle content to simulate fresh data
    const shuffled = [...MOCK_TRENDING_CONTENT].sort(() => Math.random() - 0.5);
    setTrendingContent(shuffled);
    setIsRefreshing(false);
  };

  const copyContentIdea = async (content: TrendingContent) => {
    const text = `${content.title}\nPlatform: ${content.platform}\nTags: ${content.tags.join(", ")}`;

    try {
      // Try the modern clipboard API first
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        console.log("Content idea copied to clipboard!");
      } else {
        // Fallback method for older browsers or insecure contexts
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        textArea.style.top = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        try {
          document.execCommand('copy');
          console.log("Content idea copied to clipboard (fallback method)!");
        } catch (err) {
          console.log("Content idea:", text);
          alert("Copying not supported. Content logged to console.");
        }

        document.body.removeChild(textArea);
      }
    } catch (err) {
      // If all else fails, just log the content and notify user
      console.log("Content idea:", text);
      alert(`Copy failed. Here's the content:\n\n${text}`);
    }
  };

  return (
    <div className="inspiration-gallery bg-slate-800/50 rounded-xl border border-slate-700 p-4">
      {/* Header */}
      <div 
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2">
          <LightBulbIcon className="w-5 h-5 text-yellow-400" />
          <h3 className="font-semibold text-white">Inspiration Gallery</h3>
          <span className="text-xs bg-slate-600 text-slate-300 px-2 py-1 rounded-full">
            {filteredContent.length}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              refreshContent();
            }}
            disabled={isRefreshing}
            className="p-1 hover:bg-slate-600 rounded transition-colors"
            title="Refresh content"
          >
            <ArrowPathIcon className={`w-4 h-4 text-slate-400 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </motion.div>
        </div>
      </div>

      {/* Compact preview */}
      {!isExpanded && (
        <div className="mt-3">
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
            <FireIcon className="w-3 h-3 text-red-400" />
            <span>Trending now:</span>
          </div>
          <div className="space-y-1">
            {filteredContent.slice(0, 2).map((content) => (
              <div key={content.id} className="text-xs text-slate-300 truncate">
                <span className={`inline-block w-2 h-2 rounded-full mr-2 ${PLATFORM_COLORS[content.platform].split(' ')[2]}`}></span>
                {content.title}
              </div>
            ))}
          </div>
        </div>
      )}

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-4 space-y-4"
          >
            {/* Filters */}
            <div className="flex flex-wrap gap-2">
              {/* Category Filter */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="text-xs bg-slate-700 border border-slate-600 rounded px-2 py-1 text-white"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>

              {/* Platform Filter */}
              <select
                value={selectedPlatform}
                onChange={(e) => setSelectedPlatform(e.target.value)}
                className="text-xs bg-slate-700 border border-slate-600 rounded px-2 py-1 text-white"
              >
                {platforms.map((platform) => (
                  <option key={platform} value={platform}>{platform}</option>
                ))}
              </select>
            </div>

            {/* Content Grid */}
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {filteredContent.map((content) => {
                const PerformanceIcon = PERFORMANCE_BADGES[content.performance].icon;
                
                return (
                  <motion.div
                    key={content.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-slate-700/30 border border-slate-600 rounded-lg p-3 hover:bg-slate-700/50 transition-colors group"
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <span className={`text-xs px-2 py-1 rounded border ${PLATFORM_COLORS[content.platform]}`}>
                          {content.platform}
                        </span>
                        <span className={`text-xs ${PERFORMANCE_BADGES[content.performance].color}`}>
                          {PERFORMANCE_BADGES[content.performance].label}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-slate-400">
                        <ClockIcon className="w-3 h-3" />
                        {content.timeAgo}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex gap-3">
                      {content.thumbnail && (
                        <img
                          src={content.thumbnail}
                          alt=""
                          className="w-12 h-8 rounded object-cover flex-shrink-0"
                        />
                      )}
                      <div className="min-w-0 flex-1">
                        <h4 className="text-sm font-medium text-white mb-1 line-clamp-2">
                          {content.title}
                        </h4>
                        <p className="text-xs text-slate-400 mb-2 line-clamp-2">
                          {content.description}
                        </p>
                        
                        {/* Tags */}
                        <div className="flex flex-wrap gap-1 mb-2">
                          {content.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="text-xs bg-slate-600 text-slate-300 px-1.5 py-0.5 rounded"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>

                        {/* Stats */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 text-xs text-slate-400">
                            <div className="flex items-center gap-1">
                              <EyeIcon className="w-3 h-3" />
                              {content.views}
                            </div>
                            <div className="flex items-center gap-1">
                              <HeartIcon className="w-3 h-3" />
                              {content.engagement}
                            </div>
                          </div>
                          
                          <button
                            onClick={() => copyContentIdea(content)}
                            className="opacity-0 group-hover:opacity-100 p-1 hover:bg-slate-600 rounded transition-all text-slate-400 hover:text-white"
                            title="Copy idea"
                          >
                            <ArrowTopRightOnSquareIcon className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}

              {filteredContent.length === 0 && (
                <div className="text-center py-6 text-slate-400">
                  <LightBulbIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No trending content found for your filters</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="text-xs text-slate-400 pt-2 border-t border-slate-600">
              <div className="flex items-center justify-between">
                <p>💡 Click any content to copy the idea</p>
                <p className="text-slate-500">Updated 5 min ago</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default InspirationGallery;
