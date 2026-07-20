"use client";

import Link from "next/link";
import { useActionState } from "react";
import { registerAction, googleAction, type AuthState } from "@/app/actions/auth";
import {
  AuthCard,
  GoogleButton,
  fieldClass,
  labelClass,
} from "@/components/AuthCard";

export default function RegisterPage() {
  const [state, formAction, pending] = useActionState<AuthState, FormData>(
    registerAction,
    undefined
  );

  return (
    <AuthCard
      title="Join the detectives"
      subtitle="Create an account to start spotting scams."
      footer={
        <>
          Already have an account?{" "}
          <Link href="/login" className="font-semibold">
            Sign in
          </Link>
        </>
      }
    >
      {state?.error && (
        <div className="mb-4 rounded-2xl border-[1.5px] border-tier-red bg-tier-red-face px-4 py-3 text-sm text-tier-red">
          {state.error}
        </div>
      )}
      <form action={formAction} className="flex flex-col gap-4">
        <div>
          <label className={labelClass} htmlFor="name">
            NAME
          </label>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            required
            placeholder="Aung Aung"
            className={fieldClass}
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="email">
            EMAIL
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="you@example.com"
            className={fieldClass}
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="password">
            PASSWORD
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
            placeholder="At least 8 characters"
            className={fieldClass}
          />
        </div>
        <button
          type="submit"
          disabled={pending}
          className="mt-1 rounded-full bg-ink px-5 py-3 text-sm font-semibold text-mint transition-colors hover:bg-ink-soft disabled:opacity-60"
        >
          {pending ? "Creating account…" : "Create account"}
        </button>
      </form>
      <div className="my-5 flex items-center gap-3 text-[11px] text-faint">
        <span className="h-px flex-1 bg-line" />
        OR
        <span className="h-px flex-1 bg-line" />
      </div>
      <GoogleButton action={googleAction} />
    </AuthCard>
  );
}
