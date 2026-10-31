import type { HTMLAttributes } from "react";

export type StockName =
  | "paper"
  | "bone"
  | "champagne"
  | "ink"
  | "midnight"
  | "royal"
  | "room";

type StockProps = HTMLAttributes<HTMLElement> & {
  as?: "section" | "div" | "article" | "aside" | "footer";
  stock: StockName;
};

/** A printed stock. Never add transform or opacity to it. */
export function Stock({ as: Tag = "section", stock, ...props }: StockProps) {
  return <Tag data-stock={stock} {...props} />;
}
