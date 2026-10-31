"use client";

import { m, useAnimationControls, useReducedMotion } from "motion/react";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { EASE_SETTLE } from "@/components/shared/easing";
import { about } from "@/lib/content";

/** The inner layer of the sticky photo. The transform stays here, never on the sticky element. */
export function AboutPhoto() {
  const ref = useRef<HTMLDivElement>(null);
  const controls = useAnimationControls();
  const reduced = useReducedMotion();

  useEffect(() => {
    const element = ref.current;
    if (!element || reduced) return;
    if (element.getBoundingClientRect().top < window.innerHeight) return;

    controls.set({ opacity: 0, scale: 1.035 });

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        observer.disconnect();
        controls.start(
          { opacity: 1, scale: 1 },
          {
            opacity: { duration: 0.7, ease: EASE_SETTLE },
            scale: { duration: 1.2, ease: EASE_SETTLE },
          },
        );
      },
      { rootMargin: "0px 0px -12% 0px" },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [controls, reduced]);

  return (
    <m.div ref={ref} initial={false} animate={controls} className="absolute inset-0">
      <Image
        src={about.image.src}
        alt={about.image.alt}
        fill
        sizes="(min-width: 1024px) 50vw, 100vw"
        className="object-cover object-[52%_8%] lg:object-[53%_18%]"
      />
    </m.div>
  );
}
