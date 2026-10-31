import { Eyebrow } from "@/components/shared/Eyebrow";
import { Frame, Grid } from "@/components/shared/Frame";
import { Reveal } from "@/components/shared/Reveal";
import { Stock } from "@/components/shared/Stock";
import { possibility } from "@/lib/content";

const PROSE_COLUMNS = ["lg:col-[3/span_4]", "lg:col-[7/span_4]"];

export function Possibility() {
  return (
    <Stock
      stock="midnight"
      className="bg-[linear-gradient(var(--ink),var(--midnight))] pt-[var(--section)] pb-24 lg:pb-[var(--section)]"
    >
      <Frame>
        <Grid className="gap-y-8 lg:gap-y-16">
          <div className="lg:col-[3/span_8] lg:text-center">
            <Eyebrow>{possibility.eyebrow}</Eyebrow>
            <Reveal as="h2" y={20} duration={800} className="t-h2 mt-4">
              {possibility.title} <em>{possibility.titleAccent}</em>
            </Reveal>
            <p className="t-lead mt-6 lg:mt-8">{possibility.lead}</p>
          </div>

          {possibility.prose.map((paragraph, index) => (
            <Reveal
              key={paragraph}
              as="p"
              y={14}
              duration={600}
              delay={120 + index * 80}
              className={`t-body text-fg-soft ${PROSE_COLUMNS[index]}`}
            >
              {paragraph}
            </Reveal>
          ))}
        </Grid>
      </Frame>
    </Stock>
  );
}
