import { getImageProps } from "next/image";
import { Eyebrow } from "@/components/shared/Eyebrow";
import { Frame, Grid } from "@/components/shared/Frame";
import { ReserveLink } from "@/components/shared/ReserveLink";
import { Stock } from "@/components/shared/Stock";
import { Separator } from "@/components/ui/separator";
import { hero } from "@/lib/content";
import { eventDateTime, formatEventDate, heroDateLine } from "@/lib/event";

const HERO_CROP = { src: "/manisha-hero-crop.webp", width: 870, height: 580 };

function HeroPicture() {
  const shared = {
    alt: hero.image.alt,
    fetchPriority: "high",
    loading: "eager",
  } as const;
  const { props: crop } = getImageProps({
    ...shared,
    ...HERO_CROP,
    sizes: "100vw",
  });
  const { props: full } = getImageProps({
    ...shared,
    src: hero.image.src,
    width: hero.image.width,
    height: hero.image.height,
    sizes: "62vw",
  });

  return (
    <picture>
      <source
        media="(max-width: 1023px)"
        srcSet={crop.srcSet}
        sizes={crop.sizes}
        width={crop.width}
        height={crop.height}
      />
      {/* eslint-disable-next-line jsx-a11y/alt-text -- alt is in the spread */}
      <img
        {...full}
        className="block w-full object-cover object-[50%_10%] max-sm:h-[clamp(132px,27vh,320px)] max-sm:supports-[height:1svh]:h-[clamp(132px,27svh,320px)] sm:max-lg:h-[clamp(148px,42vh,460px)] sm:max-lg:object-[50%_0%] sm:max-lg:supports-[height:1svh]:h-[clamp(148px,42svh,460px)] lg:absolute lg:inset-0 lg:h-full lg:object-center"
      />
    </picture>
  );
}

function HeroDate() {
  const line = heroDateLine();
  const date = formatEventDate();
  const dateTime = eventDateTime();

  if (!date || !dateTime) return line;
  return (
    <>
      <time dateTime={dateTime}>{date}</time>
      {line.slice(date.length)}
    </>
  );
}

function Byline() {
  return (
    <div className="flex items-center gap-3">
      <span
        aria-hidden="true"
        className="t-note flex size-10 flex-none items-center justify-center rounded-full bg-gold-line font-semibold text-t-ink"
      >
        {hero.hostMonogram}
      </span>
      <p className="t-note">
        <span className="block font-semibold">
          {hero.hostPrefix} {hero.hostName}
        </span>
        <span className="block text-fg-soft">{hero.hostRole}</span>
      </p>
    </div>
  );
}

export function Hero() {
  return (
    <Stock stock="paper" className="pb-[var(--section)] lg:pt-[clamp(20px,2.4vw,48px)]">
      <Frame>
        <Grid className="gap-0 lg:gap-x-[var(--gap)]">
          <Eyebrow
            dash
            className="hero-dash max-lg:mt-4 lg:col-span-12 max-lg:[&>.eyebrow-dash]:hidden"
          >
            {hero.eyebrow}
          </Eyebrow>

          <h1 className="t-h1 mt-3.5 lg:col-span-12 lg:mt-4">
            <span className="hero-fade block">{hero.title}</span>{" "}
            <em className="hero-fade-late block">{hero.titleAccent}</em>
          </h1>

          <div className="mt-4 flex flex-col lg:col-[1/span_4] lg:row-start-3 lg:mt-7">
            <p className="t-body max-lg:order-last max-lg:mt-8">{hero.lead}</p>
            <ReserveLink
              label={hero.cta}
              size="lg"
              inline
              full
              className="lg:mt-5 lg:w-auto lg:self-start"
            />
            <div className="hero-fade-late mt-3">
              <p className="t-note font-semibold">{hero.format}</p>
              <p className="t-note text-fg-soft">
                <HeroDate />
              </p>
            </div>
            <div className="hero-fade-late mt-4">
              <Separator />
              <div className="mt-4">
                <Byline />
              </div>
            </div>
          </div>

          <figure className="hero-wipe relative bg-[#F1DBC2] max-lg:order-first max-lg:mx-[calc(var(--gx)*-1)] lg:col-[5/span_8] lg:row-start-3 lg:mt-7 lg:mr-[calc(var(--edge)*-1)] lg:before:block lg:before:pb-[75%]">
            <HeroPicture />
          </figure>

          <blockquote className="quote-card hero-block mt-8 lg:relative lg:z-[1] lg:col-[5/span_8] lg:row-start-3 lg:mt-0 lg:mb-10 lg:ml-8 lg:w-[clamp(280px,25vw,380px)] lg:self-end lg:justify-self-start">
            <span aria-hidden="true" className="quote-card-mark">
              “
            </span>
            <p>{hero.quote}</p>
          </blockquote>
        </Grid>
      </Frame>
    </Stock>
  );
}
