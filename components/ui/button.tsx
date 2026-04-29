"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-2xl text-sm font-semibold transition-all disabled:pointer-events-none disabled:opacity-50 outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/80 focus-visible:ring-offset-2 focus-visible:ring-offset-[#020617]",
  {
    variants: {
      variant: {
        default:
          "bg-slate-100 text-slate-950 shadow-[0_18px_36px_-22px_rgba(226,232,240,0.28)] hover:-translate-y-0.5 hover:bg-white",
        secondary:
          "border border-white/10 bg-slate-900/80 text-slate-200 hover:bg-slate-800 hover:text-white",
        outline:
          "border border-white/10 bg-slate-950/88 text-slate-200 shadow-[0_14px_32px_-24px_rgba(2,6,23,0.95)] backdrop-blur hover:-translate-y-0.5 hover:border-slate-500 hover:bg-slate-900 hover:text-white",
        ghost:
          "text-slate-300 hover:bg-slate-900/90 hover:text-white",
        destructive:
          "bg-[linear-gradient(135deg,#be123c_0%,#ef4444_100%)] text-white shadow-[0_18px_40px_-24px_rgba(239,68,68,0.75)] hover:-translate-y-0.5 hover:brightness-110",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-xl px-3.5",
        lg: "h-11 px-5",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
      className={cn(buttonVariants({ variant, size }), className)}
      ref={ref}
      {...props}
      />
    );
  },
);

Button.displayName = "Button";

export { Button, buttonVariants };
