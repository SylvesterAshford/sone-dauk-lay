import { Header } from "@/components/Header";
import { LensOverlay } from "@/components/lens/LensOverlay";

// Guest mode is the default (Invariant 12). Sticky top nav + the Lens overlay
// are present on every product screen.
export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="mx-auto max-w-[1000px] px-4 pb-24 pt-7 sm:px-6">
        {children}
      </main>
      <LensOverlay />
    </div>
  );
}
