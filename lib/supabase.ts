import { createClient, SupabaseClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ""

// Vérifie le chargement des variables (sans exposer la clé anon).
const urlDefined = Boolean(supabaseUrl)
let supabaseHost = "n/a"
if (urlDefined) {
  try {
    supabaseHost = new URL(supabaseUrl).hostname
  } catch {
    supabaseHost = "invalid-url"
  }
}
console.log(
  "[Supabase env] NEXT_PUBLIC_SUPABASE_URL:",
  urlDefined ? `defined (host: ${supabaseHost})` : "undefined or empty"
)
console.log(
  "[Supabase env] NEXT_PUBLIC_SUPABASE_ANON_KEY:",
  supabaseAnonKey ? "defined (value hidden)" : "undefined or empty"
)

export const supabase: SupabaseClient =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : (null as unknown as SupabaseClient)

export type WorksheetRow = {
  id?: string
  title: string
  level: string
  content: string
  created_at?: string
  updated_at?: string
}
