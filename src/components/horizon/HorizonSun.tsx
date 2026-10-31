"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import type { HorizonTier } from "./scene";

const OFF_KEY = "ps-horizon-off";

type NetworkInformation = { saveData?: boolean; effectiveType?: string };
type NavigatorHints = Navigator & {
  connection?: NetworkInformation;
  deviceMemory?: number;
};

function offForSession() {
  try {
    return window.sessionStorage.getItem(OFF_KEY) !== null;
  } catch {
    return false;
  }
}

function markOffForSession() {
  try {
    window.sessionStorage.setItem(OFF_KEY, "1");
  } catch {
    // Without storage this only lasts until the next page load.
  }
}

/** The cheap half of the static tier. WebGL2 is probed separately, just before import. */
function deviceAllowsWebgl() {
  if (process.env.NEXT_PUBLIC_HORIZON_WEBGL === "0") return false;
  if (offForSession()) return false;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;

  const nav = navigator as NavigatorHints;
  const connection = nav.connection;
  if (connection?.saveData) return false;
  if (connection?.effectiveType && ["slow-2g", "2g", "3g"].includes(connection.effectiveType)) {
    return false;
  }
  if (nav.deviceMemory !== undefined && nav.deviceMemory <= 2) return false;
  if (nav.hardwareConcurrency < 4) return false;
  return true;
}

function hasWebgl2() {
  const context = document.createElement("canvas").getContext("webgl2");
  if (!context) return false;
  context.getExtension("WEBGL_lose_context")?.loseContext();
  return true;
}

function pickTier(): HorizonTier {
  const mobile =
    window.matchMedia("(pointer: coarse)").matches ||
    window.matchMedia("(max-width: 1023.98px)").matches;
  return mobile ? "mobile" : "desktop";
}

/**
 * The text-free slot between Power and Progress. Its bottom edge is the line
 * where Champagne begins, so that edge is the horizon. children is the static
 * SVG, which stays in the server HTML on every tier.
 */
export function HorizonSun({ children }: { children: ReactNode }) {
  const slotRef = useRef<HTMLDivElement>(null);
  const [live, setLive] = useState(false);

  useEffect(() => {
    const slot = slotRef.current;
    if (!slot || !deviceAllowsWebgl()) return;

    let cancelled = false;
    let dispose: (() => void) | undefined;
    let cancelIdle: (() => void) | undefined;

    const load = () => {
      if (cancelled || !hasWebgl2()) return;
      import("./scene")
        .then(({ mountHorizon }) => {
          if (cancelled) return;
          dispose = mountHorizon({
            slot,
            tier: pickTier(),
            onReady: () => setLive(true),
            onStop: () => {
              markOffForSession();
              setLive(false);
            },
          });
        })
        .catch(() => {
          // A failed chunk leaves the SVG in place, which is the whole fallback.
        });
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        observer.disconnect();
        if ("requestIdleCallback" in window) {
          const id = window.requestIdleCallback(load, { timeout: 2000 });
          cancelIdle = () => window.cancelIdleCallback(id);
        } else {
          const id = setTimeout(load, 200);
          cancelIdle = () => clearTimeout(id);
        }
      },
      { rootMargin: "150% 0px" },
    );
    observer.observe(slot);

    return () => {
      cancelled = true;
      observer.disconnect();
      cancelIdle?.();
      dispose?.();
    };
  }, []);

  return (
    <div
      data-stock="royal"
      id="shift"
      aria-hidden="true"
      ref={slotRef}
      className="relative h-[clamp(200px,34vh,280px)] overflow-hidden supports-[height:1svh]:h-[clamp(200px,34svh,280px)] lg:h-[clamp(320px,56vh,560px)] lg:supports-[height:1svh]:h-[clamp(320px,56svh,560px)]"
    >
      <div
        className="absolute inset-0 transition-opacity duration-[400ms] ease-out"
        style={{ opacity: live ? 0 : 1 }}
      >
        {children}
      </div>
    </div>
  );
}
