import { Plus } from "lucide-react";
import { Eyebrow } from "@/components/shared/Eyebrow";
import { Frame, Grid } from "@/components/shared/Frame";
import { Stock } from "@/components/shared/Stock";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { faq } from "@/lib/content";

// By source index, so the wording stays untouched in content.ts.
const ORDER = [8, 6, 1, 7, 9, 2, 3, 5, 4, 0];
const OPEN_BY_DEFAULT = ORDER.slice(0, 2).map(String);

// forceMount keeps every answer in the HTML, so closed ones are hidden here instead of by Radix.
// It also means Radix never publishes a height while opening, so the open animation runs to
// height auto, which needs interpolate-size. Browsers without it open instantly.
const ROOT =
  "border-t [interpolate-size:allow-keywords] [&_[data-slot=accordion-content]]:[animation-duration:240ms] [&_[data-slot=accordion-content][data-state=closed]]:hidden motion-reduce:[&_[data-slot=accordion-content]]:[animation-name:none]";

const TRIGGER =
  "min-h-14 gap-6 rounded-none py-4 font-text text-[length:clamp(1.375rem,1.25rem+0.6vw,1.625rem)] leading-[1.3] font-normal **:data-[slot=accordion-trigger-icon]:hidden!";

// Without JavaScript the triggers cannot open anything, so every answer shows.
const NO_SCRIPT_CSS = `#faq [data-slot="accordion-content"]{display:block;animation:none}`;

export function Faq() {
  return (
    <Stock id="faq" stock="paper" className="py-[var(--section)]">
      <noscript>
        <style>{NO_SCRIPT_CSS}</style>
      </noscript>
      <Frame>
        <Grid className="gap-y-10">
          <div className="lg:sticky lg:top-24 lg:col-[1/span_4] lg:self-start">
            <Eyebrow>{faq.eyebrow}</Eyebrow>
            <h2 className="t-h2 mt-4">{faq.title}</h2>
            <p className="t-body mt-6 text-fg-soft">{faq.lead}</p>
          </div>

          <Accordion
            type="multiple"
            defaultValue={OPEN_BY_DEFAULT}
            className={`${ROOT} lg:col-[6/span_7]`}
          >
            {ORDER.map((index) => {
              const item = faq.items[index];
              return (
                <AccordionItem key={index} value={String(index)} className="border-b">
                  <AccordionTrigger className={TRIGGER}>
                    {item.question}
                    <Plus
                      aria-hidden="true"
                      strokeWidth={1.25}
                      className="mt-1 ml-auto size-6 shrink-0 text-t-goldink transition-transform duration-200 ease-out group-aria-expanded/accordion-trigger:rotate-45 motion-reduce:transition-none"
                    />
                  </AccordionTrigger>
                  <AccordionContent forceMount className="t-body h-auto pb-6 text-fg-soft">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </Grid>
      </Frame>
    </Stock>
  );
}
