import { createClient } from "@supabase/supabase-js";

// Server-only Supabase client using the service-role key. This BYPASSES RLS,
// so it must never be imported into client components. Used for admin reads
// (drafts, leads) and all writes (create/edit/delete posts, manage leads).
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error(
      "Supabase admin client requires NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY. " +
        "Run `vercel env pull .env.local`.",
    );
  }

  return createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
