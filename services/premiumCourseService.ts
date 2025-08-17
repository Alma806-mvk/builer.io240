import { ContentType } from '../types';

export interface MonetizableCourseOptions {
  courseModules: number;
  courseDuration: string;
  courseDifficulty: string;
  includeAssessments: boolean;
  courseObjectives?: string;
  targetAudience: string;
  pricePoint: string;
  includeMarketing: boolean;
  includeBonuses: boolean;
  includeUpsells: boolean;
}

export const generateMonetizableCoursePrompt = (
  userInput: string,
  options: MonetizableCourseOptions,
  baseDetails: string
): string => {
  const {
    courseModules = 8,
    courseDuration = "6-8 weeks",
    courseDifficulty = "Beginner to Intermediate",
    includeAssessments = true,
    courseObjectives,
    targetAudience,
    pricePoint = "$297-$497",
    includeMarketing = true,
    includeBonuses = true,
    includeUpsells = true
  } = options;

  return `${baseDetails}

🎓 PREMIUM MONETIZABLE ONLINE COURSE CREATION

Design a comprehensive, high-value online course optimized for maximum revenue and student success for: "${userInput}"

**TARGET AUDIENCE**: ${targetAudience}
**PRICE POINT**: ${pricePoint}
**REVENUE GOAL**: Optimize for 6-figure annual course revenue

**COURSE SPECIFICATIONS:**
📚 **Modules**: ${courseModules} comprehensive modules
⏰ **Duration**: ${courseDuration}
🎯 **Level**: ${courseDifficulty}
📝 **Assessments**: ${includeAssessments ? "Complete assessment suite with certifications" : "Content delivery focused"}
${courseObjectives ? `🏆 **Learning Objectives**: ${courseObjectives}` : ""}

**💰 MONETIZATION FRAMEWORK:**

🎯 **COURSE OVERVIEW & VALUE PROPOSITION**
**Title**: [Irresistible course title that promises transformation]
**Tagline**: [One-line transformation promise]
**Target Market**: [Specific high-value demographic]
**Pain Points Solved**: [3-5 critical problems addressed]
**Transformation Promise**: [Specific outcome students will achieve]
**Unique Selling Proposition**: [What makes this course different]
**Price Point**: ${pricePoint}
**Revenue Potential**: [Annual revenue projections]

🎬 **COURSE SALES PAGE ELEMENTS**
**Hero Section**:
• Compelling headline with transformation promise
• Subheadline explaining the opportunity
• High-converting video sales letter script
• Social proof and testimonials placement

**Problem Agitation**:
• Current industry challenges
• Cost of inaction
• Why other solutions fail
• Urgency and scarcity elements

**Solution Presentation**:
• Course methodology overview
• Success framework explanation
• Before/after scenarios
• Risk reversal guarantees

**💎 DETAILED MODULE BREAKDOWN**

${Array.from(
    { length: courseModules },
    (_, i) => `
**MODULE ${i + 1}: [High-Value Module Title]**
📖 **Overview**: [Transformation this module delivers]
💰 **Value**: [Dollar value of this module alone: $X]
🎯 **Learning Objectives**: [Specific ROI-focused outcomes]
📚 **Lessons** (3-5 lessons per module):
   • Lesson 1: [Core concept + implementation] (20-30 min)
   • Lesson 2: [Advanced strategy + case study] (25-35 min)
   • Lesson 3: [Tools + templates + walkthrough] (30-40 min)
   • Lesson 4: [Common mistakes + optimization] (20-25 min)
   • Lesson 5: [Scaling + advanced techniques] (25-30 min)

🔥 **Key Concepts**: [3-5 breakthrough concepts]
🛠️ **Tools & Templates**: [Downloadable resources included]
📊 **Case Studies**: [Real student success stories]
🔧 **Practical Exercise**: [Revenue-generating activity]
${includeAssessments ? `📝 **Certification Assessment**: [Professional-grade evaluation]` : ""}
📈 **Success Metrics**: [Measurable results students achieve]
💡 **Bonus Content**: [Additional high-value resources]
`
  ).join("")}

${includeBonuses ? `
🎁 **HIGH-VALUE BONUS PACKAGE** (Total Value: $1,500+)

**Bonus #1**: [Title] - Premium Template Pack ($297 value)
• [Specific templates and tools]
• [Implementation guides]
• [Video walkthroughs]

**Bonus #2**: [Title] - Exclusive Masterclass ($197 value)
• [Advanced strategy session]
• [Behind-the-scenes insights]
• [Q&A with expert]

**Bonus #3**: [Title] - Private Community Access ($497 value)
• [Lifetime access details]
• [Networking opportunities]
• [Ongoing support]

**Bonus #4**: [Title] - Personal Success Blueprint ($297 value)
• [Customized action plan]
• [Goal-setting framework]
• [Progress tracking tools]

**Bonus #5**: [Title] - Expert Resource Library ($397 value)
• [Industry tools and software]
• [Recommended reading list]
• [Partner discounts and deals]
` : ""}

${includeUpsells ? `
🚀 **UPSELL OPPORTUNITIES**

**Immediate Upsells** (During checkout):
• VIP Coaching Package ($997-$2,497)
  - 1-on-1 coaching sessions
  - Personalized feedback
  - Direct access to instructor
  - Custom strategy development

• Done-With-You Implementation ($497-$997)
  - Live group coaching calls
  - Weekly Q&A sessions
  - Accountability partnerships
  - Group mastermind access

**Backend Upsells** (Post-purchase):
• Advanced Certification Program ($1,497-$2,997)
• Affiliate/Reseller Licensing ($497-$997)
• High-Level Mastermind ($5,000-$10,000/year)
• Consulting/Agency Training ($2,997-$9,997)

**Continuity Revenue**:
• Monthly Membership Community ($47-$97/month)
• Software/Tool Subscriptions ($29-$197/month)
• Ongoing Coaching Programs ($297-$497/month)
` : ""}

${includeMarketing ? `
📈 **MARKETING & LAUNCH STRATEGY**

**Pre-Launch Content Marketing**:
• Blog post series addressing pain points
• Free lead magnets and opt-in sequences
• Social media content calendar
• Podcast guest appearances
• YouTube video strategy

**Launch Sequence**:
• Week 1: Problem awareness content
• Week 2: Solution introduction
• Week 3: Course announcement + early bird
• Week 4: Cart open with bonuses
• Week 5: Scarcity and cart close

**Traffic & Lead Generation**:
• Organic content strategy
• Paid advertising campaigns (Facebook, Google)
• Affiliate recruitment program
• Joint venture partnerships
• Webinar/challenge funnel

**Email Marketing Sequences**:
• Welcome sequence (5-7 emails)
• Sales sequence (8-12 emails)
• Post-purchase onboarding
• Student success stories
• Re-engagement campaigns

**Sales Conversion Elements**:
• High-converting sales page copy
• Video sales letter script
• Objection handling sequences
• Social proof compilation
• Guarantee and risk reversal
` : ""}

💰 **REVENUE OPTIMIZATION STRATEGY**

**Pricing Psychology**:
• Premium positioning strategy
• Payment plan options (3-6 months)
• Limited-time discounts and bonuses
• Scholarship/payment assistance options

**Revenue Streams**:
• Core course sales: ${pricePoint}
• Upsells and cross-sells: $500-$2,500 additional
• Affiliate commissions: 30-50% recurring
• Corporate licensing: $5,000-$25,000
• Speaking and consulting: $2,500-$10,000

**Student Success Framework**:
• Onboarding sequence for high engagement
• Progress tracking and celebration
• Community building and networking
• Success story documentation
• Testimonial and case study collection

**📊 SUCCESS METRICS & GOALS**

**Financial Targets**:
• Course price: ${pricePoint}
• Monthly sales goal: 20-50 students
• Average cart value: $400-$800
• Annual revenue target: $100,000-$500,000
• Profit margin: 80-90%

**Student Success Metrics**:
• Completion rate: 75%+ (industry average: 15%)
• Satisfaction score: 4.8/5+
• Implementation rate: 60%+
• Results achievement: 80%+
• Community engagement: 40%+

**Growth Metrics**:
• Email list growth: 1,000-5,000/month
• Organic reach increase: 50%/month
• Affiliate recruitment: 25-100 active affiliates
• Repeat customer rate: 30%+
• Referral rate: 25%+

This comprehensive course structure is designed to generate significant revenue while delivering exceptional student outcomes and building a sustainable, scalable online education business.`;
};

