import Link from "next/link";
import { Mascot } from "@/components/Mascot";
import { ModuleList } from "@/components/ModuleList";
import { getProfile } from "@/lib/auth";

export default async function DeskPage() {
  const profile = await getProfile();
  const firstName = profile?.name.split(" ")[0] ?? "detective";

  return (
    <section className="mx-auto max-w-[1060px] px-6 pb-20 pt-16 sm:px-10">
      <div className="flex flex-wrap items-center justify-between gap-10">
        <div className="max-w-[560px]">
          <div className="font-mono text-xs tracking-[0.12em] text-muted-2">
            MINGALABA, {firstName.toUpperCase()}
          </div>
          <h1 className="mt-3 mb-4 text-pretty font-display text-[46px] font-extrabold leading-[1.08] text-ink">
            Which case are we cracking today?
          </h1>
          <p className="m-0 max-w-[44ch] text-pretty text-muted">
            Got a message that smells fishy? Run it through a check before you
            reply, click, or pay.
          </p>
        </div>
        <div className="mr-6 animate-floaty">
          <Mascot size={120} />
        </div>
      </div>

      <ModuleList />

      {profile?.role === "admin" && (
        <div className="mt-10 rounded-[20px] border-[1.5px] border-line bg-card px-6 py-5">
          <div className="mb-3 font-mono text-[11px] tracking-[0.1em] text-muted-2">
            ADMIN TOOLS
          </div>
          <div className="flex flex-wrap gap-2.5">
            <Link
              href="/admin"
              className="rounded-full border-[1.5px] border-ink px-4 py-2 text-sm font-semibold text-ink no-underline transition-colors hover:bg-ink hover:text-mint"
            >
              User Management
            </Link>
            <Link
              href="/admin"
              className="rounded-full border-[1.5px] border-line px-4 py-2 text-sm font-medium text-muted no-underline transition-colors hover:border-ink hover:text-ink"
            >
              Overview & Reports
            </Link>
          </div>
        </div>
      )}

      <p className="mt-8 font-mono text-[11.5px] text-faint">
        prototype · lessons and reports stay in this session
      </p>
    </section>
  );
}
