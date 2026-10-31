"use client";

import { m, useAnimationControls, useReducedMotion } from "motion/react";
import { useEffect, useRef, type ReactNode } from "react";
import { EASE_DRAW, EASE_SETTLE } from "@/components/shared/easing";

const DESKTOP_SEGMENT_S = 1.6 / 3;
const PHONE_SEGMENT_S = 0.9;
const LINE_STROKE = "#294894";

type OutcomePlateProps = {
  /** Position in the frieze, which sets when this plate's stretch of line draws. */
  index: number;
  label: string;
  line: string;
  /** The gold shape. It fades and rises as the line reaches the middle of the plate. */
  children: ReactNode;
};

export function OutcomePlate({ index, label, line, children }: OutcomePlateProps) {
  const ref = useRef<SVGSVGElement>(null);
  const lineControls = useAnimationControls();
  const shapeControls = useAnimationControls();
  const reduced = useReducedMotion();

  useEffect(() => {
    const element = ref.current;
    if (!element || reduced) return;
    if (element.getBoundingClientRect().top < window.innerHeight) return;

    lineControls.set({ pathLength: 0, opacity: 0 });
    shapeControls.set({ opacity: 0, y: 12 });

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        observer.disconnect();

        // Side by side, the plates enter together, so delays make one line.
        // Stacked, each plate draws in full as it arrives.
        const inRow = window.matchMedia("(min-width: 1024px)").matches;
        const duration = inRow ? DESKTOP_SEGMENT_S : PHONE_SEGMENT_S;
        const delay = inRow ? index * DESKTOP_SEGMENT_S : 0;

        lineControls.start(
          { pathLength: 1, opacity: 1 },
          { duration, delay, ease: EASE_DRAW, opacity: { duration: 0.01, delay } },
        );
        shapeControls.start(
          { opacity: 1, y: 0 },
          { duration: 0.6, delay: delay + duration / 2, ease: EASE_SETTLE },
        );
      },
      { rootMargin: "0px 0px -12% 0px" },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [index, lineControls, shapeControls, reduced]);

  return (
    <svg
      ref={ref}
      role="img"
      aria-label={label}
      viewBox="0 0 400 260"
      className="block h-auto w-full"
      fill="none"
    >
      <m.g initial={false} animate={shapeControls}>
        {children}
      </m.g>
      <m.path
        d={line}
        stroke={LINE_STROKE}
        strokeWidth="2"
        strokeLinecap="round"
        initial={false}
        animate={lineControls}
      />
    </svg>
  );
}
