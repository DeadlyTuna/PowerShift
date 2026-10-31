import { cn } from "cn";
import type { HTMLAttributes } from "react";

type EyebrowProps = HTMLAttributes<HTMLParagraphElement> & {
  dash?: boolean;
};

export function Eyebrow({ dash = false, className, children, ...props }: EyebrowProps) {
  return (
    <p className={cn("t-eyebrow", dash && "flex gap-3", className)} {...props}>
      {dash ? <span aria-hidden="true" className="eyebrow-dash" /> : null}
      {dash ? <span>{children}</span> : children}
    </p>
  );
}
