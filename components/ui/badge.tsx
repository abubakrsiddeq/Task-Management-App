import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium capitalize transition",
  {
    variants: {
      variant: {
        default:
          "bg-zinc-100 text-zinc-700 dark:bg-zinc-900 dark:text-zinc-300",
        success: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300",
        warning: "bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300",
        danger: "bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300",
        outline:
          "border border-zinc-200 text-zinc-700 dark:border-zinc-700 dark:text-zinc-300",
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
