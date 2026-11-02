# The Power Shift

Landing page for the free live masterclass by Manisha Agrawal. Built with Next.js 16, Tailwind CSS 4, shadcn/ui (Radix), Motion (Framer Motion) and three.js.

## Run it

```bash
npm install
npm run dev
```

Open http://localhost:3000. For a production check, run `npm run build`, then `npm run start`.

## Before going live

| What | Where | Without it |
|---|---|---|
| Registration endpoint | `REGISTRATION_WEBHOOK_URL` environment variable | Visitors see an error and nothing is saved. In `npm run dev`, the form shows a "Preview: not saved" success instead. |
| Site address | `NEXT_PUBLIC_SITE_URL` environment variable | Link previews on WhatsApp and elsewhere point at localhost and show no image. |
| Date and time | `MASTERCLASS_STARTS_AT` in `src/lib/content.ts`, for example `"2026-12-05T19:00:00+05:30"` | The page says "Date announced soon", and the desktop pill runs a repeating 24-hour timer instead of a real countdown. |

The form sends a JSON POST to the webhook: `{ name, email, source, registeredAt }`. It treats any 2xx response as saved, and anything else as a failure the visitor can retry. It does not remove duplicates or limit how often it can be submitted, so the receiving service has to handle those.

## Changing things

- **Words:** all copy is in `src/lib/content.ts`.
- **Colours and type:** tokens and type classes are in `src/app/globals.css`. Each section sets its colours through `data-stock`.
- **Regenerating the hero crop and share image:** `node scripts/make-assets.mjs`.
- **Turning WebGL off:** set `NEXT_PUBLIC_HORIZON_WEBGL=0`. The sun then shows as a static SVG, as it already does for reduced-motion users and slower devices.
