import Link from "next/link";
import { Mascot } from "@/components/Mascot";

// Shared chrome for the login + register cards.
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
        <Mascot size={72} />
        <div>
          <div className="font-display text-2xl font-extrabold text-ink">
            San Dauk Lay
          </div>
          <div className="font-mono text-[10.5px] tracking-[0.08em] text-muted-2">
            LITTLE DETECTIVE
          </div>
        </div>
      </div>
      <div className="rounded-3xl border-[1.5px] border-line bg-card p-8">
        <h1 className="font-display text-2xl font-extrabold text-ink">{title}</h1>
        <p className="mt-1 mb-6 text-sm text-muted">{subtitle}</p>
        {children}
      </div>
      <p className="mt-5 text-center text-sm text-muted">{footer}</p>
    </div>
  );
}

export const fieldClass =
  "w-full rounded-2xl border-[1.5px] border-line bg-card px-4 py-3 text-[15px] text-ink placeholder:text-faint focus:border-ink";

export const labelClass =
  "mb-1.5 block font-mono text-[11px] tracking-[0.1em] text-muted-2";

export function GoogleButton({ action }: { action: () => Promise<void> }) {
  return (
    <form action={action}>
      <button
        type="submit"
        className="flex w-full items-center justify-center gap-2 rounded-full border-[1.5px] border-line bg-card px-5 py-3 text-sm font-semibold text-ink transition-colors hover:border-ink"
      >
        <span className="grid h-4 w-4 place-items-center rounded-full bg-accent text-[10px] font-bold text-ink">
          G
        </span>
        Continue with Google
      </button>
    </form>
  );
}

export { Link };
