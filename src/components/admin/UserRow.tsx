"use client";

import { useActionState } from "react";
import {
  updateRoleAction,
  deleteUserAction,
  type AdminActionState,
} from "@/app/actions/admin";
import type { Profile } from "@/lib/types";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function UserRow({
  user,
  isSelf,
}: {
  user: Profile;
  isSelf: boolean;
}) {
  const [roleState, roleAction, rolePending] = useActionState<
    AdminActionState,
    FormData
  >(updateRoleAction, undefined);
  const [delState, delAction, delPending] = useActionState<
    AdminActionState,
    FormData
  >(deleteUserAction, undefined);

  const nextRole = user.role === "admin" ? "user" : "admin";
  const error = roleState?.error ?? delState?.error;

  return (
    <div className="rounded-[18px] border-[1.5px] border-line bg-card px-5 py-4">
      <div className="flex flex-wrap items-center gap-4">
        {user.avatar ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={user.avatar}
            alt=""
            className="h-10 w-10 rounded-full border-[1.5px] border-line object-cover"
          />
        ) : (
          <div className="grid h-10 w-10 place-items-center rounded-full border-[1.5px] border-ink bg-accent font-display text-sm font-bold text-ink">
            {user.name.charAt(0).toUpperCase()}
          </div>
        )}

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="truncate font-semibold text-ink">{user.name}</span>
            {isSelf && (
              <span className="font-mono text-[10px] tracking-[0.08em] text-faint">
                YOU
              </span>
            )}
          </div>
          <div className="truncate text-[13px] text-muted-2">{user.email}</div>
        </div>

        <span
          className={`rounded-full border-[1.5px] px-2.5 py-1 font-mono text-[11px] tracking-[0.06em] ${
            user.role === "admin"
              ? "border-ink text-ink"
              : "border-line text-muted"
          }`}
        >
          {user.role.toUpperCase()}
        </span>
        <span className="rounded-full border-[1.5px] border-line px-2.5 py-1 font-mono text-[11px] tracking-[0.06em] text-muted-2">
          {user.provider === "google" ? "GOOGLE" : "EMAIL"}
        </span>
        <span className="hidden font-mono text-[11px] text-faint sm:block">
          {formatDate(user.created_at)}
        </span>

        <div className="flex items-center gap-2">
          <form action={roleAction}>
            <input type="hidden" name="userId" value={user.id} />
            <input type="hidden" name="role" value={nextRole} />
            <button
              type="submit"
              disabled={rolePending}
              className="rounded-full border-[1.5px] border-line px-3 py-1.5 text-xs font-medium text-muted transition-colors hover:border-ink hover:text-ink disabled:opacity-50"
            >
              {rolePending
                ? "…"
                : nextRole === "admin"
                  ? "Make admin"
                  : "Make learner"}
            </button>
          </form>
          <form action={delAction}>
            <input type="hidden" name="userId" value={user.id} />
            <button
              type="submit"
              disabled={delPending || isSelf}
              title={
                isSelf ? "You cannot delete your own account" : "Delete user"
              }
              className="rounded-full border-[1.5px] border-line px-3 py-1.5 text-xs font-medium text-tier-red transition-colors hover:border-tier-red disabled:opacity-40"
            >
              {delPending ? "…" : "Delete"}
            </button>
          </form>
        </div>
      </div>

      {error && (
        <div className="mt-3 rounded-xl border-[1.5px] border-tier-red bg-tier-red-face px-3 py-2 text-[13px] text-tier-red">
          {error}
        </div>
      )}
    </div>
  );
}
