import { Eyebrow } from "@/components/shared/Eyebrow";
import { Frame, Grid } from "@/components/shared/Frame";
import { Reveal } from "@/components/shared/Reveal";
import { Stock } from "@/components/shared/Stock";
import { Separator } from "@/components/ui/separator";
import { cost } from "@/lib/content";

export function HiddenCost() {
  return (
    <Stock stock="ink" className="py-24 lg:pt-[clamp(96px,16vw,224px)] lg:pb-[clamp(72px,7vw,112px)]">
      <Frame>
        <Grid className="gap-y-10 lg:gap-y-20">
          <div className="lg:col-[1/span_10]">
            <Eyebrow>{cost.eyebrow}</Eyebrow>
            <Reveal as="h2" mode="fade" duration={900} className="t-h2 mt-4">
              {cost.title} <em>{cost.titleAccent}</em>
            </Reveal>
          </div>

          <p className="t-lead lg:col-[1/span_4]">{cost.lead}</p>

          <ul className="lg:col-[6/span_7]">
            {cost.items.map((item, index) => (
              <Reveal key={item.title} as="li" mode="fade" duration={600} delay={index * 120}>
                <Separator />
                <div className="grid grid-cols-1 gap-x-[var(--gap)] gap-y-2 py-6 lg:grid-cols-7 lg:items-baseline lg:py-9">
                  <h3 className="t-standfirst lg:col-span-3">{item.title}</h3>
                  <p className="t-body text-fg-soft lg:col-span-4">{item.copy}</p>
                </div>
              </Reveal>
            ))}
          </ul>
        </Grid>
      </Frame>
    </Stock>
  );
}
