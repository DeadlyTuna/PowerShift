import type { ReactNode } from "react";

type LedgerProps = {
  rows: readonly { label: string; value: ReactNode }[];
  /** "label-first" for the masterclass details, "value-first" for the credentials. */
  order?: "label-first" | "value-first";
  className?: string;
};

export function Ledger({ rows, order = "label-first", className }: LedgerProps) {
  // The credentials read as one phrase ("Leadership & Agile coaching"), so the DOM keeps that order.
  if (order === "value-first") {
    return (
      <div className={className}>
        {rows.map((row) => (
          <p key={row.label} className="ledger-row">
            <span className="ledger-value">{row.value}</span>{" "}
            <span className="ledger-label">{row.label}</span>
          </p>
        ))}
      </div>
    );
  }

  return (
    <dl className={className}>
      {rows.map((row) => (
        <div key={row.label} className="ledger-row">
          <dt className="ledger-label">{row.label}</dt>
          <dd className="ledger-value">{row.value}</dd>
        </div>
      ))}
    </dl>
  );
}
