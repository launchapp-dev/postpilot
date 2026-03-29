import Link from "next/link";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Sparkles,
  CalendarClock,
  Globe,
  Camera,
  Music2,
  Hash,
  Cloud,
  MessageCircle,
  Zap,
  BarChart3,
  Share2,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default async function HomePage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Navbar />
      <main>
        <HeroSection />
        <SocialProofBar />
        <FeaturesSection />
        <HowItWorksSection />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}

function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <Zap className="h-5 w-5 text-primary" />
          PostPilot
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium text-muted-foreground md:flex">
          <Link href="#features" className="hover:text-foreground transition-colors">Features</Link>
          <Link href="#how-it-works" className="hover:text-foreground transition-colors">How it works</Link>
        </nav>
        <div className="flex items-center gap-3">
          <Link href="/login" className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}>
            Log in
          </Link>
          <Link href="/signup" className={cn(buttonVariants({ size: "sm" }))}>
            Get Started
          </Link>
        </div>
      </div>
    </header>
  );
}

function HeroSection() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-24 text-center md:py-32">
      <Badge variant="secondary" className="mb-6">
        AI-native social media automation
      </Badge>
      <h1 className="mx-auto max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
        Run your entire social media strategy on autopilot
      </h1>
      <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
        Generate AI-powered content, schedule posts across every platform, and track performance — all from one place.
      </p>
      <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
        <Link href="/signup" className={cn(buttonVariants({ size: "lg" }))}>
          Get Started Free
        </Link>
        <Link href="#how-it-works" className={cn(buttonVariants({ variant: "outline", size: "lg" }))}>
          See How It Works
        </Link>
      </div>
      <div className="mt-16 overflow-hidden rounded-xl border border-border bg-muted/50 shadow-lg">
        <div className="flex items-center gap-1.5 border-b border-border px-4 py-3">
          <span className="h-3 w-3 rounded-full bg-red-400" />
          <span className="h-3 w-3 rounded-full bg-yellow-400" />
          <span className="h-3 w-3 rounded-full bg-green-400" />
          <span className="ml-4 text-xs text-muted-foreground">PostPilot Dashboard</span>
        </div>
        <div className="grid grid-cols-3 gap-4 p-6 sm:grid-cols-4">
          {["Scheduled", "Published", "Drafts", "This week"].map((label, i) => (
            <div key={label} className="rounded-lg border border-border bg-background p-4">
              <p className="text-xs text-muted-foreground">{label}</p>
              <p className="mt-1 text-2xl font-bold">{[12, 48, 5, 7][i]}</p>
            </div>
          ))}
          <div className="col-span-3 rounded-lg border border-border bg-background p-4 sm:col-span-4">
            <p className="mb-3 text-sm font-medium">Recent Posts</p>
            <div className="space-y-2">
              {[
                { platform: "X", status: "Published", text: "Excited to announce our new feature..." },
                { platform: "LinkedIn", status: "Scheduled", text: "5 ways to grow your audience in 2025..." },
                { platform: "Instagram", status: "Draft", text: "Behind the scenes at our office..." },
              ].map((post) => (
                <div key={post.text} className="flex items-center justify-between rounded border border-border px-3 py-2 text-xs">
                  <span className="text-muted-foreground">{post.platform}</span>
                  <span className="flex-1 truncate px-3">{post.text}</span>
                  <Badge variant="secondary" className="text-xs">{post.status}</Badge>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function SocialProofBar() {
  const platforms = [
    { icon: Share2, name: "X (Twitter)" },
    { icon: Globe, name: "LinkedIn" },
    { icon: Camera, name: "Instagram" },
    { icon: Music2, name: "TikTok" },
    { icon: Cloud, name: "Bluesky" },
    { icon: MessageCircle, name: "Threads" },
  ];

  return (
    <section className="border-y border-border bg-muted/30 py-10">
      <div className="mx-auto max-w-6xl px-6">
        <p className="mb-8 text-center text-sm font-medium text-muted-foreground">
          Publish to all major platforms from one dashboard
        </p>
        <div className="flex flex-wrap items-center justify-center gap-8">
          {platforms.map(({ icon: Icon, name }) => (
            <div key={name} className="flex items-center gap-2 text-muted-foreground">
              <Icon className="h-5 w-5" />
              <span className="text-sm font-medium">{name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturesSection() {
  const features = [
    {
      icon: Sparkles,
      title: "AI Content Generation",
      description:
        "Generate on-brand captions, threads, and long-form posts in seconds. Trained on your brand voice and past content.",
    },
    {
      icon: CalendarClock,
      title: "Smart Scheduling",
      description:
        "Pick the best times to post or let PostPilot auto-schedule for peak engagement. Visual calendar keeps you on track.",
    },
    {
      icon: Globe,
      title: "Multi-Platform Publishing",
      description:
        "Write once, publish everywhere. Connect X, LinkedIn, Instagram, TikTok, Bluesky, and Threads in minutes.",
    },
    {
      icon: BarChart3,
      title: "Performance Analytics",
      description:
        "Track reach, engagement, and growth across every platform. Understand what works and double down on it.",
    },
    {
      icon: Zap,
      title: "Bulk Scheduling",
      description:
        "Upload a week's worth of content in one go. Plan campaigns in advance and never scramble for content.",
    },
    {
      icon: MessageCircle,
      title: "Campaign Management",
      description:
        "Group posts into campaigns, set goals, and measure results. Keep launches, promotions, and series organized.",
    },
  ];

  return (
    <section id="features" className="mx-auto max-w-6xl px-6 py-24">
      <div className="mb-16 text-center">
        <Badge variant="secondary" className="mb-4">Features</Badge>
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Everything you need to grow on social
        </h2>
        <p className="mt-4 text-muted-foreground">
          From content creation to publishing and analytics — PostPilot handles it all.
        </p>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {features.map(({ icon: Icon, title, description }) => (
          <Card key={title}>
            <CardHeader className="pb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="mt-3 font-semibold">{title}</h3>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}

function HowItWorksSection() {
  const steps = [
    {
      number: "01",
      title: "Connect your accounts",
      description:
        "Link your social profiles in seconds. PostPilot supports X, LinkedIn, Instagram, TikTok, Bluesky, and Threads.",
    },
    {
      number: "02",
      title: "Generate AI content",
      description:
        "Describe your post idea or paste a URL. Our AI writes platform-optimized content in your brand's voice.",
    },
    {
      number: "03",
      title: "Publish everywhere",
      description:
        "Review, schedule, and publish in one click. Your content goes live across all platforms simultaneously.",
    },
  ];

  return (
    <section id="how-it-works" className="bg-muted/30 py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-16 text-center">
          <Badge variant="secondary" className="mb-4">How it works</Badge>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            From idea to published in minutes
          </h2>
          <p className="mt-4 text-muted-foreground">
            Three simple steps to automate your entire social media workflow.
          </p>
        </div>
        <div className="grid gap-8 sm:grid-cols-3">
          {steps.map(({ number, title, description }, index) => (
            <div key={number} className="relative flex flex-col items-center text-center sm:items-start sm:text-left">
              {index < steps.length - 1 && (
                <div className="absolute left-1/2 top-6 hidden h-px w-full -translate-y-1/2 translate-x-1/2 border-t border-dashed border-border sm:block" />
              )}
              <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full border-2 border-primary bg-background text-sm font-bold text-primary">
                {number}
              </div>
              <h3 className="mt-4 font-semibold">{title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-24 text-center">
      <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
        Start publishing smarter today
      </h2>
      <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
        Join thousands of brands automating their social media with PostPilot. No credit card required.
      </p>
      <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
        <Link href="/signup" className={cn(buttonVariants({ size: "lg" }))}>
          Get Started Free
        </Link>
        <Link href="/login" className={cn(buttonVariants({ variant: "outline", size: "lg" }))}>
          Sign In
        </Link>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Zap className="h-4 w-4 text-primary" />
            PostPilot
          </Link>
          <nav className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
            <Link href="#features" className="hover:text-foreground transition-colors">Features</Link>
            <Link href="/login" className="hover:text-foreground transition-colors">Login</Link>
            <Link href="/signup" className="hover:text-foreground transition-colors">Sign Up</Link>
          </nav>
        </div>
        <Separator className="my-6" />
        <p className="text-center text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} PostPilot. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
