import { Eyebrow } from "@/components/shared/Eyebrow";
import { Frame, Grid } from "@/components/shared/Frame";
import { ReserveLink } from "@/components/shared/ReserveLink";
import { Reveal } from "@/components/shared/Reveal";
import { Stock } from "@/components/shared/Stock";
import { finalCta } from "@/lib/content";
import { sunburstRays } from "@/lib/sunburst";
import { FinalCtaRise } from "./FinalCtaRise";

const R = 230;
const STROKE = 1.25;
const LEFT = "#294894";
const RIGHT = "#7A5A12";

const rays = sunburstRays({ r: R, inner: 1.18, outer: 1.8 }).filter(
  (ray) => Math.abs(ray.angle) < Math.PI / 2,
);
const ringRadius = 243.8;

function EngravedSun() {
  return (
    <svg
      viewBox="-600 -420 1200 420"
      focusable="false"
      className="relative left-1/2 block h-auto w-[170vw] max-w-none -translate-x-1/2 lg:w-[min(100vw,1200px)]"
      fill="none"
      strokeWidth={STROKE}
    >
      {rays.map((ray) => (
        <line key={ray.index} {...ray.line} stroke={ray.angle < 0 ? LEFT : RIGHT} />
      ))}
      <path d={`M0 ${-ringRadius}A${ringRadius} ${ringRadius} 0 0 0 ${-ringRadius} 0`} stroke={LEFT} />
      <path d={`M0 ${-ringRadius}A${ringRadius} ${ringRadius} 0 0 1 ${ringRadius} 0`} stroke={RIGHT} />
    </svg>
  );
}

export function FinalCta() {
  return (
    <Stock stock="champagne" className="overflow-x-clip">
      <Frame className="pt-[var(--section)]">
        <Grid>
          <div className="flex flex-col items-center text-center lg:col-span-10 lg:col-start-2">
            <Eyebrow>{finalCta.eyebrow}</Eyebrow>
            <Reveal as="h2" y={18} duration={800} className="t-h2 mt-4">
              {finalCta.title} <em>{finalCta.titleAccent}</em>
            </Reveal>
            <p className="t-body mt-6 text-fg-soft">{finalCta.lead}</p>
            <Reveal mode="fade" duration={500} className="mt-8 w-full lg:w-auto">
              <ReserveLink label={finalCta.cta} inline full className="lg:w-auto" />
            </Reveal>
          </div>
        </Grid>
      </Frame>
      <div className="mt-10 lg:mt-14">
        <FinalCtaRise>
          <EngravedSun />
        </FinalCtaRise>
      </div>
    </Stock>
  );
}
