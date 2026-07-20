import { redirect } from "next/navigation";
import { Header } from "@/components/Header";
import { getProfile } from "@/lib/auth";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await getProfile();
  // Middleware already guards this, but guard again for safety.
  if (!profile) redirect("/login");

  return (
    <div className="min-h-screen bg-mint text-ink">
      <Header profile={profile} />
      {children}
    </div>
  );
}
