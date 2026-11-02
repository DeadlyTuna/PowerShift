"use client";

import { useEffect, useState } from "react";
import { EventStatus } from "@/components/countdown/EventStatus";

/** Desktop only, since phones have the dock. It steps aside at the form it links to. */
export function FloatingCountdown() {
  const [atForm, setAtForm] = useState(false);

  useEffect(() => {
    const form = document.getElementById("reserve");
    if (!form) return;
    const observer = new IntersectionObserver(([entry]) => setAtForm(entry.isIntersecting));
    observer.observe(form);
    return () => observer.disconnect();
  }, []);

  return (
    <div data-shown={!atForm} inert={atForm} className="event-pill-wrap">
      <EventStatus variant="pill" />
    </div>
  );
}
