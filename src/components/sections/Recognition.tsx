import { Eyebrow } from "@/components/shared/Eyebrow";
import { Frame, Grid } from "@/components/shared/Frame";
import { ReserveLink } from "@/components/shared/ReserveLink";
import { Stock } from "@/components/shared/Stock";
import { recognition } from "@/lib/content";
import { RecognitionHairline, RecognitionReadingList } from "./RecognitionReadingList";

const leadSentences = recognition.lead.split(/(?<=\.)\s+/);

export function Recognition() {
  return (
    <Stock stock="bone" className="py-[var(--section)]">
      <Frame>
        <Grid className="gap-y-8 lg:gap-y-12">
          <div className="lg:col-[1/span_9]">
            <Eyebrow>{recognition.eyebrow}</Eyebrow>
            <h2 className="t-h2 mt-4">
              {recognition.title} <em className="block">{recognition.titleAccent}</em>
            </h2>
          </div>
          <p className="t-standfirst lg:col-[1/span_10]">
            {leadSentences.map((sentence) => (
              <span key={sentence} className="block text-balance">
                {sentence}{" "}
              </span>
            ))}
          </p>
        </Grid>

        <div className="mt-12 lg:mt-20">
          <RecognitionReadingList items={recognition.struggles} />
          <RecognitionHairline />
          <Grid className="gap-y-6 pt-[clamp(20px,2.4vw,36px)] lg:items-end">
            <p className="t-lead lg:col-[1/span_7]">{recognition.closing}</p>
            <ReserveLink
              label={recognition.cta}
              size="lg"
              inline
              full
              className="lg:col-[9/span_4]"
            />
          </Grid>
        </div>
      </Frame>
    </Stock>
  );
}
