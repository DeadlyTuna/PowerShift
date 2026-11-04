"use server";

import { z } from "zod";

import { registration } from "@/lib/content";
import { getSupabase, REGISTRATIONS_TABLE } from "@/lib/supabase";

const registrationSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, registration.errorInvalidName)
    .max(120, registration.errorInvalidName)
    // Line breaks and other control characters only arrive from scripted posts, and they would break the export.
    .refine((name) => !/[\p{Cc}\u2028\u2029]/u.test(name), registration.errorInvalidName),
  email: z
    .string()
    .trim()
    .pipe(z.email(registration.errorInvalidEmail).max(254, registration.errorInvalidEmail)),
});

export type RegisterState =
  | { status: "idle" }
  | { status: "success"; email: string; preview?: boolean }
  | {
      status: "error";
      values: { name: string; email: string };
      fieldErrors?: { name?: string; email?: string };
      message?: string;
    };

const SAVE_TIMEOUT_MS = 8000;

// Postgres unique_violation: this email already has a seat.
const ALREADY_REGISTERED = "23505";

/**
 * Reserves a seat by saving the name and email to the Supabase registrations table.
 * Works with JavaScript disabled, because it is the form's plain action.
 */
export async function register(
  _previous: RegisterState,
  formData: FormData,
): Promise<RegisterState> {
  const values = {
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
  };

  // Hidden field that only bots fill in. They get a normal-looking success and nothing is saved.
  // Its name must not look like an address field, or browser autofill would fill it for real visitors.
  if (String(formData.get("ps_extra") ?? "") !== "") {
    return { status: "success", email: values.email.trim() };
  }

  const parsed = registrationSchema.safeParse(values);
  if (!parsed.success) {
    const { fieldErrors } = z.flattenError(parsed.error);
    return {
      status: "error",
      values,
      fieldErrors: {
        name: fieldErrors.name?.[0],
        email: fieldErrors.email?.[0],
      },
    };
  }

  try {
    const supabase = getSupabase();

    if (!supabase) {
      // Development can exercise the whole flow. Production must never tell someone
      // they have a seat when their details were not recorded anywhere.
      if (process.env.NODE_ENV !== "production") {
        console.warn("[register] Supabase is not configured, so this registration was not saved.");
        return { status: "success", email: parsed.data.email, preview: true };
      }
      console.error("[register] SUPABASE_URL or SUPABASE_SECRET_KEY is not set. Registrations are failing.");
      return { status: "error", values, message: registration.errorUnavailable };
    }

    const { error } = await supabase
      .from(REGISTRATIONS_TABLE)
      .insert({ name: parsed.data.name, email: parsed.data.email })
      .abortSignal(AbortSignal.timeout(SAVE_TIMEOUT_MS));

    // A repeat is still a reserved seat. The first row is kept, so nobody can rename someone else's registration.
    if (error && error.code !== ALREADY_REGISTERED) {
      throw new Error(`Supabase insert failed: ${error.code} ${error.message}`);
    }

    return { status: "success", email: parsed.data.email };
  } catch (error) {
    console.error("[register] Could not save registration:", error);
    return { status: "error", values, message: registration.errorUnavailable };
  }
}
