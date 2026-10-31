"use client";

import {
  m,
  useAnimationControls,
  useReducedMotion,
  type LegacyAnimationControls,
  type Transition,
} from "motion/react";
import { useEffect, useRef, type ReactNode, type RefObject } from "react";
import { EASE_DRAW, EASE_SETTLE } from "@/components/shared/easing";

type Pose = Record<string, string | number>;

const READ_LINE = "0px 0px -12% 0px";

/**
 * The Reveal pattern for motion Reveal cannot express. Server HTML stays
 * finished. Anything still below the viewport after mount is set to `hidden`
 * and plays `shown` once. Pass a target outside any clip box: a clipped element
 * never reports as intersecting. Poses and transition must be stable values.
 */
export function useArmOnce(
  target: RefObject<Element | null>,
  controls: LegacyAnimationControls,
  hidden: Pose,
  shown: Pose,
  transition: Transition,
) {
  const reduced = useReducedMotion();

  useEffect(() => {
    const element = target.current;
    if (!element || reduced) return;
    if (element.getBoundingClientRect().top < window.innerHeight) return;

    controls.set(hidden);
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        observer.disconnect();
        controls.start(shown, transition);
      },
      { rootMargin: READ_LINE },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [target, controls, hidden, shown, transition, reduced]);
}

const WORD_HIDDEN = { y: "105%" };
const WORD_SHOWN = { y: "0%" };
const WORD_TRANSITION = { duration: 0.9, ease: EASE_SETTLE };

/** Rises from the clipped baseline of its parent heading. */
export function PillarWord({ children }: { children: ReactNode }) {
  const clipRef = useRef<HTMLSpanElement>(null);
  const controls = useAnimationControls();
  useArmOnce(clipRef, controls, WORD_HIDDEN, WORD_SHOWN, WORD_TRANSITION);

  return (
    <span ref={clipRef} className="-mx-[0.06em] block overflow-hidden px-[0.06em] pb-[0.2em]">
      <m.span className="block" initial={false} animate={controls}>
        {children}
      </m.span>
    </span>
  );
}

const LINE_HIDDEN = { scaleX: 0 };
const LINE_SHOWN = { scaleX: 1 };
const LINE_TRANSITION = { duration: 0.8, ease: EASE_DRAW };

export function PillarHairline() {
  const ref = useRef<HTMLDivElement>(null);
  const controls = useAnimationControls();
  useArmOnce(ref, controls, LINE_HIDDEN, LINE_SHOWN, LINE_TRANSITION);

  return (
    <m.div
      ref={ref}
      aria-hidden="true"
      className="h-px origin-left bg-rule"
      initial={false}
      animate={controls}
    />
  );
}

const SIZE = 64;
const STROKE = 3;
const GAP = 12;
const ARCS = 3;

function arcPath(index: number) {
  const radius = SIZE / 2 - STROKE / 2;
  const centre = SIZE / 2;
  const sweep = 360 / ARCS;
  const toPoint = (degrees: number) => {
    const radians = (degrees * Math.PI) / 180;
    return `${(centre + radius * Math.sin(radians)).toFixed(2)} ${(centre - radius * Math.cos(radians)).toFixed(2)}`;
  };
  const start = index * sweep + GAP / 2;
  const end = (index + 1) * sweep - GAP / 2;
  return `M${toPoint(start)}A${radius} ${radius} 0 0 1 ${toPoint(end)}`;
}

const ARC_HIDDEN = { pathLength: 0, opacity: 0 };
const ARC_SHOWN = { pathLength: 1, opacity: 1 };
const ARC_TRANSITION = { duration: 0.6, ease: EASE_DRAW, opacity: { duration: 0.01 } };

/** Three arcs with `lit` of them on. The newest one draws once. */
export function PillarRing({ lit }: { lit: number }) {
  const ref = useRef<SVGSVGElement>(null);
  const controls = useAnimationControls();
  useArmOnce(ref, controls, ARC_HIDDEN, ARC_SHOWN, ARC_TRANSITION);

  return (
    <svg
      ref={ref}
      aria-hidden="true"
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      className="size-10 flex-none lg:size-16"
      fill="none"
      strokeWidth={STROKE}
    >
      {Array.from({ length: ARCS }, (_, index) => {
        const d = arcPath(index);
        if (index === lit - 1) {
          return (
            <g key={index}>
              <path d={d} stroke="var(--rule)" />
              <m.path d={d} stroke="var(--label)" initial={false} animate={controls} />
            </g>
          );
        }
        return <path key={index} d={d} stroke={index < lit ? "var(--label)" : "var(--rule)"} />;
      })}
    </svg>
  );
}
