import { cn } from "cn";
import { Button } from "@/components/ui/button";
import { Arrow } from "./Arrow";

type ReserveLinkProps = {
  label: string;
  size?: "lg" | "md";
  full?: boolean;
  /** Marks this as an in-page CTA, which the masthead and dock observe. */
  inline?: boolean;
  /** "quiet" is the masthead's outline state while an inline CTA is on screen. */
  tone?: "solid" | "quiet";
  className?: string;
};

export function ReserveLink({
  label,
  size = "lg",
  full = false,
  inline = false,
  tone = "solid",
  className,
}: ReserveLinkProps) {
  return (
    <Button
      asChild
      variant={tone === "quiet" ? "reserve-quiet" : "reserve"}
      size={size}
      className={cn(
        size === "lg" && "whitespace-normal",
        full && "w-full justify-between text-left",
        className,
      )}
    >
      <a href="#reserve" data-inline-cta={inline ? "" : undefined}>
        <span>{label}</span>
        <Arrow />
      </a>
    </Button>
  );
}
