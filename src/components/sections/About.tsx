import { Eyebrow } from "@/components/shared/Eyebrow";
import { Frame, Grid } from "@/components/shared/Frame";
import { Ledger } from "@/components/shared/Ledger";
import { Reveal } from "@/components/shared/Reveal";
import { Stock } from "@/components/shared/Stock";
import { about } from "@/lib/content";
import { DrawnRule } from "./AboutDrawnRule";
import { AboutPhoto } from "./AboutPhoto";

const DROP_CAP =
  "supports-[initial-letter:3]:first-letter:mr-2 supports-[initial-letter:3]:first-letter:font-display supports-[initial-letter:3]:first-letter:text-t-royal supports-[initial-letter:3]:first-letter:[initial-letter:3]";

export function About() {
  return (
    <Stock id="about" stock="bone" className="py-[var(--section)]">
      <Frame>
        <Grid className="gap-y-8 lg:gap-y-10">
          <header className="lg:col-[7/span_6] lg:row-start-1">
            <Eyebrow>{about.eyebrow}</Eyebrow>
            <Reveal
              as="h2"
              y={18}
              duration={800}
              className="t-h2 mt-4 text-[length:clamp(2.25rem,1.1rem+3.4vw,4.5rem)]"
            >
              {about.title} <em className="block">{about.titleAccent}</em>
            </Reveal>
          </header>

          <figure className="relative -mx-[var(--gx)] lg:sticky lg:top-16 lg:col-[1/span_6] lg:row-[1/span_2] lg:mr-0 lg:-ml-[var(--edge)] lg:h-[calc(100vh-64px)] lg:h-[calc(100svh-64px)] lg:self-start">
            <div className="relative aspect-[4/5] overflow-hidden lg:aspect-auto lg:h-full">
              <AboutPhoto />
            </div>
            <blockquote className="mx-[var(--gx)] mt-8 border-y border-rule py-6 lg:absolute lg:right-0 lg:bottom-0 lg:m-0 lg:w-[clamp(300px,26vw,420px)] lg:border-0 lg:bg-bg lg:p-8">
              <p className="relative font-display text-[30px] leading-[1.2] italic">
                <span aria-hidden="true" className="absolute right-full text-t-goldink">
                  “
                </span>
                {about.quote}
              </p>
              <footer className="t-eyebrow mt-4">{about.quoteAuthor}</footer>
            </blockquote>
          </figure>

          <div className="lg:col-[8/span_5] lg:row-start-2">
            <p className={`t-body ${DROP_CAP}`}>{about.storyBefore}</p>
            <p className="t-body mt-6">{about.feedbackLead}</p>
            <Reveal
              as="blockquote"
              mode="fade"
              duration={600}
              className="t-standfirst mt-6 text-t-royal italic"
            >
              {about.feedbackQuote}
            </Reveal>
            {about.storyAfter.map((paragraph) => (
              <p key={paragraph} className="t-body mt-6">
                {paragraph}
              </p>
            ))}

            <div className="mt-12">
              {about.credentials.map((row) => (
                <div key={row.label}>
                  <DrawnRule />
                  <Ledger
                    rows={[row]}
                    order="value-first"
                    className="[&_.ledger-row]:border-t-0"
                  />
                </div>
              ))}
            </div>
          </div>
        </Grid>
      </Frame>
    </Stock>
  );
}
