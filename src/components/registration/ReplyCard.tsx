import { Eyebrow } from "@/components/shared/Eyebrow";
import { Stock } from "@/components/shared/Stock";
import { masterclass } from "@/lib/content";
import { RegistrationForm } from "./RegistrationForm";
import { CARD_TITLE } from "./styles";

const { card } = masterclass;

/** The root stays one DOM element across every state, because the masthead and dock observe it. */
export function ReplyCard() {
  return (
    <Stock
      as="div"
      stock="paper"
      id="reserve"
      data-inline-cta=""
      className="relative rounded-[14px] px-6 py-8 shadow-[12px_12px_0_rgb(212_175_55/.14)] lg:p-11 lg:shadow-[18px_18px_0_rgb(212_175_55/.14)]"
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-2 rounded-[8px] border border-t-goldink/50 lg:inset-2.5"
      />
      <RegistrationForm
        intro={
          <>
            <Eyebrow>{card.kicker}</Eyebrow>
            <h3 className={`${CARD_TITLE} mt-3`}>{card.title}</h3>
            <p className="t-body mt-4 text-fg-soft">{card.copy}</p>
          </>
        }
        note={<p className="t-note mt-4 text-fg-soft">{card.note}</p>}
      />
    </Stock>
  );
}
