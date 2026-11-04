import { createHash, timingSafeEqual } from "node:crypto";
import { connection } from "next/server";

import { getSupabase, REGISTRATIONS_TABLE } from "@/lib/supabase";

// Supabase returns at most 1,000 rows per request by default, so the export reads in pages
// until a page comes back empty. That still works if the project's limit is set lower.
const PAGE_SIZE = 1000;

// India has no daylight saving time, so a fixed offset is exact.
const IST_OFFSET_MS = 330 * 60_000;

// Excel only reads a downloaded CSV as UTF-8 when it starts with a byte order mark.
const BOM = "\uFEFF";

const NO_STORE = { "Cache-Control": "no-store" };

type Row = { name: string; email: string; created_at: string };

/**
 * Every registration as a CSV, oldest first, for Excel's Data > Get Data > From Web.
 * Sign in with Basic: any user name, and REGISTRATIONS_EXPORT_PASSWORD as the password.
 * While that variable is not set, this route answers 404.
 */
export async function GET(request: Request) {
  // Always run per request. Otherwise a build without the password set prerenders the 404 and serves it for good.
  await connection();

  const password = process.env.REGISTRATIONS_EXPORT_PASSWORD;
  if (!password) return new Response("Not found", { status: 404, headers: NO_STORE });

  if (!isAuthorized(request.headers.get("authorization"), password)) {
    return new Response("Sign in with the export password.", {
      status: 401,
      headers: { ...NO_STORE, "WWW-Authenticate": 'Basic realm="PowerShift registrations", charset="UTF-8"' },
    });
  }

  const supabase = getSupabase();
  if (!supabase) {
    console.error("[export] SUPABASE_URL or SUPABASE_SECRET_KEY is not set.");
    return new Response("Registrations are not connected yet.", { status: 503, headers: NO_STORE });
  }

  const rows: Row[] = [];
  for (;;) {
    const { data, error } = await supabase
      .from(REGISTRATIONS_TABLE)
      .select("name, email, created_at")
      .order("created_at")
      .order("id")
      .range(rows.length, rows.length + PAGE_SIZE - 1);

    if (error) {
      console.error("[export] Could not read registrations:", error);
      return new Response("Could not read registrations. Try again shortly.", { status: 502, headers: NO_STORE });
    }
    if (data.length === 0) break;
    rows.push(...data);
  }

  const lines = [
    ["Name", "Email", "Registered (IST)"],
    ...rows.map((row) => [row.name, row.email, toIst(row.created_at)]),
  ].map((cells) => cells.map(csvCell).join(","));

  return new Response(BOM + lines.join("\r\n") + "\r\n", {
    headers: {
      ...NO_STORE,
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="powershift-registrations.csv"',
      "X-Robots-Tag": "noindex",
    },
  });
}

function isAuthorized(header: string | null, password: string) {
  const match = header?.match(/^Basic\s+(\S+)$/i);
  if (!match) return false;

  const credentials = Buffer.from(match[1], "base64").toString("utf8");
  const colon = credentials.indexOf(":");
  if (colon === -1) return false;

  // Hashing gives both sides the same length, which timingSafeEqual requires.
  return timingSafeEqual(sha256(credentials.slice(colon + 1)), sha256(password));
}

function sha256(value: string) {
  return createHash("sha256").update(value).digest();
}

// Anyone can type a name into the form, and Excel runs a cell that starts with = + - or @ as a formula.
function csvCell(value: string) {
  const flat = value.replace(/[\p{Cc}\u2028\u2029]+/gu, " ");
  const safe = /^[=+\-@]/.test(flat) ? `'${flat}` : flat;
  return `"${safe.replaceAll('"', '""')}"`;
}

function toIst(timestamp: string) {
  return new Date(Date.parse(timestamp) + IST_OFFSET_MS).toISOString().slice(0, 19).replace("T", " ");
}
