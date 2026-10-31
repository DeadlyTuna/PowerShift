import { cn } from "cn";
import type { ReactNode } from "react";

type LedgerProps = {
  rows: readonly { label: string; value: ReactNode }[];
  /** "label-first" for the masterclass details, "value-first" for the credentials. */
  order?: "label-first" | "value-first";
  className?: string;
};

export function Ledger({ rows, order = "label-first", className }: LedgerProps) {
  return (
    <dl className={className}>
      {rows.map((row) => (
        <div key={row.label} className="ledger-row">
          <dt className={cn("ledger-label", order === "value-first" && "order-last")}>
            {row.label}
          </dt>
          <dd className="ledger-value">{row.value}</dd>
        </div>
      ))}
    </dl>
  );
}
