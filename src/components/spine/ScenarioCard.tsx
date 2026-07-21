import type { Bi } from "@/content/pack";

// Reads as a believable message, not a quiz item (design v4 §6). Identical everywhere.
// Persistent unobtrusive mono `example` marker. --surface, 8px radius, hairline border.

const PLATFORM_LABEL: Record<string, string> = {
  sms: "SMS",
  facebook: "Facebook",
  messenger: "Messenger",
  telegram: "Telegram",
  viber: "Viber",
  call: "Call",
};

export function ScenarioCard({
  sender,
  meta,
  platform,
  body,
}: {
  sender: string;
  meta: string;
  platform?: string;
  body: Bi;
}) {
  return (
    <div className="overflow-hidden rounded-lg border border-hairline bg-surface">
      <div className="flex items-center gap-3 border-b border-hairline px-4 py-3">
        <span
          className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-sm font-bold text-surface"
          style={{ background: "var(--color-forest)" }}
        >
          {sender.trim().charAt(0).toUpperCase()}
        </span>
        <span className="min-w-0 flex-1">
          <span className="mm block truncate text-[15px] font-semibold text-ink">
            {sender}
          </span>
          <span className="block truncate font-mono text-[11px] text-muted">
            {meta}
          </span>
        </span>
        {platform && (
          <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted">
            {PLATFORM_LABEL[platform] ?? platform}
          </span>
        )}
      </div>
      <div className="px-4 py-4">
        <p className="mm m-0 text-[16px] leading-[1.75] text-ink">{body.mm}</p>
        <p className="m-0 mt-2 text-[13.5px] leading-relaxed text-muted">
          {body.en}
        </p>
      </div>
      <div className="px-4 pb-2">
        <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted opacity-70">
          example
        </span>
      </div>
    </div>
  );
}
