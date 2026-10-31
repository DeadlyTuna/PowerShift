import { Eyebrow } from "@/components/shared/Eyebrow";
import { Frame, Grid } from "@/components/shared/Frame";
import { Reveal } from "@/components/shared/Reveal";
import { Stock } from "@/components/shared/Stock";
import { Separator } from "@/components/ui/separator";
import { fit } from "@/lib/content";
import { DrawnRule } from "./AboutDrawnRule";

function FitColumn({
  side,
  className,
}: {
  side: { eyebrow: string; title: string; paragraphs: readonly string[] };
  className: string;
}) {
  return (
    <Reveal mode="fade" duration={500} className={className}>
      <Eyebrow>{side.eyebrow}</Eyebrow>
      <h2 className="t-h2 mt-4 text-[length:clamp(2rem,1.2rem+2.6vw,3.5rem)]">{side.title}</h2>
      {side.paragraphs.map((paragraph) => (
        <p key={paragraph} className="t-body mt-6">
          {paragraph}
        </p>
      ))}
    </Reveal>
  );
}

export function Fit() {
  return (
    <Stock stock="bone" className="pb-[var(--section)]">
      <Frame>
        <Separator />
        <Grid className="gap-y-10 pt-[var(--section)] lg:gap-y-[var(--section)]">
          <FitColumn side={fit.yes} className="lg:col-[1/span_5] lg:row-start-1" />

          <div className="lg:hidden">
            <DrawnRule duration={900} />
          </div>
          <div className="hidden lg:col-start-7 lg:row-start-1 lg:ml-[calc(var(--gap)/-2)] lg:flex">
            <DrawnRule orientation="vertical" duration={900} />
          </div>

          <FitColumn side={fit.no} className="lg:col-[8/span_5] lg:row-start-1" />

          <Reveal
            as="p"
            y={18}
            duration={800}
            className="font-display text-[length:clamp(1.75rem,1.1rem+2.6vw,3.5rem)] leading-[1.15] text-balance text-t-royal italic lg:col-[2/span_10] lg:text-center"
          >
            {fit.no.closing}
          </Reveal>
        </Grid>
      </Frame>
    </Stock>
  );
}
