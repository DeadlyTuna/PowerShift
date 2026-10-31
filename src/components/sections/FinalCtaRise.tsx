"use client";

import { m, useAnimationControls } from "motion/react";
import { useRef, type ReactNode } from "react";
import { EASE_SETTLE } from "@/components/shared/easing";
import { useArmOnce } from "./PillarsMotion";

const HIDDEN = { y: "12%", opacity: 0 };
const SHOWN = { y: "0%", opacity: 1 };
const TRANSITION = { duration: 1.4, ease: EASE_SETTLE };

/** The engraved sun's one movement. The outer box clips it at the section's bottom edge. */
export function FinalCtaRise({ children }: { children: ReactNode }) {
  const clipRef = useRef<HTMLDivElement>(null);
  const controls = useAnimationControls();
  useArmOnce(clipRef, controls, HIDDEN, SHOWN, TRANSITION);

  return (
    <div ref={clipRef} aria-hidden="true" className="overflow-clip">
      <m.div initial={false} animate={controls}>
        {children}
      </m.div>
    </div>
  );
}
