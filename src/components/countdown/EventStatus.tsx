"use client";

import { Timer } from "lucide-react";
import { useSyncExternalStore, type ReactNode } from "react";
import { countdown, hero } from "@/lib/content";
import {
  eventDateTime,
  formatEventDate,
  getEventStart,
  heroDateLine,
  remainingParts,
} from "@/lib/event";

const SECOND = 1000;
const MINUTE = 60000;
const LOOP_SECONDS = 24 * 60 * 60;

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

function subscribeToSeconds(onChange: () => void) {
  let timer: ReturnType<typeof setTimeout>;
  const arm = () => {
    timer = setTimeout(() => {
      onChange();
      arm();
    }, SECOND - (Date.now() % SECOND));
  };
  arm();
  return () => clearTimeout(timer);
}

function currentSecond() {
  return Math.floor(Date.now() / SECOND);
}

function pad(value: number) {
  return String(value).padStart(2, "0");
}

function PillShell({ label, children }: { label: string; children: ReactNode }) {
  return (
    <a href="#reserve" className="event-pill" aria-label={label}>
      <span className="event-pill-icon">
        <Timer aria-hidden="true" className="size-7" strokeWidth={1.7} />
      </span>
      <span>
        <span className="event-pill-label">{countdown.label}</span>
        {children}
      </span>
    </a>
  );
}

function PillUnits({ units }: { units: readonly { label: string; value: string }[] }) {
  return (
    <span className="event-pill-values">
      {units.map((unit) => (
        <span key={unit.label} className="event-pill-unit">
          <strong>{unit.value}</strong>
          <span>{unit.label}</span>
        </span>
      ))}
    </span>
  );
}

/** Runs until a date is set. Every visitor sees the same clock, and it restarts at 00:00 UTC. */
function LoopingPill() {
  const second = useSyncExternalStore(subscribeToSeconds, currentSecond, () => null);
  const left = second === null ? null : (LOOP_SECONDS - (second % LOOP_SECONDS)) % LOOP_SECONDS;
  const show = (value: number) => (left === null ? "--" : pad(value));

  return (
    <PillShell label={`${countdown.label} ${countdown.dateUnset}`}>
      <PillUnits
        units={[
          { label: countdown.units.hours, value: show(Math.floor((left ?? 0) / 3600)) },
          { label: countdown.units.minutes, value: show(Math.floor(((left ?? 0) % 3600) / 60)) },
          { label: countdown.units.seconds, value: show((left ?? 0) % 60) },
        ]}
      />
    </PillShell>
  );
}

function DateText({ children }: { children: ReactNode }) {
  return <time dateTime={eventDateTime() ?? undefined}>{children}</time>;
}

/** Live digits are a timer. Fixed date text is just text. */
function Status({ digits, label, className, children }: {
  digits: boolean;
  label: string;
  className?: string;
  children: ReactNode;
}) {
  return digits ? (
    <span role="timer" aria-live="off" aria-label={label} className={className}>
      {children}
    </span>
  ) : (
    <span className={className}>{children}</span>
  );
}

export function EventStatus({ variant }: { variant: "masthead" | "ledger" | "dock" | "pill" }) {
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
      <Status digits={Boolean(digits)} label={text} className="t-note block tabular-nums">
        {date && !digits ? <DateText>{text}</DateText> : text}
      </Status>
    );
  }

  if (started) return null;

  const text = digits ?? date ?? countdown.dateUnset;
  const value = date && !digits ? <DateText>{text}</DateText> : text;

  if (variant === "pill") {
    if (!date) return <LoopingPill />;
    return (
      <PillShell label={`${countdown.label} ${text}`}>
        {parts ? (
          <PillUnits
            units={[
              { label: countdown.units.days, value: pad(parts.days) },
              { label: countdown.units.hours, value: pad(parts.hours) },
              { label: countdown.units.minutes, value: pad(parts.minutes) },
            ]}
          />
        ) : (
          <span className="event-pill-date">{value}</span>
        )}
      </PillShell>
    );
  }

  if (variant === "ledger") {
    // With no date, the row above it already says the same thing.
    if (!date) return null;
    return (
      <dl>
        <div className="ledger-row">
          <dt className="ledger-label">{countdown.label}</dt>
          <dd className="ledger-value">
            <Status digits={Boolean(digits)} label={`${countdown.label} ${text}`}>
              {value}
            </Status>
          </dd>
        </div>
      </dl>
    );
  }

  return (
    <div className="min-w-[200px]">
      <span className="t-note block font-semibold">{countdown.label}</span>
      <Status
        digits={Boolean(digits)}
        label={`${countdown.label} ${text}`}
        className="t-note block tabular-nums"
      >
        {value}
      </Status>
    </div>
  );
}
