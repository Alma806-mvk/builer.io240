import { useState } from "react"
import { Button } from "./ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import { Switch } from "./ui/switch"
import { 
  Crown, 
  Check, 
  Gem, 
  CreditCard, 
  Calendar,
  Zap,
  Sparkles,
  Users,
  Building,
  ArrowRight,
  Gift
} from "lucide-react"

export const BillingPageUnified: React.FC = () => {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly")

  const subscriptionPlans = [
    {
      name: "Creator Free",
      price: { monthly: 0, yearly: 0 },
      description: "Perfect for getting started with basic creation tools",
      features: [
        "25 credits/month",
        "Basic templates",
        "Standard quality exports",
        "Community support",
        "2 projects limit"
      ],
      icon: Sparkles,
      popular: false,
      current: false
    },
    {
      name: "Creator Pro",
      price: { monthly: 29, yearly: 290 },
      description: "Ideal for content creators and small teams",
      features: [
        "1,000 credits/month",
        "Premium templates",
        "HD quality exports",
        "Priority support",
        "Unlimited projects",
        "Advanced analytics",
        "Custom branding"
      ],
      icon: Crown,
      popular: true,
      current: true
    },
    {
      name: "Agency Pro",
      price: { monthly: 79, yearly: 790 },
      description: "Built for agencies and growing teams",
      features: [
        "5,000 credits/month",
        "Team collaboration",
        "White-label solutions",
        "API access",
        "Custom integrations",
        "Dedicated support",
        "Advanced permissions",
        "Bulk operations"
      ],
      icon: Users,
      popular: false,
      current: false
    },
    {
      name: "Enterprise",
      price: { monthly: 299, yearly: 2990 },
      description: "Enterprise-grade solution for large organizations",
      features: [
        "Unlimited credits",
        "Custom deployment",
        "SSO integration",
        "Advanced security",
        "Custom training",
        "24/7 dedicated support",
        "Custom contracts",
        "SLA guarantees"
      ],
      icon: Building,
      popular: false,
      current: false
    }
  ]

  const creditPacks = [
    {
      name: "Starter Pack",
      price: 3,
      credits: 25,
      description: "Perfect for trying out premium features",
      popular: false
    },
    {
      name: "Creator Pack",
      price: 8,
      credits: 100,
      description: "Great for content creators",
      popular: true
    },
    {
      name: "Pro Pack",
      price: 19,
      credits: 300,
      description: "Best value for regular users",
      popular: false
    },
    {
      name: "Studio Pack",
      price: 39,
      credits: 750,
      description: "Ideal for studios and teams",
      popular: false
    }
  ]

  return (
    <div className="max-w-6xl mx-auto space-y-8 p-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold gradient-text">Billing & Subscription</h1>
        <p className="text-text-secondary text-lg max-w-2xl mx-auto">
          Choose the perfect plan for your creative needs. Upgrade, downgrade, or cancel anytime.
        </p>
      </div>

      {/* Current Plan Status */}
      <Card className="glass-card border-border-accent/50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center">
                <Crown className="w-6 h-6 text-text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-text-primary">Creator Pro - Active</h3>
                <p className="text-text-tertiary">Next billing: March 15, 2024 • $29.00</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="bg-accent-success/20 text-accent-success border-accent-success/30">
                Active
              </Badge>
              <Button variant="outline" size="sm">
                Manage
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Billing Toggle */}
      <div className="flex items-center justify-center gap-4 p-6 bg-bg-secondary rounded-lg border border-border-primary">
        <span className={`font-medium ${billingCycle === 'monthly' ? 'text-text-primary' : 'text-text-tertiary'}`}>
          Monthly
        </span>
        <Switch 
          checked={billingCycle === 'yearly'}
          onCheckedChange={(checked) => setBillingCycle(checked ? 'yearly' : 'monthly')}
        />
        <span className={`font-medium ${billingCycle === 'yearly' ? 'text-text-primary' : 'text-text-tertiary'}`}>
          Yearly
        </span>
        {billingCycle === 'yearly' && (
          <Badge variant="secondary" className="bg-accent-success/20 text-accent-success border-accent-success/30 ml-2">
            Save 17%
          </Badge>
        )}
      </div>

      {/* Subscription Plans (3 main), Enterprise moved below */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-text-primary text-center">Subscription Plans</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {subscriptionPlans.filter(p => p.name !== 'Enterprise').map((plan) => (
            <Card
              key={plan.name}
              className={`relative glass-card transition-all duration-normal hover:shadow-design-lg ${plan.popular ? 'border-border-accent ring-1 ring-border-accent/20' : ''} ${plan.current ? 'bg-gradient-primary-muted' : ''}`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-gradient-primary text-text-primary px-3 py-1">Most Popular</Badge>
                </div>
              )}
              {plan.current && (
                <div className="absolute -top-3 right-4">
                  <Badge variant="secondary" className="bg-accent-success/20 text-accent-success border-accent-success/30">Current Plan</Badge>
                </div>
              )}

              <CardHeader className="text-center pb-4">
                <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <plan.icon className="w-6 h-6 text-text-primary" />
                </div>
                <CardTitle className="text-text-primary">{plan.name}</CardTitle>
                <div className="space-y-1">
                  <div className="text-3xl font-bold text-text-primary">
                    ${billingCycle === 'monthly' ? plan.price.monthly : Math.floor(plan.price.yearly / 12)}
                    <span className="text-base font-normal text-text-tertiary">/month</span>
                  </div>
                  {billingCycle === 'yearly' && plan.price.yearly > 0 && (
                    <p className="text-sm text-text-tertiary">${plan.price.yearly} billed yearly</p>
                  )}
                </div>
                <CardDescription className="text-text-tertiary">{plan.description}</CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-3">
                      <Check className="w-4 h-4 text-accent-success flex-shrink-0" />
                      <span className="text-text-secondary text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  className={`w-full gap-2 ${plan.current ? 'bg-bg-tertiary text-text-secondary cursor-not-allowed' : plan.popular ? 'bg-gradient-primary hover:opacity-90' : ''}`}
                  variant={plan.current ? 'outline' : plan.popular ? 'default' : 'outline'}
                  disabled={plan.current}
                >
                  {plan.current ? (
                    'Current Plan'
                  ) : (
                    <>
                      {plan.name === 'Creator Free' ? 'Downgrade' : 'Upgrade'}
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Credit Packs */}
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-text-primary">One-Time Credit Packs</h2>
          <p className="text-text-secondary">Need extra credits? Purchase additional credits that never expire.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {creditPacks.map((pack, index) => (
            <Card 
              key={pack.name} 
              className={`glass-card transition-all duration-normal hover:shadow-design-lg relative ${
                pack.popular ? 'border-border-accent ring-1 ring-border-accent/20' : ''
              }`}
            >
              {pack.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-gradient-primary text-text-primary px-3 py-1">
                    Best Value
                  </Badge>
                </div>
              )}
              
              <CardHeader className="text-center">
                <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Gem className="w-6 h-6 text-text-primary" />
                </div>
                <CardTitle className="text-text-primary">{pack.name}</CardTitle>
                <div className="text-3xl font-bold text-text-primary">
                  ${pack.price}
                </div>
                <div className="text-lg font-semibold text-accent-purple">
                  {pack.credits.toLocaleString()} Credits
                </div>
                <CardDescription className="text-text-tertiary">
                  {pack.description}
                </CardDescription>
              </CardHeader>

              <CardContent>
                <Button 
                  className={`w-full gap-2 ${pack.popular ? 'bg-gradient-primary hover:opacity-90' : ''}`}
                  variant={pack.popular ? 'default' : 'outline'}
                >
                  <Gift className="w-4 h-4" />
                  Purchase Credits
                </Button>
                <p className="text-xs text-text-tertiary text-center mt-2">
                  ${(pack.price / pack.credits * 100).toFixed(2)} per 100 credits
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Enterprise horizontal card below subscriptions */}
      <Card className="glass-card bg-gradient-primary-muted border-border-accent/30">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row items-center gap-6 lg:gap-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center">
                <Building className="w-6 h-6 text-text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-text-primary">Enterprise</h3>
                <p className="text-text-tertiary">Unlimited credits • Custom deployment • Advanced security</p>
              </div>
            </div>
            <div className="flex-1" />
            <div className="flex flex-col sm:flex-row gap-3">
              <Button className="gap-2 bg-gradient-primary text-text-primary">
                <Calendar className="w-4 h-4" />
                Schedule Demo
              </Button>
              <Button variant="outline" className="gap-2">
                <CreditCard className="w-4 h-4" />
                Contact Sales
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* FAQ Section */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-center">Frequently Asked Questions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <h4 className="font-semibold text-text-primary">Can I change my plan anytime?</h4>
              <p className="text-text-secondary text-sm">
                Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-text-primary">Do credits rollover?</h4>
              <p className="text-text-secondary text-sm">
                Subscription credits reset monthly. One-time credit packs never expire.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-text-primary">What payment methods do you accept?</h4>
              <p className="text-text-secondary text-sm">
                We accept all major credit cards, PayPal, and bank transfers for Enterprise plans.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-text-primary">Is there a free trial?</h4>
              <p className="text-text-secondary text-sm">
                All new accounts start with a free Creator Free plan. No credit card required.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
