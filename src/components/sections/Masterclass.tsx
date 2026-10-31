import { EventStatus } from "@/components/countdown/EventStatus";
import { ReplyCard } from "@/components/registration/ReplyCard";
import { Eyebrow } from "@/components/shared/Eyebrow";
import { Frame, Grid } from "@/components/shared/Frame";
import { Ledger } from "@/components/shared/Ledger";
import { Reveal } from "@/components/shared/Reveal";
import { Stock } from "@/components/shared/Stock";
import { masterclass } from "@/lib/content";
import { eventDateTime, ledgerDateValue } from "@/lib/event";

const DATE_ROW = 1;

function detailRows() {
  const dateTime = eventDateTime();
  return masterclass.details.map((row, index) => {
    if (index !== DATE_ROW) return row;
    const value = ledgerDateValue();
    return {
      label: row.label,
      value: dateTime ? <time dateTime={dateTime}>{value}</time> : value,
    };
  });
}

export function Masterclass() {
  return (
    <Stock id="masterclass" stock="room" className="relative py-[var(--section)]">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-[clamp(8px,1.4vw,20px)] border border-gold-line/60"
      />
      <Frame className="relative z-[1]">
        <Grid className="gap-y-12 lg:items-start">
          <Reveal y={16} duration={700} className="lg:col-[1/span_6]">
            <Eyebrow>{masterclass.eyebrow}</Eyebrow>
            <h2 className="t-h2 mt-4">
              {masterclass.title} <em>{masterclass.titleAccent}</em>
            </h2>
            <p className="t-lead mt-6">{masterclass.lead}</p>
            <Ledger rows={detailRows()} className="mt-10" />
            <EventStatus variant="ledger" />
          </Reveal>

          <Reveal y={24} duration={700} className="lg:col-[8/span_5]">
            <ReplyCard />
          </Reveal>
        </Grid>
      </Frame>
    </Stock>
  );
}
