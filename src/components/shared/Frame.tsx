import { cn } from "cn";
import type { HTMLAttributes } from "react";

export function Frame({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("frame", className)} {...props} />;
}

export function Grid({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("grid-12", className)} {...props} />;
}
