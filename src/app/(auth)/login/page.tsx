"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { loginAction, googleAction, type AuthState } from "@/app/actions/auth";
import {
  AuthCard,
  GoogleButton,
  fieldClass,
  labelClass,
} from "@/components/AuthCard";

function LoginForm() {
  const [state, formAction, pending] = useActionState<AuthState, FormData>(
    loginAction,
    undefined
  );
  const params = useSearchParams();
  const oauthError = params.get("error") === "google";

  return (
    <AuthCard
      title="Welcome back, detective"
      subtitle="Sign in to open your desk."
      footer={
        <>
          New here?{" "}
          <Link href="/register" className="font-semibold">
            Create an account
          </Link>
        </>
      }
    >
      {(state?.error || oauthError) && (
        <div className="mb-4 rounded-2xl border-[1.5px] border-tier-red bg-tier-red-face px-4 py-3 text-sm text-tier-red">
          {state?.error ?? "Google sign-in didn’t work. Try again."}
        </div>
      )}
      <form action={formAction} className="flex flex-col gap-4">
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
            autoComplete="current-password"
            required
            placeholder="••••••••"
            className={fieldClass}
          />
        </div>
        <button
          type="submit"
          disabled={pending}
          className="mt-1 rounded-full bg-ink px-5 py-3 text-sm font-semibold text-mint transition-colors hover:bg-ink-soft disabled:opacity-60"
        >
          {pending ? "Signing in…" : "Sign in"}
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

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
