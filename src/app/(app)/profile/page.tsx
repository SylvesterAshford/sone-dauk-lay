import { redirect } from "next/navigation";
import { getProfile } from "@/lib/auth";
import { Mascot } from "@/components/Mascot";
import { logoutAction } from "@/app/actions/auth";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function ProfilePage() {
  const profile = await getProfile();
  if (!profile) redirect("/login");

  const rows = [
    { label: "NAME", value: profile.name },
    { label: "EMAIL", value: profile.email },
    { label: "ROLE", value: profile.role === "admin" ? "Admin" : "Learner" },
    {
      label: "SIGN-IN METHOD",
      value: profile.provider === "google" ? "Google" : "Email & password",
    },
    { label: "JOINED", value: formatDate(profile.created_at) },
  ];

  return (
    <section className="mx-auto max-w-[640px] px-6 pb-20 pt-14 sm:px-10">
      <div className="font-mono text-xs tracking-[0.12em] text-muted-2">
        YOUR DESK
      </div>
      <h1 className="mt-2.5 mb-7 font-display text-4xl font-extrabold text-ink">
        Profile
      </h1>

      <div className="rounded-3xl border-[1.5px] border-line bg-card p-8">
        <div className="mb-7 flex items-center gap-4">
          {profile.avatar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={profile.avatar}
              alt=""
              className="h-16 w-16 rounded-full border-[1.5px] border-ink object-cover"
            />
          ) : (
            <div className="grid h-16 w-16 place-items-center rounded-full border-[1.5px] border-ink bg-accent font-display text-2xl font-extrabold text-ink">
              {profile.name.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <div className="font-display text-xl font-bold text-ink">
              {profile.name}
            </div>
            <div className="text-sm text-muted-2">{profile.email}</div>
          </div>
        </div>

        <dl className="flex flex-col divide-y divide-line">
          {rows.map((r) => (
            <div
              key={r.label}
              className="flex items-center justify-between gap-4 py-3.5"
            >
              <dt className="font-mono text-[11px] tracking-[0.1em] text-muted-2">
                {r.label}
              </dt>
              <dd className="text-right text-sm font-medium text-ink">
                {r.value}
              </dd>
            </div>
          ))}
        </dl>

        <form action={logoutAction} className="mt-7">
          <button
            type="submit"
            className="w-full rounded-full border-[1.5px] border-line px-5 py-3 text-sm font-semibold text-muted transition-colors hover:border-ink hover:text-ink"
          >
            Log out
          </button>
        </form>
      </div>

      <div className="mt-6 flex items-center justify-center gap-3 opacity-60">
        <Mascot size={44} />
        <p className="m-0 font-mono text-[11.5px] text-faint">
          stay curious out there
        </p>
      </div>
    </section>
  );
}
