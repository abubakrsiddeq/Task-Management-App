import Link from "next/link";

import { AuthForm } from "@/components/auth/auth-form";

export default function SignupPage() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 lg:flex-row lg:items-center lg:justify-between">
      <div className="max-w-xl space-y-6">
        <Link className="text-sm font-medium text-zinc-600 dark:text-zinc-300" href="/">
          TaskFlow
        </Link>
        <div className="space-y-4">
          <p className="text-sm font-medium uppercase tracking-[0.28em] text-emerald-500">
            Built for modern teams
          </p>
          <h1 className="text-4xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
            Create a streamlined workspace for priorities, due dates, and progress.
          </h1>
          <p className="max-w-lg text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            Start with a secure account, then organize every task in one responsive
            dashboard.
          </p>
        </div>
      </div>

      <AuthForm mode="signup" />
    </div>
  );
}
