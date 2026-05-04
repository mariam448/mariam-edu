/**
 * Client-only entry — does not re-export `@/lib/supabase/server` so importing from here
 * never pulls `next/headers` into Client Component bundles.
 *
 * Server: `import { createClient } from "@/lib/supabase/server"`
 */
export {
  getSupabase,
  createClient,
  supabase,
  type WorksheetRow,
} from "./supabase/client"
