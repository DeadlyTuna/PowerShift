import type { ReactNode } from "react";
import { Eyebrow } from "@/components/shared/Eyebrow";
import { Frame, Grid } from "@/components/shared/Frame";
import { Reveal } from "@/components/shared/Reveal";
import { Stock } from "@/components/shared/Stock";
import { outcomes } from "@/lib/content";
import { OutcomePlate } from "./OutcomesPlate";

const GOLD = "var(--gold-shape)";
const ROYAL = "#294894";

const plates: { line: string; shape: ReactNode }[] = [
  {
    line: "M0 220 C140 220 260 205 400 170",
    shape: (
      <>
        <circle cx="200" cy="120" r="44" fill={GOLD} />
        <path
          d="M60 238 C130 230 270 230 340 238"
          stroke={ROYAL}
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.42"
        />
        <path
          d="M100 252 C160 247 240 247 300 252"
          stroke={ROYAL}
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.42"
        />
      </>
    ),
  },
  {
    line: "M0 170 C140 135 260 130 400 110",
    shape: (
      <path
        d="M200 14 C210 38 234 60 242 88 C230 80 221 78 213 80 C222 102 212 122 188 135 C196 117 192 99 181 87 C175 81 167 80 158 88 C166 60 190 38 200 14 Z"
        fill={GOLD}
      />
    ),
  },
  {
    line: "M0 110 C140 90 270 80 400 50",
    shape: (
      <g transform="translate(0 16) scale(1.25)">
        <path d="M117 150a72 72 0 1 1 99-41" stroke={ROYAL} strokeWidth="4" />
        <g stroke={GOLD} strokeWidth="2.5">
          <path d="M107 116c30-6 54-25 68-56" />
          <path d="M118 136c46-5 80-29 99-71" />
          <path d="M155 148c44-9 77-33 99-73" />
        </g>
        <circle cx="104" cy="118" r="8" fill={GOLD} />
      </g>
    ),
  },
];

export function Outcomes() {
  return (
    <Stock stock="paper">
      <Frame className="pt-[var(--section)]">
        <Grid className="items-end">
          <div className="lg:col-span-7">
            <Eyebrow>{outcomes.eyebrow}</Eyebrow>
            <Reveal as="h2" y={12} duration={700} className="t-h2 mt-4">
              {outcomes.title} <em>{outcomes.titleAccent}</em>
            </Reveal>
          </div>
          <Reveal
            as="p"
            y={12}
            delay={80}
            className="t-body mt-2 text-fg-soft lg:col-span-4 lg:col-start-9 lg:mt-0"
          >
            {outcomes.lead}
          </Reveal>
        </Grid>

        <ul className="mt-14 grid grid-cols-1 gap-14 lg:mt-20 lg:grid-cols-3 lg:gap-0">
          {outcomes.items.map((item, index) => (
            <li key={item.title}>
              <OutcomePlate index={index} label={item.visualLabel} line={plates[index].line}>
                {plates[index].shape}
              </OutcomePlate>
              <div className="mt-8 lg:pr-[var(--gap)]">
                <Reveal as="h3" y={12} className="t-outcome">
                  {item.title}
                </Reveal>
                <Reveal as="p" y={12} delay={80} className="t-body mt-4 max-w-[34ch] text-fg-soft">
                  {item.copy}
                </Reveal>
              </div>
            </li>
          ))}
        </ul>

        <Grid className="py-24 lg:min-h-[70vh] lg:items-center lg:py-0 lg:supports-[height:1svh]:min-h-[70svh]">
          <Reveal as="p" y={18} duration={900} className="t-manifesto lg:col-span-11">
            {outcomes.manifesto} <em>{outcomes.manifestoAccent}</em>
          </Reveal>
        </Grid>
      </Frame>
    </Stock>
  );
}
