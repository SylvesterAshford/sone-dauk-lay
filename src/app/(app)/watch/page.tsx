"use client";

import { useState } from "react";
import { TYPES, CHANNELS } from "@/lib/modules";

function Chip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="rounded-full border-[1.5px] px-4 py-2 text-sm font-medium transition-all"
      style={{
        background: active ? "#23372c" : "#ffffff",
        color: active ? "#eef4ef" : "#23372c",
        borderColor: active ? "#23372c" : "#d5e3d8",
      }}
    >
      {label}
    </button>
  );
}

export default function CommunityWatchPage() {
  const [wType, setWType] = useState("");
  const [wChannel, setWChannel] = useState("");
  const [wDesc, setWDesc] = useState("");

  const label = "mb-2.5 font-mono text-[11px] tracking-[0.1em] text-muted-2";

  return (
    <section className="mx-auto grid max-w-[1060px] grid-cols-1 items-start gap-12 px-6 pb-20 pt-14 sm:px-10 lg:grid-cols-[1fr_380px]">
      <div>
        <div className="font-mono text-xs tracking-[0.12em] text-muted-2">
          CASE 04
        </div>
        <h1 className="mt-2.5 mb-2 font-display text-4xl font-extrabold text-ink">
          Community Watch
        </h1>
        <p className="m-0 mb-7 max-w-[48ch] text-pretty text-muted">
          Draft a report about a scam you spotted. It stays on your device — for
          now.
        </p>

        <div className={label}>WHAT KIND OF SCAM?</div>
        <div className="mb-7 flex flex-wrap gap-2">
          {TYPES.map((label) => (
            <Chip
              key={label}
              label={label}
              active={wType === label}
              onClick={() => setWType(wType === label ? "" : label)}
            />
          ))}
        </div>

        <div className={label}>WHERE DID IT ARRIVE?</div>
        <div className="mb-7 flex flex-wrap gap-2">
          {CHANNELS.map((label) => (
            <Chip
              key={label}
              label={label}
              active={wChannel === label}
              onClick={() => setWChannel(wChannel === label ? "" : label)}
            />
          ))}
        </div>

        <div className={label}>WHAT HAPPENED?</div>
        <textarea
          value={wDesc}
          onChange={(e) => setWDesc(e.target.value)}
          placeholder="Describe the message, who sent it, what they asked for…"
          className="min-h-[140px] w-full resize-y rounded-[18px] border-[1.5px] border-line bg-card p-[18px] text-[15px] leading-relaxed text-ink placeholder:text-faint focus:border-ink"
        />
      </div>

      <div className="relative overflow-hidden rounded-3xl bg-ink px-7 py-8 font-mono text-mint lg:sticky lg:top-8">
        <div className="mb-6 text-[11px] tracking-[0.14em] text-faint">
          COMMUNITY REPORT · PREVIEW
        </div>
        <div className="flex flex-col gap-[18px] text-[13px] leading-relaxed">
          <div>
            <div className="mb-1 text-[10.5px] tracking-[0.1em] text-muted-2">
              SCAM TYPE
            </div>
            {wType || "—"}
          </div>
          <div>
            <div className="mb-1 text-[10.5px] tracking-[0.1em] text-muted-2">
              CHANNEL
            </div>
            {wChannel || "—"}
          </div>
          <div>
            <div className="mb-1 text-[10.5px] tracking-[0.1em] text-muted-2">
              DESCRIPTION
            </div>
            <span className="whitespace-pre-wrap">{wDesc.trim() || "—"}</span>
          </div>
        </div>
        <div className="mt-7 inline-block -rotate-[4deg] rounded-md border-2 border-[#7fcfa9] px-3 py-1.5 text-[11px] tracking-[0.12em] text-[#7fcfa9]">
          DRAFT · STAYS ON THIS DEVICE
        </div>
      </div>
    </section>
  );
}
