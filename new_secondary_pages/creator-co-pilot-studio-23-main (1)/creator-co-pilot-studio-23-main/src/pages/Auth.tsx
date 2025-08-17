import { SEOHead } from "@/components/SEO";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import BackgroundGlow from "@/components/BackgroundGlow";

const Auth = () => {
  const canonical = typeof window !== 'undefined' ? window.location.href : undefined;
  return (
    <>
      <SEOHead
        title="Sign in / Sign up — CreateGen Studio"
        description="Access your studio — the confident co‑pilot for creator‑entrepreneurs."
        canonical={canonical}
      />

      <img src="/lovable-uploads/d02aed59-7371-4574-9867-610857039366.png" alt="CreateGen Studio authentication gradient background" className="fixed inset-0 -z-30 h-full w-full object-cover" loading="eager" />
      <div aria-hidden className="fixed inset-0 -z-20 bg-gradient-to-b from-background/60 via-background/30 to-background/60" />
      <BackgroundGlow intensity={0.10} />

      <section className="container py-16 md:py-24">
        <div className="mx-auto max-w-md">
          <header className="text-center mb-8">
            <h1 className="font-display text-3xl md:text-4xl">Welcome back</h1>
            <p className="text-muted-foreground mt-2">Sign in or create your account to get started.</p>
          </header>

          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign in</TabsTrigger>
              <TabsTrigger value="signup">Create account</TabsTrigger>
            </TabsList>

            <TabsContent value="signin">
              <Card>
                <CardHeader>
                  <CardTitle>Sign in</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email-si">Email</Label>
                    <Input id="email-si" type="email" placeholder="you@brand.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password-si">Password</Label>
                    <Input id="password-si" type="password" placeholder="••••••••" />
                  </div>
                  <Button variant="gradient" className="w-full">Continue</Button>
                  <div className="relative">
                    <Separator className="my-4" />
                    <span className="absolute left-1/2 -translate-x-1/2 -top-2 bg-background px-2 text-xs text-muted-foreground">or</span>
                  </div>
                  <Button variant="outline" className="w-full" type="button">Continue with Google</Button>
                  <p className="text-xs text-muted-foreground text-center">By continuing you agree to our <a href="/terms" className="story-link">Terms</a> and <a href="/privacy" className="story-link">Privacy</a>.</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="signup">
              <Card>
                <CardHeader>
                  <CardTitle>Create your account</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name-su">Name</Label>
                    <Input id="name-su" type="text" placeholder="Your name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email-su">Email</Label>
                    <Input id="email-su" type="email" placeholder="you@brand.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password-su">Password</Label>
                    <Input id="password-su" type="password" placeholder="Create a strong password" />
                  </div>
                  <Button variant="gradient" className="w-full">Create account</Button>
                  <div className="relative">
                    <Separator className="my-4" />
                    <span className="absolute left-1/2 -translate-x-1/2 -top-2 bg-background px-2 text-xs text-muted-foreground">or</span>
                  </div>
                  <Button variant="outline" className="w-full" type="button">Sign up with Google</Button>
                  <p className="text-xs text-muted-foreground text-center">No credit card required. Free plan included.</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </>
  );
};

export default Auth;
