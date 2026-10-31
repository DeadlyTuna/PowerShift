import { cn } from "cn";
import Image from "next/image";
import { brand } from "@/lib/content";

/** The source webp has black corners, so it is always clipped to a circle. Never above 96px. */
export function Logo({
  size,
  eager = false,
  className,
}: {
  size: number;
  eager?: boolean;
  className?: string;
}) {
  return (
    <span className={cn("brand-logo", className)} style={{ width: size, height: size }}>
      <Image
        src={brand.symbol}
        alt=""
        width={size}
        height={size}
        loading={eager ? "eager" : "lazy"}
      />
    </span>
  );
}

export function Brand({ variant }: { variant: "masthead" | "footer" }) {
  if (variant === "footer") {
    return (
      <div className="brand">
        <Logo size={40} />
        <div>
          <span className="brand-name text-[22px]">{brand.name}</span>
          <span className="t-note block text-fg-soft">{brand.tagline}</span>
        </div>
      </div>
    );
  }

  return (
    <a href="#top" className="brand">
      <Logo size={36} eager className="size-8! lg:size-9!" />
      <span>
        <span className="brand-name text-[19px] lg:text-[22px]">{brand.name}</span>
        <span className="t-note hidden min-[1200px]:block">{brand.tagline}</span>
      </span>
    </a>
  );
}
