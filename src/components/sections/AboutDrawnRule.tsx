"use client";

import { m, useAnimationControls, useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";
import { EASE_DRAW } from "@/components/shared/easing";
import { Separator } from "@/components/ui/separator";

type DrawnRuleProps = {
  orientation?: "horizontal" | "vertical";
  /** In milliseconds. */
  duration?: number;
  className?: string;
};

/**
 * A hairline that draws once on entering view. Server HTML shows it finished.
 * Position is read from the parent, because a scaled-to-zero element has no box.
 */
export function DrawnRule({ orientation = "horizontal", duration = 700, className }: DrawnRuleProps) {
  const ref = useRef<HTMLDivElement>(null);
  const controls = useAnimationControls();
  const reduced = useReducedMotion();
  const vertical = orientation === "vertical";

  useEffect(() => {
    const anchor = ref.current?.parentElement;
    if (!anchor || reduced) return;
    if (anchor.getBoundingClientRect().top < window.innerHeight) return;

    controls.set(vertical ? { scaleY: 0 } : { scaleX: 0 });

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        observer.disconnect();
        controls.start(vertical ? { scaleY: 1 } : { scaleX: 1 }, {
          duration: duration / 1000,
          ease: EASE_DRAW,
        });
      },
      { rootMargin: "0px 0px -12% 0px" },
    );
    observer.observe(anchor);
    return () => observer.disconnect();
  }, [controls, reduced, vertical, duration]);

  return (
    <Separator asChild orientation={orientation} className={className}>
      <m.div
        ref={ref}
        initial={false}
        animate={controls}
        style={vertical ? { originY: 0 } : { originX: 0 }}
      />
    </Separator>
  );
}
