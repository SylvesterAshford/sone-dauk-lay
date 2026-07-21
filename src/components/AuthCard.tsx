import Link from "next/link";
import { LensMascot } from "@/components/LensMascot";

// Shared chrome for the login + register cards. Auth is optional / out-of-pitch
// (Appendix A) — kept functional, styled to the v4 green system.
export function AuthCard({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer: React.ReactNode;
}) {
  return (
    <div className="w-full max-w-[420px]">
      <div className="mb-6 flex flex-col items-center gap-3 text-center">
        <LensMascot size={64} />
        <div>
          <div className="display text-2xl font-bold text-ink">
            San Dauk Lay
          </div>
          <div className="font-mono text-[10.5px] tracking-[0.08em] text-muted">
            LITTLE DETECTIVE
          </div>
        </div>
      </div>
      <div className="rounded-2xl border border-hairline bg-surface p-8">
        <h1 className="display text-2xl font-bold text-ink">
          {title}
        </h1>
        <p className="mt-1 mb-6 text-sm text-muted">{subtitle}</p>
        {children}
      </div>
      <p className="mt-5 text-center text-sm text-muted">{footer}</p>
    </div>
  );
}

export const fieldClass =
  "w-full rounded border border-hairline bg-surface px-4 py-3 text-[15px] text-ink focus:border-forest focus:outline-none";

export const labelClass =
  "mb-1.5 block font-mono text-[11px] tracking-[0.1em] text-muted uppercase";

export function GoogleButton({ action }: { action: () => Promise<void> }) {
  return (
    <form action={action}>
      <button
        type="submit"
        className="flex w-full items-center justify-center gap-2 rounded-full border border-hairline bg-surface px-5 py-3 text-sm font-semibold text-ink transition-colors hover:border-forest"
      >
        <span className="grid h-4 w-4 place-items-center rounded-full text-[10px] font-bold text-surface" style={{ background: "var(--color-green)" }}>
          G
        </span>
        Continue with Google
      </button>
    </form>
  );
}

export { Link };
