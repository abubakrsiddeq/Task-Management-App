"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  loginSchema,
  signupSchema,
  type LoginInput,
  type SignupInput,
} from "@/lib/validations/auth";

type AuthFormProps = {
  mode: "login" | "signup";
};

export function AuthForm({ mode }: AuthFormProps) {
  if (mode === "signup") {
    return <SignupForm />;
  }

  return <LoginForm />;
}

function LoginForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: LoginInput) {
    try {
      setIsSubmitting(true);

      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error ?? "Authentication failed.");
      }

      toast.success("Welcome back.");
      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Authentication failed.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card className="w-full max-w-md border-zinc-200/80 bg-white/95 shadow-xl shadow-zinc-950/5 backdrop-blur dark:border-zinc-800/80 dark:bg-zinc-950/90">
      <CardHeader className="space-y-3">
        <CardTitle>Welcome back</CardTitle>
        <CardDescription>
          Sign in to manage your tasks with a focused, modern workspace.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="name@company.com" {...form.register("email")} />
            <p className="text-xs text-red-500">{form.formState.errors.email?.message}</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" placeholder="At least 8 characters" {...form.register("password")} />
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Minimum 8 characters for a smoother, more secure sign-in.
            </p>
            <p className="text-xs text-red-500">{form.formState.errors.password?.message}</p>
          </div>

          <Button className="w-full" disabled={isSubmitting} type="submit">
            {isSubmitting ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}
            Sign in
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-zinc-500 dark:text-zinc-400">
          Need an account?{" "}
          <Link className="font-medium text-zinc-950 hover:underline dark:text-zinc-50" href="/signup">
            Create one
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}

function SignupForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: SignupInput) {
    try {
      setIsSubmitting(true);

      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error ?? "Authentication failed.");
      }

      toast.success("Account created successfully.");
      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Authentication failed.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card className="w-full max-w-md border-zinc-200/80 bg-white/95 shadow-xl shadow-zinc-950/5 backdrop-blur dark:border-zinc-800/80 dark:bg-zinc-950/90">
      <CardHeader className="space-y-3">
        <CardTitle>Create your account</CardTitle>
        <CardDescription>
          Start organizing projects, deadlines, and priorities in one place.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-2">
            <Label htmlFor="name">Full name</Label>
            <Input id="name" placeholder="Ava Johnson" {...form.register("name")} />
            <p className="text-xs text-red-500">{form.formState.errors.name?.message}</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="name@company.com" {...form.register("email")} />
            <p className="text-xs text-red-500">{form.formState.errors.email?.message}</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" placeholder="At least 8 characters" {...form.register("password")} />
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Minimum 8 characters for a smoother, more secure sign-in.
            </p>
            <p className="text-xs text-red-500">{form.formState.errors.password?.message}</p>
          </div>

          <Button className="w-full" disabled={isSubmitting} type="submit">
            {isSubmitting ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}
            Create account
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-zinc-500 dark:text-zinc-400">
          Already have an account?{" "}
          <Link className="font-medium text-zinc-950 hover:underline dark:text-zinc-50" href="/login">
            Sign in
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
