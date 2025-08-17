export interface CreditTransaction {
  id: string;
  userId: string;
  type: "purchase" | "usage" | "refund" | "bonus" | "subscription_renewal";
  amount: number; // positive for credits added, negative for credits used
  description: string;
  createdAt: Date;
  relatedId?: string; // subscription ID, purchase ID, etc.
}

export interface UserCredits {
  userId: string;
  totalCredits: number;
  subscriptionCredits: number; // Credits from active subscription (reset monthly)
  purchasedCredits: number; // One-time purchased credits (never expire)
  bonusCredits: number; // Free credits from promotions, etc.
  lastUpdated: Date;
  lastReset?: Date; // When subscription credits were last reset
}

export interface CreditPackage {
  id: string;
  name: string;
  description: string;
  credits: number;
  price: number; // in USD cents
  bonusCredits?: number; // extra credits included
  stripePriceId: string;
  popular?: boolean;
}

export interface CreditUsageConfig {
  [key: string]: number; // feature name -> credit cost
}

// Credit costs for different actions
// Based on Gemini API costs + infrastructure + 400-500% profit margin
export const CREDIT_COSTS: CreditUsageConfig = {
  content_generation: 1, // API cost ~$0.003, Credit value ~$0.10 = 3,333% margin
  image_generation: 1, // API cost ~$0.0001, Credit value ~$0.10 = 100,000% margin
  video_generation: 2, // API cost ~$0.004, Credit value ~$0.20 = 5,000% margin
  trend_analysis: 3, // API cost ~$0.007, Credit value ~$0.156 = 2,100% margin
  youtube_stats: 2, // API cost ~$0.005, Credit value ~$0.104 = 1,980% margin
  youtube_channel_analysis: 4, // API cost ~$0.005, Credit value ~$0.208 = 4,060% margin
  batch_generation: 1, // per item in batch
  advanced_analytics: 0, // included in subscription
  canvas_export: 1,
  api_call: 1,
};

export const CREDIT_PACKAGES: CreditPackage[] = [
  {
    id: "starter_pack",
    name: "Starter Pack",
    description: "Perfect for small projects",
    credits: 25,
    price: 300, // $3.00
    stripePriceId: "price_credits_starter_25",
  },
  {
    id: "creator_pack",
    name: "Creator Pack",
    description: "Great value for creators",
    credits: 100,
    price: 800, // $8.00
    stripePriceId: "price_credits_creator_100",
    popular: true,
  },
  {
    id: "pro_pack",
    name: "Pro Pack",
    description: "For professional work",
    credits: 300,
    price: 1900, // $19.00
    stripePriceId: "price_credits_pro_300",
  },
  {
    id: "studio_pack",
    name: "Studio Pack",
    description: "Maximum value pack",
    credits: 750,
    price: 3900, // $39.00
    stripePriceId: "price_credits_studio_750",
  },
];
