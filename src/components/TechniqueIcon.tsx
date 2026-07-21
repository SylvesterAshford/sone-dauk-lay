import type { TechniqueId } from "@/content/pack";

// The six custom technique glyphs — distinguishable in greyscale (design v4 §12).
// Exact paths from the confirmed design.
export function TechniqueIcon({
  id,
  size = 22,
  bg = "var(--color-surface)",
}: {
  id: TechniqueId;
  size?: number;
  bg?: string;
}) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  switch (id) {
    case "urgency":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="8.5" />
          <path d="M12 12V6.6" />
          <path d="M12 12l4 2.4" />
        </svg>
      );
    case "authority":
      return (
        <svg {...common}>
          <circle cx="12" cy="9" r="5.4" />
          <path d="M8.6 13l-1.6 7 5-2.6 5 2.6-1.6-7" />
        </svg>
      );
    case "emotion":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="2.4" fill="currentColor" stroke="none" />
          <path d="M12 3.6v3.4M12 17v3.4M3.6 12h3.4M17 12h3.4M6 6l2.4 2.4M15.6 15.6L18 18M18 6l-2.4 2.4M8.4 15.6L6 18" />
        </svg>
      );
    case "doctored":
      return (
        <svg {...common}>
          <rect x="3.5" y="5" width="12" height="10" rx="1.5" />
          <rect x="8.5" y="9" width="12" height="10" rx="1.5" fill={bg} />
        </svg>
      );
    case "expert":
      return (
        <svg {...common}>
          <path d="M4.5 5.5h15v9h-9l-4 3.4v-3.4h-2z" />
          <path d="M9.5 9v2.4M13 9v2.4" />
        </svg>
      );
    case "context":
      return (
        <svg {...common}>
          <path d="M8.5 4.6H4.6v3.9M15.5 4.6h3.9v3.9M8.5 19.4H4.6v-3.9M15.5 19.4h3.9v-3.9" />
        </svg>
      );
  }
}
