import { hero, masterclass, MASTERCLASS_STARTS_AT } from "@/lib/content";

const formatter = new Intl.DateTimeFormat("en-IN", {
  day: "numeric",
  month: "long",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
  timeZone: "Asia/Kolkata",
});

export function getEventStart(): Date | null {
  if (!MASTERCLASS_STARTS_AT) return null;
  const start = new Date(MASTERCLASS_STARTS_AT);
  return Number.isNaN(start.getTime()) ? null : start;
}

/** The value for a time element's dateTime attribute. */
export function eventDateTime(): string | null {
  return getEventStart()?.toISOString() ?? null;
}

/** For example "5 December 2026, 7:00 pm". Built from parts because ICU versions differ on the joiner. */
export function formatEventDate(): string | null {
  const start = getEventStart();
  if (!start) return null;
  const part = (type: Intl.DateTimeFormatPartTypes) =>
    formatter.formatToParts(start).find((p) => p.type === type)?.value ?? "";
  return `${part("day")} ${part("month")} ${part("year")}, ${part("hour")}:${part("minute")} ${part("dayPeriod").toLowerCase()}`;
}

export function heroDateLine(): string {
  const date = formatEventDate();
  if (!date) return hero.formatDetail;
  const [, free] = hero.formatDetail.split(" · ");
  return `${date} · ${free}`;
}

export function ledgerDateValue(): string {
  const date = formatEventDate();
  return date ? `${date} IST` : masterclass.details[1].value;
}

export function remainingParts(
  now: Date,
): { days: number; hours: number; minutes: number } | null {
  const start = getEventStart();
  if (!start || start.getTime() <= now.getTime()) return null;
  const totalMinutes = Math.floor((start.getTime() - now.getTime()) / 60000);
  return {
    days: Math.floor(totalMinutes / 1440),
    hours: Math.floor((totalMinutes % 1440) / 60),
    minutes: totalMinutes % 60,
  };
}
