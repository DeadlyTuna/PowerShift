"use client";

import { useSyncExternalStore } from "react";

const listeners = new Set<() => void>();
const intersecting = new Set<Element>();
let observer: IntersectionObserver | null = null;
let visible = true;

function publish(next: boolean) {
  if (next === visible) return;
  visible = next;
  listeners.forEach((listener) => listener());
}

function start() {
  const targets = document.querySelectorAll("[data-inline-cta]");
  if (targets.length === 0) {
    publish(false);
    return;
  }
  observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) intersecting.add(entry.target);
      else intersecting.delete(entry.target);
    }
    publish(intersecting.size > 0);
  });
  targets.forEach((target) => observer?.observe(target));
}

function stop() {
  observer?.disconnect();
  observer = null;
  intersecting.clear();
  visible = true;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  if (listeners.size === 1) start();
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) stop();
  };
}

/** True while any [data-inline-cta] is on screen. True on the server, so the dock starts hidden. */
export function useInlineCtaVisible(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => visible,
    () => true,
  );
}
