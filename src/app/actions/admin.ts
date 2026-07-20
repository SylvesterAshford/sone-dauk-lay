"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Role } from "@/lib/types";

export type AdminActionState = { error?: string; ok?: string } | undefined;

// Verify the caller is an admin. Returns their id, or throws for non-admins.
async function requireAdmin(): Promise<string> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated.");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") throw new Error("Admins only.");
  return user.id;
}

async function adminCount(admin: ReturnType<typeof createAdminClient>) {
  const { count } = await admin
    .from("profiles")
    .select("id", { count: "exact", head: true })
    .eq("role", "admin");
  return count ?? 0;
}

export async function updateRoleAction(
  _prev: AdminActionState,
  formData: FormData
): Promise<AdminActionState> {
  try {
    await requireAdmin();
    const userId = String(formData.get("userId") ?? "");
    const role = String(formData.get("role") ?? "") as Role;
    if (role !== "admin" && role !== "user")
      return { error: "Invalid role." };

    const admin = createAdminClient();
    const { data: target } = await admin
      .from("profiles")
      .select("role")
      .eq("id", userId)
      .single();

    // At least one admin must remain on the platform.
    if (
      target?.role === "admin" &&
      role !== "admin" &&
      (await adminCount(admin)) <= 1
    ) {
      return { error: "At least one admin must remain on the platform." };
    }

    const { error } = await admin
      .from("profiles")
      .update({ role })
      .eq("id", userId);
    if (error) return { error: error.message };

    revalidatePath("/admin");
    return { ok: "Role updated." };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Something went wrong." };
  }
}

export async function deleteUserAction(
  _prev: AdminActionState,
  formData: FormData
): Promise<AdminActionState> {
  try {
    const adminId = await requireAdmin();
    const userId = String(formData.get("userId") ?? "");

    // You cannot delete your own admin account while signed in.
    if (userId === adminId) {
      return {
        error: "You cannot delete your own admin account while signed in.",
      };
    }

    const admin = createAdminClient();
    const { data: target } = await admin
      .from("profiles")
      .select("role")
      .eq("id", userId)
      .single();

    if (target?.role === "admin" && (await adminCount(admin)) <= 1) {
      return { error: "At least one admin must remain on the platform." };
    }

    // Deleting the auth user cascades to the profile row.
    const { error } = await admin.auth.admin.deleteUser(userId);
    if (error) return { error: error.message };

    revalidatePath("/admin");
    return { ok: "User deleted successfully." };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Something went wrong." };
  }
}
