"use client";

import { m } from "motion/react";
import { useEffect, useRef } from "react";
import { Logo } from "@/components/shared/Brand";
import { EASE_SETTLE } from "@/components/shared/easing";
import { masterclass, registration } from "@/lib/content";
import { eventDateTime, heroDateLine } from "@/lib/event";
import { CARD_TITLE } from "./styles";

type RegistrationSuccessProps = {
  email: string;
  preview?: boolean;
};

export function RegistrationSuccess({ email, preview }: RegistrationSuccessProps) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const dateTime = eventDateTime();

  useEffect(() => {
    headingRef.current?.focus();
    try {
      window.localStorage.setItem("ps-reserved", "1");
    } catch {
      // Storage can be blocked. The event below still hides the dock for this visit.
    }
    window.dispatchEvent(new Event("ps:reserved"));
  }, []);

  return (
    <div>
      <m.span
        className="block w-fit"
        initial={{ scale: 1.06 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.42, ease: EASE_SETTLE }}
      >
        <Logo size={56} eager />
      </m.span>

      <h3 ref={headingRef} tabIndex={-1} className={`${CARD_TITLE} mt-6`}>
        {registration.successTitle}
      </h3>
      <p className="mt-4 font-ui text-[17px] leading-[1.4] font-semibold [overflow-wrap:anywhere]">
        {email}
      </p>
      <p className="t-body mt-4 text-fg-soft">{registration.successCopy}</p>
      <p className="t-body mt-4 text-fg-soft">{masterclass.lead}</p>
      <p className="t-note mt-6">
        {dateTime ? <time dateTime={dateTime}>{heroDateLine()}</time> : heroDateLine()}
      </p>
      {preview ? <p className="t-note mt-2 text-fg-soft">{registration.previewBadge}</p> : null}
    </div>
  );
}
