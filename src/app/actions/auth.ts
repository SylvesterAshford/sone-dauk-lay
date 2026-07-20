"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export type AuthState = { error?: string } | undefined;

function adminEmails(): string[] {
  return (process.env.SAN_DAUK_LAY_ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

export async function registerAction(
  _prev: AuthState,
  formData: FormData
): Promise<AuthState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!name) return { error: "Please enter your name." };
  if (!email) return { error: "Please enter your email." };
  if (password.length < 8)
    return { error: "Password must be at least 8 characters." };

  const admin = createAdminClient();

  // Create the account already confirmed (prototype: no email round-trip),
  // mirroring the old Laravel flow that logged users in right after register.
  const { data, error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { name },
  });

  if (error) {
    if (/registered|exists|already/i.test(error.message))
      return { error: "That email is already registered." };
    return { error: error.message };
  }

  // Optional convenience: force-admin for configured emails (mirrors config admin_emails).
  if (data.user && adminEmails().includes(email.toLowerCase())) {
    await admin.from("profiles").update({ role: "admin" }).eq("id", data.user.id);
  }

  const supabase = await createClient();
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (signInError) return { error: signInError.message };

  redirect("/");
}

export async function loginAction(
  _prev: AuthState,
  formData: FormData
): Promise<AuthState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password)
    return { error: "Enter your email and password." };

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) return { error: "The provided credentials are incorrect." };

  redirect("/");
}

export async function logoutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

export async function googleAction() {
  const supabase = await createClient();
  const origin = (await headers()).get("origin") ?? "";

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: `${origin}/auth/callback` },
  });

  if (error || !data.url) redirect("/login?error=google");
  redirect(data.url);
}
