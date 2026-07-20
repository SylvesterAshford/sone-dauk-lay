import Link from "next/link";
import { redirect } from "next/navigation";
import { getProfile } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { UserRow } from "@/components/admin/UserRow";
import type { Profile } from "@/lib/types";

const PER_PAGE = 12;

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-[18px] border-[1.5px] border-line bg-card px-5 py-4">
      <div className="font-display text-3xl font-extrabold text-ink">
        {value}
      </div>
      <div className="mt-1 font-mono text-[10.5px] tracking-[0.1em] text-muted-2">
        {label}
      </div>
    </div>
  );
}

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; page?: string }>;
}) {
  const me = await getProfile();
  if (!me) redirect("/login");
  if (me.role !== "admin") redirect("/");

  const { search = "", page: pageParam } = await searchParams;
  const admin = createAdminClient();
  const { data } = await admin
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });

  const all = (data ?? []) as Profile[];

  // Server Component render — reading the clock here is intentional.
  // eslint-disable-next-line react-hooks/purity
  const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const stats = {
    users: all.length,
    admins: all.filter((u) => u.role === "admin").length,
    googleUsers: all.filter((u) => u.provider === "google").length,
    emailUsers: all.filter((u) => !u.provider).length,
    newThisWeek: all.filter((u) => new Date(u.created_at).getTime() >= weekAgo)
      .length,
  };

  const q = search.trim().toLowerCase();
  const filtered = q
    ? all.filter((u) =>
        [u.name, u.email, u.role, u.provider ?? "email"]
          .join(" ")
          .toLowerCase()
          .includes(q)
      )
    : all;

  const page = Math.max(1, Number(pageParam) || 1);
  const pageCount = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const current = Math.min(page, pageCount);
  const slice = filtered.slice((current - 1) * PER_PAGE, current * PER_PAGE);

  const pageHref = (p: number) => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (p > 1) params.set("page", String(p));
    const qs = params.toString();
    return qs ? `/admin?${qs}` : "/admin";
  };

  return (
    <section className="mx-auto max-w-[1060px] px-6 pb-20 pt-14 sm:px-10">
      <div className="font-mono text-xs tracking-[0.12em] text-muted-2">
        ADMIN
      </div>
      <h1 className="mt-2.5 mb-2 font-display text-4xl font-extrabold text-ink">
        User Management
      </h1>
      <p className="m-0 mb-8 max-w-[52ch] text-pretty text-muted">
        Overview of sign-ups plus tools to manage roles and remove demo
        accounts.
      </p>

      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-5">
        <StatCard label="TOTAL USERS" value={stats.users} />
        <StatCard label="ADMINS" value={stats.admins} />
        <StatCard label="GOOGLE" value={stats.googleUsers} />
        <StatCard label="EMAIL" value={stats.emailUsers} />
        <StatCard label="NEW THIS WEEK" value={stats.newThisWeek} />
      </div>

      <form className="mt-8 flex gap-2.5" action="/admin" method="get">
        <input
          type="search"
          name="search"
          defaultValue={search}
          placeholder="Search name, email, role, or provider…"
          className="flex-1 rounded-full border-[1.5px] border-line bg-card px-5 py-3 text-[15px] text-ink placeholder:text-faint focus:border-ink"
        />
        <button
          type="submit"
          className="rounded-full bg-ink px-6 py-3 text-sm font-semibold text-mint transition-colors hover:bg-ink-soft"
        >
          Search
        </button>
        {search && (
          <Link
            href="/admin"
            className="grid place-items-center rounded-full border-[1.5px] border-line px-5 text-sm font-medium text-muted no-underline transition-colors hover:border-ink hover:text-ink"
          >
            Clear
          </Link>
        )}
      </form>

      <div className="mt-5 flex items-center justify-between">
        <div className="font-mono text-[11px] tracking-[0.1em] text-muted-2">
          {filtered.length} {filtered.length === 1 ? "USER" : "USERS"}
          {search ? " MATCHED" : ""}
        </div>
        <div className="font-mono text-[11px] tracking-[0.1em] text-faint">
          PAGE {current} / {pageCount}
        </div>
      </div>

      <div className="mt-3 flex flex-col gap-2.5">
        {slice.length === 0 ? (
          <div className="rounded-[18px] border-[1.5px] border-dashed border-line bg-card px-5 py-10 text-center text-sm text-muted-2">
            No users match “{search}”.
          </div>
        ) : (
          slice.map((u) => (
            <UserRow key={u.id} user={u} isSelf={u.id === me.id} />
          ))
        )}
      </div>

      {pageCount > 1 && (
        <div className="mt-6 flex items-center justify-center gap-2">
          {Array.from({ length: pageCount }, (_, i) => i + 1).map((p) => (
            <Link
              key={p}
              href={pageHref(p)}
              className={`grid h-9 w-9 place-items-center rounded-full border-[1.5px] text-sm font-medium no-underline transition-colors ${
                p === current
                  ? "border-ink bg-ink text-mint"
                  : "border-line text-muted hover:border-ink hover:text-ink"
              }`}
            >
              {p}
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
