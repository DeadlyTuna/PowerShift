"use client";

import {
  m,
  useAnimationControls,
  useReducedMotion,
  type HTMLMotionProps,
} from "motion/react";
import { useEffect, useRef } from "react";
import { EASE_SETTLE } from "./easing";

type RevealTag =
  | "div"
  | "section"
  | "article"
  | "aside"
  | "figure"
  | "header"
  | "footer"
  | "p"
  | "span"
  | "ul"
  | "ol"
  | "li"
  | "dl"
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "blockquote";

type RevealProps = Omit<
  HTMLMotionProps<"div">,
  "animate" | "initial" | "exit" | "transition" | "variants"
> & {
  as?: RevealTag;
  mode?: "rise" | "fade";
  /** Travel in px. Ignored by mode="fade". */
  y?: number;
  /** In milliseconds. */
  duration?: number;
  /** In milliseconds. */
  delay?: number;
};

/**
 * Server HTML is always fully visible. After hydration, anything still below
 * the viewport is armed to its hidden pose and plays once on entering view, so
 * slow or failed JS never hides content.
 */
export function Reveal({
  as = "div",
  mode = "rise",
  y = 14,
  duration = 600,
  delay = 0,
  ...props
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const controls = useAnimationControls();
  const reduced = useReducedMotion();
  const Tag = m[as] as typeof m.div;

  useEffect(() => {
    const element = ref.current;
    if (!element || reduced) return;
    if (element.getBoundingClientRect().top < window.innerHeight) return;

    const rise = mode === "rise";
    controls.set(rise ? { opacity: 0, y } : { opacity: 0 });

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        observer.disconnect();
        controls.start(rise ? { opacity: 1, y: 0 } : { opacity: 1 }, {
          duration: duration / 1000,
          delay: delay / 1000,
          ease: EASE_SETTLE,
        });
      },
      { rootMargin: "0px 0px -12% 0px" },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [controls, reduced, mode, y, duration, delay]);

  return <Tag ref={ref} initial={false} animate={controls} {...props} />;
}
