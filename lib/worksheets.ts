import { supabase } from "@/lib/supabase"
import type { WorksheetRow } from "@/lib/supabase"

export async function saveWorksheet(row: {
  title: string
  level: string
  content: string
}) {
  const { data, error } = await supabase
    .from("worksheets")
    .insert({
      title: row.title,
      level: row.level,
      content: row.content,
      updated_at: new Date().toISOString(),
    })
    .select("id")
    .single()

  if (error) throw error
  return data
}

export async function listWorksheets(limit = 50) {
  const { data, error } = await supabase
    .from("worksheets")
    .select("id, title, level, content, created_at, updated_at")
    .order("created_at", { ascending: false })
    .limit(limit)

  if (error) throw error
  return data as (WorksheetRow & { id: string })[]
}

export async function getWorksheet(id: string) {
  const { data, error } = await supabase
    .from("worksheets")
    .select("*")
    .eq("id", id)
    .single()

  if (error) throw error
  return data as WorksheetRow & { id: string }
}
