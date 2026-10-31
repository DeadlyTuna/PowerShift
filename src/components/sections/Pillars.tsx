import { HorizonStatic } from "@/components/horizon/HorizonStatic";
import { HorizonSun } from "@/components/horizon/HorizonSun";
import { Eyebrow } from "@/components/shared/Eyebrow";
import { Frame, Grid } from "@/components/shared/Frame";
import { ReserveLink } from "@/components/shared/ReserveLink";
import { Reveal } from "@/components/shared/Reveal";
import { Stock, type StockName } from "@/components/shared/Stock";
import { pillars } from "@/lib/content";
import { PillarHairline, PillarRing, PillarWord } from "./PillarsMotion";

type PillarItem = (typeof pillars.items)[number];

const summarySentences = pillars.summary.match(/[^.]+\./g)?.map((line) => line.trim()) ?? [];

function PillarSpread({
  item,
  lit,
  stock,
  mirrored = false,
}: {
  item: PillarItem;
  lit: number;
  stock: StockName;
  mirrored?: boolean;
}) {
  return (
    <Stock as="article" stock={stock}>
      <Frame className="flex flex-col py-[72px] lg:min-h-screen lg:py-12 lg:supports-[height:1svh]:min-h-svh">
        <PillarHairline />
        <div
          className={`flex items-center gap-4 pt-6 lg:pt-8 ${mirrored ? "lg:flex-row-reverse" : ""}`}
        >
          <PillarRing lit={lit} />
          <Eyebrow>{item.label}</Eyebrow>
        </div>
        <h3 className={`t-word mt-6 -ml-[0.05em] lg:mt-8 ${mirrored ? "lg:ml-0 lg:text-right" : ""}`}>
          <PillarWord>{item.title}</PillarWord>
        </h3>
        <Grid className="mt-6 lg:mt-auto lg:pt-12">
          <Reveal
            as="h4"
            className={`t-standfirst text-accent italic lg:row-start-1 ${
              mirrored ? "lg:col-span-5 lg:col-start-8" : "lg:col-span-5 lg:col-start-1"
            }`}
          >
            {item.subtitle}
          </Reveal>
          <div
            className={`mt-4 lg:row-start-1 lg:mt-0 ${
              mirrored ? "lg:col-span-5 lg:col-start-2" : "lg:col-span-5 lg:col-start-7"
            }`}
          >
            <Reveal as="p" delay={80} className="t-body text-fg-soft">
              {item.copy}
            </Reveal>
            <span aria-hidden="true" className="my-8 block h-px w-10 bg-gold-line" />
            <Reveal as="blockquote" delay={160} className="t-standfirst">
              {item.takeaway}
            </Reveal>
          </div>
        </Grid>
      </Frame>
    </Stock>
  );
}

export function Pillars() {
  const [purpose, power, progress] = pillars.items;

  return (
    <section id="discover" aria-labelledby="discover-title">
      <Stock as="div" stock="midnight">
        <Frame className="pt-[var(--section)] pb-[72px] lg:pb-[var(--section)]">
          <Grid>
            <div className="lg:col-span-9">
              <Eyebrow>{pillars.eyebrow}</Eyebrow>
              <Reveal as="h2" id="discover-title" y={18} duration={800} className="t-h2 mt-4">
                {pillars.title} <em>{pillars.titleAccent}</em>
              </Reveal>
            </div>
            <Reveal
              as="p"
              delay={120}
              className="t-lead mt-4 text-fg-soft lg:col-span-5 lg:col-start-7 lg:mt-8"
            >
              {pillars.lead}
            </Reveal>
          </Grid>
        </Frame>
      </Stock>

      <PillarSpread item={purpose} lit={1} stock="midnight" />
      <PillarSpread item={power} lit={2} stock="royal" mirrored />
      <HorizonSun>
        <HorizonStatic />
      </HorizonSun>
      <PillarSpread item={progress} lit={3} stock="champagne" />

      <Stock as="div" stock="champagne">
        <Frame className="pb-[var(--section)] pt-[72px] lg:pt-[var(--section)]">
          <Grid className="items-end">
            <div className="font-display text-[clamp(1.75rem,1.2rem+2.2vw,3.25rem)] leading-[1.2] tracking-[-0.005em] lg:col-span-8">
              {summarySentences.map((sentence) => (
                <Reveal as="p" key={sentence}>
                  {sentence}
                </Reveal>
              ))}
            </div>
            <div className="mt-6 lg:col-span-4 lg:col-start-9 lg:mt-0">
              <p className="t-body text-fg-soft">{pillars.summaryDetail}</p>
              <ReserveLink label={pillars.cta} inline full className="mt-8" />
            </div>
          </Grid>
        </Frame>
      </Stock>
    </section>
  );
}
