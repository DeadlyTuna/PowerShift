"use client";

import { m, useAnimationControls, useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";
import { EASE_DRAW } from "@/components/shared/easing";
import { Grid } from "@/components/shared/Frame";
import { Separator } from "@/components/ui/separator";

/** A row hairline. Server HTML shows it whole; below the viewport it arms, then draws once. */
export function RecognitionHairline() {
  const ref = useRef<HTMLDivElement>(null);
  const controls = useAnimationControls();
  const reduced = useReducedMotion();

  useEffect(() => {
    const element = ref.current;
    if (!element || reduced) return;
    if (element.getBoundingClientRect().top < window.innerHeight) return;

    controls.set({ scaleX: 0 });
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        observer.disconnect();
        controls.start({ scaleX: 1 }, { duration: 0.7, ease: EASE_DRAW });
      },
      { rootMargin: "0px 0px -12% 0px" },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [controls, reduced]);

  return (
    <m.div ref={ref} initial={false} animate={controls} style={{ originX: 0 }}>
      <Separator />
    </m.div>
  );
}

function ReadingRow({ title, copy }: { title: string; copy: string }) {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const element = titleRef.current;
    if (!element || reduced) return;
    if (element.getBoundingClientRect().top < window.innerHeight) return;

    element.dataset.armed = "";
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        observer.disconnect();
        // A fast scroll can carry earlier titles past the band without touching it.
        for (const title of element.closest("ul")?.querySelectorAll("h3") ?? []) {
          delete title.dataset.armed;
          if (title === element) break;
        }
      },
      { rootMargin: "-30% 0px -30% 0px" },
    );
    observer.observe(element);
    return () => {
      observer.disconnect();
      delete element.dataset.armed;
    };
  }, [reduced]);

  return (
    <li>
      <RecognitionHairline />
      <Grid className="gap-y-2 py-[clamp(20px,2.4vw,36px)] lg:items-baseline">
        <h3
          ref={titleRef}
          className="t-h3 transition-[color,translate] duration-400 ease-out data-armed:text-t-unlit lg:col-[1/span_8] lg:hover:translate-x-3 motion-reduce:lg:hover:translate-x-0"
        >
          {title}
        </h3>
        <p className="t-body lg:col-[9/span_4]">{copy}</p>
      </Grid>
    </li>
  );
}

export function RecognitionReadingList({
  items,
}: {
  items: readonly { title: string; copy: string }[];
}) {
  return (
    <ul>
      {items.map((item) => (
        <ReadingRow key={item.title} title={item.title} copy={item.copy} />
      ))}
    </ul>
  );
}
