"use client";

import { useSyncExternalStore, type ReactNode } from "react";
import { countdown, hero } from "@/lib/content";
import {
  eventDateTime,
  formatEventDate,
  getEventStart,
  heroDateLine,
  remainingParts,
} from "@/lib/event";

const MINUTE = 60000;

function subscribeToMinutes(onChange: () => void) {
  const start = getEventStart();
  if (!start) return () => {};

  let timer: ReturnType<typeof setTimeout>;
  const arm = () => {
    timer = setTimeout(() => {
      onChange();
      if (Date.now() < start.getTime()) arm();
    }, MINUTE - (Date.now() % MINUTE));
  };
  const onVisibility = () => {
    if (!document.hidden) onChange();
  };

  arm();
  document.addEventListener("visibilitychange", onVisibility);
  return () => {
    clearTimeout(timer);
    document.removeEventListener("visibilitychange", onVisibility);
  };
}

function currentMinute() {
  return getEventStart() ? Math.floor(Date.now() / MINUTE) : null;
}

function pad(value: number) {
  return String(value).padStart(2, "0");
}

function DateText({ children }: { children: ReactNode }) {
  return <time dateTime={eventDateTime() ?? undefined}>{children}</time>;
}

const timerProps = (label: string) =>
  ({ role: "timer", "aria-live": "off", "aria-label": label }) as const;

export function EventStatus({ variant }: { variant: "masthead" | "ledger" | "dock" }) {
  // Null on the server and during hydration, so digits only ever render after mount.
  const minute = useSyncExternalStore(subscribeToMinutes, currentMinute, () => null);

  const date = formatEventDate();
  const parts = minute === null ? null : remainingParts(new Date(minute * MINUTE));
  const started = Boolean(date) && minute !== null && parts === null;

  const digits = parts
    ? `${pad(parts.days)} ${countdown.units.days} ${pad(parts.hours)} ${countdown.units.hours} ${pad(parts.minutes)} ${countdown.units.minutes}`
    : null;

  if (variant === "dock") {
    const text = digits ?? (date ? heroDateLine() : hero.formatDetail);
    return (
      <span className="t-note block tabular-nums" {...timerProps(text)}>
        {date && !digits ? <DateText>{text}</DateText> : text}
      </span>
    );
  }

  if (started) return null;

  const text = digits ?? date ?? countdown.dateUnset;
  const value = date && !digits ? <DateText>{text}</DateText> : text;

  if (variant === "ledger") {
    // With no date, the row above it already says the same thing.
    if (!date) return null;
    return (
      <dl>
        <div className="ledger-row">
          <dt className="ledger-label">{countdown.label}</dt>
          <dd className="ledger-value" {...timerProps(`${countdown.label} ${text}`)}>
            {value}
          </dd>
        </div>
      </dl>
    );
  }

  return (
    <div className="min-w-[200px]" {...timerProps(`${countdown.label} ${text}`)}>
      <span className="t-note block font-semibold">{countdown.label}</span>
      <span className="t-note block tabular-nums">{value}</span>
    </div>
  );
}
