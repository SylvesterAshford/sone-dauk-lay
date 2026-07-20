import "server-only";
import { createClient as createServiceClient } from "@supabase/supabase-js";

// Service-role client. Bypasses RLS — use ONLY in server code (server actions /
// route handlers) for admin operations. Never import this into a client component.
export function createAdminClient() {
  return createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}
