"use server";

import { z } from "zod";

import { registration } from "@/lib/content";

const registrationSchema = z.object({
  name: z.string().trim().min(1, registration.errorInvalidName).max(120, registration.errorInvalidName),
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

const WEBHOOK_TIMEOUT_MS = 8000;

/**
 * Reserves a seat by forwarding the name and email to REGISTRATION_WEBHOOK_URL.
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

  // Hidden field that only bots fill in. They get a normal-looking success and nothing is forwarded.
  if (String(formData.get("company") ?? "") !== "") {
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

  const webhookUrl = process.env.REGISTRATION_WEBHOOK_URL;

  if (!webhookUrl) {
    // Development can exercise the whole flow. Production must never tell someone
    // they have a seat when their details were not recorded anywhere.
    if (process.env.NODE_ENV !== "production") {
      console.warn("[register] REGISTRATION_WEBHOOK_URL is not set, so this registration was not saved.");
      return { status: "success", email: parsed.data.email, preview: true };
    }
    console.error("[register] REGISTRATION_WEBHOOK_URL is not set. Registrations are failing.");
    return { status: "error", values, message: registration.errorUnavailable };
  }

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: parsed.data.name,
        email: parsed.data.email,
        source: "the-power-shift-landing-page",
        registeredAt: new Date().toISOString(),
      }),
      signal: AbortSignal.timeout(WEBHOOK_TIMEOUT_MS),
    });

    if (!response.ok) {
      throw new Error(`Webhook responded with ${response.status}`);
    }

    return { status: "success", email: parsed.data.email };
  } catch (error) {
    console.error("[register] Could not forward registration:", error);
    return { status: "error", values, message: registration.errorUnavailable };
  }
}
