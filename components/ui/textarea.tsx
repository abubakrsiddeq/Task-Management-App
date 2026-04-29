import * as React from "react";

import { cn } from "@/lib/utils";

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[120px] w-full rounded-2xl border border-white/10 bg-slate-950/70 px-3.5 py-3 text-sm text-slate-100 shadow-[0_16px_36px_-26px_rgba(2,6,23,0.95)] backdrop-blur transition placeholder:text-slate-500 focus-visible:border-cyan-400/35 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cyan-500/10",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);

Textarea.displayName = "Textarea";

export { Textarea };
