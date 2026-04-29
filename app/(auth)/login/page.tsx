import Link from "next/link";

import { AuthForm } from "@/components/auth/auth-form";

export default function LoginPage() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 lg:flex-row lg:items-center lg:justify-between">
      <div className="max-w-xl space-y-6">
        <Link className="text-sm font-medium text-slate-300 hover:text-white" href="/">
          TaskFlow
        </Link>
        <div className="space-y-4">
          <p className="text-sm font-medium uppercase tracking-[0.28em] text-slate-400">
            Focused task operations
          </p>
          <h1 className="text-4xl font-semibold tracking-tight text-slate-50">
            Stay ahead of deadlines with a dashboard built for momentum.
          </h1>
          <p className="max-w-lg text-lg leading-8 text-slate-400">
            Plan, prioritize, and complete work across your day with a clean interface
            that feels like a polished SaaS product.
          </p>
        </div>
      </div>

      <AuthForm mode="login" />
    </div>
  );
}