export const getCourseMarketingMaterials = (courseTitle: string, targetAudience: string): string => {
  return `
🎯 **COURSE MARKETING MATERIALS PACKAGE**

**Sales Page Headlines** (A/B test options):
1. "The Only [Topic] Course You'll Ever Need to [Achieve Result]"
2. "How [Target Audience] Are [Achieving Result] in Just [Timeframe]"
3. "The [Adjective] [Topic] System That's [Creating Results] for [Number]+ Students"
4. "[Controversial Statement] About [Topic] (And How to [Benefit])"
5. "Finally, A [Topic] Course That Actually [Delivers Promise]"

**Email Subject Lines** (High-converting):
1. "Your [result] blueprint is inside..."
2. "[Name], this changes everything about [topic]"
3. "24 hours left (+ your special bonus)"
4. "The [topic] mistake that's costing you $[amount]"
5. "Case study: How [student] achieved [result]"

**Social Media Posts** (Ready-to-use):
• Facebook ad copy variations
• Instagram story templates
• LinkedIn professional posts
• Twitter thread outlines
• YouTube video descriptions

**Video Sales Letter Script**:
• Hook and attention-grabbing opener
• Problem identification and agitation
• Solution presentation and proof
• Offer details and bonuses
• Call-to-action and urgency

**Testimonial Collection Framework**:
• Success story interview questions
• Case study documentation template
• Video testimonial guidelines
• Written review prompts
• Social proof compilation strategy
`;
};

export const generateCourseContentCalendar = (launchDate: string): string => {
  return `
📅 **90-DAY COURSE LAUNCH CONTENT CALENDAR**

**Phase 1: Pre-Launch (Days 1-30)**
Week 1-2: Educational Content & Authority Building
Week 3-4: Problem Awareness & Solution Hinting

**Phase 2: Launch Build-Up (Days 31-60)**
Week 5-6: Course Announcement & Early Bird
Week 7-8: Social Proof & Success Stories

**Phase 3: Launch & Sales (Days 61-90)**
Week 9-10: Cart Open & Bonus Reveals
Week 11-12: Scarcity & Cart Close
Week 13: Post-Launch & Delivery

Each phase includes specific content types, posting schedules, and conversion optimization strategies.
`;
};
