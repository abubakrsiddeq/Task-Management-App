import Link from "next/link";
import { ArrowRight, CheckCircle2, ShieldCheck, Sparkles, TimerReset } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="min-h-screen">
      <header className="border-b border-white/10 bg-slate-950/55 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-300">
              TaskFlow
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button asChild size="sm" variant="ghost">
              <Link href="/login">Log in</Link>
            </Button>
            <Button asChild size="sm">
              <Link href="/signup">Get started</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto flex max-w-7xl flex-col gap-20 px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <section className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="space-y-8">
            <Badge className="w-fit" variant="outline">
              Modern SaaS task operations
            </Badge>
            <div className="space-y-6">
              <h1 className="max-w-3xl text-5xl font-semibold tracking-tight text-slate-50">
                Manage tasks, deadlines, and momentum from one secure dashboard.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-slate-400">
                TaskFlow pairs a focused UX with full-stack authentication, filtering, and
                task tracking so your daily workflow feels fast and intentional.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button asChild className="h-12 px-5">
                <Link href="/signup">
                  Launch your workspace
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild className="h-12 px-5" variant="outline">
                <Link href="/login">Sign in</Link>
              </Button>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <FeaturePill icon={CheckCircle2} text="Priority badges and status tracking" />
              <FeaturePill icon={TimerReset} text="Fast filtering and due-date visibility" />
              <FeaturePill icon={ShieldCheck} text="JWT auth with secure cookies" />
            </div>
          </div>

          <Card className="overflow-hidden border-white/10 bg-slate-950/75 shadow-[0_30px_90px_-46px_rgba(2,6,23,1)]">
            <CardHeader>
              <CardTitle>Dashboard preview</CardTitle>
              <CardDescription>
                A calm, high-signal workspace designed to keep projects moving.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                {
                  title: "Finalize onboarding checklist",
                  priority: "High",
                  status: "Pending",
                },
                {
                  title: "Review sprint handoff notes",
                  priority: "Medium",
                  status: "Completed",
                },
                {
                  title: "Schedule design QA session",
                  priority: "Low",
                  status: "Pending",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-4"
                >
                  <div>
                    <p className="font-medium text-slate-100">{item.title}</p>
                    <p className="text-sm text-slate-400">
                      {item.priority} priority
                    </p>
                  </div>
                  <Badge variant={item.status === "Completed" ? "success" : "outline"}>
                    {item.status}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-6 md:grid-cols-3">
          <FeatureCard
            description="Create, edit, search, filter, and complete tasks with instant feedback."
            icon={Sparkles}
            title="Polished task workflow"
          />
          <FeatureCard
            description="Every task is scoped to the signed-in user with server-side validation."
            icon={ShieldCheck}
            title="Secure full-stack auth"
          />
          <FeatureCard
            description="Responsive layout, subtle transitions, and thoughtful empty/loading states."
            icon={CheckCircle2}
            title="SaaS-quality UX"
          />
        </section>
      </main>
    </div>
  );
}

function FeaturePill({
  icon: Icon,
  text,
}: {
  icon: typeof CheckCircle2;
  text: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-sm text-slate-300">
      <Icon className="h-4 w-4 text-slate-200" />
      <span>{text}</span>
    </div>
  );
}

function FeatureCard({
  icon: Icon,
  title,
  description,
}: {
  icon: typeof CheckCircle2;
  title: string;
  description: string;
}) {
  return (
    <Card>
      <CardHeader>
        <div className="mb-2 flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-slate-900/70">
          <Icon className="h-5 w-5 text-slate-200" />
        </div>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
    </Card>
  );
}
