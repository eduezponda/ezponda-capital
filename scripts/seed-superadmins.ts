/**
 * Seed script — promotes a list of emails to superadmin role.
 *
 * Usage (requires .env.local in project root):
 *   npx dotenv-cli -e .env.local npx tsx scripts/seed-superadmins.ts
 *
 * Or set env vars manually and run:
 *   NEXT_PUBLIC_SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... npx tsx scripts/seed-superadmins.ts
 */

import { createClient } from "@supabase/supabase-js";

const SUPERADMIN_EMAILS: string[] = [
  // Add superadmin emails here before running
  // "admin@ezponda.com",
];

async function main() {
  if (SUPERADMIN_EMAILS.length === 0) {
    console.log("No emails configured in SUPERADMIN_EMAILS. Add at least one and re-run.");
    process.exit(0);
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const { data, error } = await supabase
    .from("profiles")
    .update({ role: "superadmin" })
    .in("email", SUPERADMIN_EMAILS)
    .select("email, role");

  if (error) {
    console.error("Error promoting superadmins:", error.message);
    process.exit(1);
  }

  if (!data || data.length === 0) {
    console.log("No profiles found for the given emails. Make sure users have signed up first.");
  } else {
    console.log(`Promoted ${data.length} user(s) to superadmin:`);
    data.forEach((row) => console.log(`  ✓ ${row.email}`));
  }
}

main();
