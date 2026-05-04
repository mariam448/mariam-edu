import { createBrowserClient } from "@supabase/ssr"
import type { SupabaseClient } from "@supabase/supabase-js"

export type WorksheetRow = {
  id?: string
  title: string
  level: string
  content: string
  created_at?: string
  updated_at?: string
}

function readEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ?? ""
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ?? ""
  return { url, anonKey }
}

let browserClient: SupabaseClient | undefined

/**
 * Browser-only Supabase client (use in "use client" components).
 * Session is synced via cookies when middleware runs (see middleware.ts).
 */
export function getSupabase(): SupabaseClient {
  const { url, anonKey } = readEnv()

  if (!url || !anonKey) {
    const msg =
      "Configuration Supabase manquante : ajoutez NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_ANON_KEY dans .env.local, puis redémarrez le serveur de dev."
    if (typeof window !== "undefined") {
      console.error("[Supabase]", msg)
    }
    throw new Error(msg)
  }

  if (typeof window === "undefined") {
    throw new Error(
      "Le client navigateur Supabase ne peut pas être utilisé côté serveur. Importez createClient depuis @/lib/supabase/server à la place."
    )
  }

  if (!browserClient) {
    browserClient = createBrowserClient(url, anonKey)
  }

  return browserClient
}

/**
 * Browser-only Supabase client (`createBrowserClient`).
 * Use in `"use client"` components only.
 * For Server Components / Route Handlers, import `createClient` from `@/lib/supabase/server`.
 */
export function createClient(): SupabaseClient {
  return getSupabase()
}

/** @deprecated Préférez getSupabase() — délègue au client navigateur (navigateur uniquement). */
export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, prop, receiver) {
    const client = getSupabase()
    const value = Reflect.get(client, prop, receiver)
    return typeof value === "function"
      ? (value as (...args: unknown[]) => unknown).bind(client)
      : value
  },
})

if (process.env.NODE_ENV === "development" && typeof window !== "undefined") {
  const { url, anonKey } = readEnv()
  let host = "n/a"
  if (url) {
    try {
      host = new URL(url).hostname
    } catch {
      host = "invalid-url"
    }
  }
  console.log(
    "[Supabase env] NEXT_PUBLIC_SUPABASE_URL:",
    url ? `defined (host: ${host})` : "undefined or empty"
  )
  console.log(
    "[Supabase env] NEXT_PUBLIC_SUPABASE_ANON_KEY:",
    anonKey ? "defined (hidden)" : "undefined or empty"
  )
}
