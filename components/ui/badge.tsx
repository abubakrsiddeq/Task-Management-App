import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium capitalize transition",
  {
    variants: {
      variant: {
        default:
          "border border-white/10 bg-slate-900/70 text-slate-200",
        success: "border border-emerald-500/20 bg-emerald-500/12 text-emerald-200",
        warning: "border border-amber-500/20 bg-amber-500/12 text-amber-200",
        danger: "border border-rose-500/20 bg-rose-500/12 text-rose-200",
        outline:
          "border border-white/12 text-slate-300",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

type BadgeProps = React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof badgeVariants>;

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}
