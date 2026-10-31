import { Brand } from "@/components/shared/Brand";
import { Frame } from "@/components/shared/Frame";
import { Stock } from "@/components/shared/Stock";
import { brand } from "@/lib/content";

export function Footer() {
  return (
    <Stock as="footer" stock="champagne" data-inline-cta="" className="footer">
      <Frame className="flex flex-col items-start gap-4 lg:flex-row lg:items-center lg:justify-between">
        <Brand variant="footer" />
        <p className="t-note lg:text-right">{brand.footerLine}</p>
      </Frame>
    </Stock>
  );
}
