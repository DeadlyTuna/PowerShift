"use client";

import { CircleAlert } from "lucide-react";
import { AnimatePresence, m, useReducedMotion } from "motion/react";
import {
  useActionState,
  useEffect,
  useRef,
  type ComponentProps,
  type ReactNode,
  type Ref,
} from "react";
import { register, type RegisterState } from "@/app/actions/register";
import { Arrow } from "@/components/shared/Arrow";
import { EASE_SETTLE } from "@/components/shared/easing";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { masterclass, registration } from "@/lib/content";
import { RegistrationSuccess } from "./RegistrationSuccess";

const INITIAL_STATE: RegisterState = { status: "idle" };

// A post made before hydration comes back at the card rather than the top of the page.
const PERMALINK = "/#reserve";

// The browser clears focus when it finishes a fragment navigation to an unfocusable
// target, so focusing the field inside the click handler would be undone.
const ARRIVAL_FOCUS_DELAY_MS = 150;

type RegistrationFormProps = {
  intro: ReactNode;
  note: ReactNode;
};

export function RegistrationForm({ intro, note }: RegistrationFormProps) {
  const [state, formAction, pending] = useActionState(register, INITIAL_STATE, PERMALINK);
  const reduced = useReducedMotion();
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;

    let timer: ReturnType<typeof setTimeout> | undefined;
    const focusName = () => nameRef.current?.focus({ preventScroll: true });
    const onClick = (event: MouseEvent) => {
      if (!(event.target instanceof Element)) return;
      if (!event.target.closest('a[href="#reserve"]')) return;
      clearTimeout(timer);
      timer = setTimeout(focusName, ARRIVAL_FOCUS_DELAY_MS);
    };

    if (window.location.hash === "#reserve") focusName();
    document.addEventListener("click", onClick);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("click", onClick);
    };
  }, []);

  useEffect(() => {
    if (state.status !== "error" || !state.fieldErrors) return;
    if (state.fieldErrors.name) nameRef.current?.focus();
    else if (state.fieldErrors.email) emailRef.current?.focus();
  }, [state]);

  const transition = { duration: reduced ? 0 : 0.4, ease: EASE_SETTLE };
  const failure = state.status === "error" ? state : null;

  return (
    <div className="grid grid-cols-[minmax(0,1fr)] *:[grid-area:1/1]">
      <AnimatePresence initial={false}>
        {state.status === "success" ? (
          <m.div
            key="success"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={transition}
          >
            <RegistrationSuccess email={state.email} preview={state.preview} />
          </m.div>
        ) : (
          <m.div
            key="form"
            initial={false}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, pointerEvents: "none" }}
            transition={transition}
          >
            {intro}
            <form
              action={formAction}
              noValidate
              className="relative mt-6"
              onSubmit={(event) => {
                if (pending) event.preventDefault();
              }}
            >
              <div className="flex flex-col gap-5">
                <Field
                  ref={nameRef}
                  id="reserve-name"
                  name="name"
                  label={registration.nameLabel}
                  error={failure?.fieldErrors?.name}
                  defaultValue={failure?.values.name}
                  autoComplete="name"
                  required
                />
                <Field
                  ref={emailRef}
                  id="reserve-email"
                  name="email"
                  label={registration.emailLabel}
                  error={failure?.fieldErrors?.email}
                  defaultValue={failure?.values.email}
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  enterKeyHint="go"
                  required
                />
              </div>

              {/* Only bots fill this in. */}
              <div aria-hidden="true" className="absolute -left-[9999px] size-px overflow-hidden">
                <input type="text" name="company" tabIndex={-1} autoComplete="off" />
              </div>

              {failure?.message ? (
                <div role="alert" className="t-note mt-6 flex gap-2 text-fg">
                  <CircleAlert aria-hidden="true" className="mt-px size-4 shrink-0" />
                  <p>{failure.message}</p>
                </div>
              ) : null}

              <Button
                type="submit"
                variant="reserve"
                size="lg"
                aria-busy={pending || undefined}
                aria-disabled={pending || undefined}
                className="relative mt-6 w-full justify-between overflow-hidden text-left whitespace-normal"
              >
                <span>{pending ? registration.pending : masterclass.card.cta}</span>
                <Arrow />
                {pending && !reduced ? (
                  <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-0.5 overflow-hidden">
                    <m.span
                      className="block h-full w-1/3 bg-gold-line"
                      initial={{ x: "-100%" }}
                      animate={{ x: "300%" }}
                      transition={{ duration: 1.2, ease: "linear", repeat: Infinity }}
                    />
                  </span>
                ) : null}
              </Button>
            </form>
            {note}
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
}

type FieldProps = ComponentProps<"input"> & {
  id: string;
  label: string;
  error?: string;
  ref: Ref<HTMLInputElement>;
};

function Field({ id, label, error, ...inputProps }: FieldProps) {
  const errorId = `${id}-error`;

  return (
    <div>
      <Label htmlFor={id} className="font-ui text-[15px] leading-[1.4] font-medium">
        {label}
      </Label>
      <Input
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className="mt-1 h-[52px] rounded-none border-0 border-b-[1.5px] border-b-t-soft bg-transparent px-0 font-ui text-[17px] font-medium focus-visible:ring-0 aria-invalid:border-b-[2.5px] aria-invalid:border-b-t-ink aria-invalid:ring-0 md:text-[17px]"
        {...inputProps}
      />
      {error ? (
        <p id={errorId} className="t-note mt-2 flex gap-2 text-fg">
          <CircleAlert aria-hidden="true" className="mt-px size-4 shrink-0" />
          <span>{error}</span>
        </p>
      ) : null}
    </div>
  );
}
