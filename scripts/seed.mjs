// Seeds the 8 demo accounts from the original Laravel seeder into Supabase Auth.
// Run after applying migrations:  node scripts/seed.mjs
// Requires env: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in the environment."
  );
  process.exit(1);
}

const admin = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const users = [
  { name: "Prototype Admin", email: "admin@sandauklay.test", role: "admin", provider: null },
  { name: "Demo Student", email: "student@sandauklay.test", role: "user", provider: null },
  { name: "Aye Chan", email: "aye.chan@example.test", role: "user", provider: "google" },
  { name: "Min Thu", email: "min.thu@example.test", role: "user", provider: null },
  { name: "Nilar Win", email: "nilar.win@example.test", role: "user", provider: "google" },
  { name: "Htet Aung", email: "htet.aung@example.test", role: "user", provider: null },
  { name: "Su Myat", email: "su.myat@example.test", role: "admin", provider: null },
  { name: "Kaung Htet", email: "kaung.htet@example.test", role: "user", provider: "google" },
];

async function findUserByEmail(email) {
  let page = 1;
  // paginate through auth users until found (demo set is tiny)
  for (;;) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 200 });
    if (error) throw error;
    const match = data.users.find((u) => u.email === email);
    if (match) return match;
    if (data.users.length < 200) return null;
    page += 1;
  }
}

for (const u of users) {
  let userId;
  const { data, error } = await admin.auth.admin.createUser({
    email: u.email,
    password: "password",
    email_confirm: true,
    user_metadata: { name: u.name },
  });

  if (error) {
    if (/registered|exists/i.test(error.message)) {
      const existing = await findUserByEmail(u.email);
      if (!existing) {
        console.error(`✗ ${u.email}: ${error.message}`);
        continue;
      }
      userId = existing.id;
    } else {
      console.error(`✗ ${u.email}: ${error.message}`);
      continue;
    }
  } else {
    userId = data.user.id;
  }

  // The handle_new_user trigger created the profile; align role/provider/name to the seed.
  const { error: upErr } = await admin
    .from("profiles")
    .update({ name: u.name, role: u.role, provider: u.provider })
    .eq("id", userId);

  if (upErr) console.error(`✗ profile ${u.email}: ${upErr.message}`);
  else console.log(`✓ ${u.email} (${u.role})`);
}

console.log("\nDone. All demo accounts use the password: password");
