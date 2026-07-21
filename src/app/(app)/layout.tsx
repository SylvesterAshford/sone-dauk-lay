import { BottomNav } from "@/components/BottomNav";
import { LensOverlay } from "@/components/lens/LensOverlay";

// Guest mode is the default (Invariant 12). No profile fetch, no login wall.
// The Lens overlay + bottom nav are present on every product screen.
export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-mist text-ink">
      <main className="pb-24">{children}</main>
      <LensOverlay />
      <BottomNav />
    </div>
  );
}
