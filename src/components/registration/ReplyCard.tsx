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
      className="relative px-6 py-8 lg:p-11"
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-2 border border-t-goldink lg:inset-2.5"
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
