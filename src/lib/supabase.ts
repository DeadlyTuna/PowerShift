import "server-only";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/** Created by supabase/migrations/20261104120000_create_registrations.sql. */
export const REGISTRATIONS_TABLE = "registrations";

let client: SupabaseClient | undefined;

/**
 * The server's Supabase client, or null when it is not configured.
 * It uses the secret key, which bypasses row level security, so this module must never reach the browser.
 * The fallback names are the ones Vercel's Supabase integration sets. Empty values count as unset.
 */
export function getSupabase() {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;

  client ??= createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });
  return client;
}
