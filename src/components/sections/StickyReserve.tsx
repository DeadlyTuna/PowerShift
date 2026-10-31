"use client";

import { useSyncExternalStore } from "react";
import { EventStatus } from "@/components/countdown/EventStatus";
import { Arrow } from "@/components/shared/Arrow";
import { Button } from "@/components/ui/button";
import { useInlineCtaVisible } from "@/hooks/use-inline-cta";
import { hero } from "@/lib/content";

function subscribeToReserved(onChange: () => void) {
  window.addEventListener("ps:reserved", onChange);
  document.addEventListener("ps:reserved", onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener("ps:reserved", onChange);
    document.removeEventListener("ps:reserved", onChange);
    window.removeEventListener("storage", onChange);
  };
}

function readReserved() {
  try {
    return window.localStorage.getItem("ps-reserved") !== null;
  } catch {
    return false;
  }
}

export function StickyReserve() {
  const inlineVisible = useInlineCtaVisible();
  const reserved = useSyncExternalStore(subscribeToReserved, readReserved, () => false);
  const shown = !inlineVisible && !reserved;

  return (
    <div
      data-chrome
      data-stock="paper"
      data-shown={shown}
      inert={!shown}
      className="dock lg:hidden"
    >
      <span aria-hidden="true" className="progress-hairline" />
      <Button
        asChild
        variant="reserve"
        size="lg"
        className="min-h-[58px] w-full justify-between gap-3 px-4 py-2 text-left whitespace-normal"
      >
        <a href="#reserve">
          <span className="min-w-0">
            <span className="block text-[17px] font-semibold">{hero.cta}</span>
            <EventStatus variant="dock" />
          </span>
          <Arrow />
        </a>
      </Button>
    </div>
  );
}
