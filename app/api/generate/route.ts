import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const GEMINI_API_KEY = process.env.GEMINI_API_KEY
// Use v1beta and a current stable model; gemini-1.5-flash is deprecated (404). See https://ai.google.dev/gemini-api/docs/models
const GEMINI_MODEL = "gemini-2.5-flash"
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export async function POST(request: NextRequest) {
  if (!GEMINI_API_KEY) {
    return NextResponse.json(
      { status: "error", message: "Gemini API key not configured" },
      { status: 500 }
    )
  }

  try {
    const body = await request.json()
    const lesson = (body?.lesson ?? "").trim()
    const level = body?.level ?? ""

    if (!lesson) {
      return NextResponse.json(
        { status: "error", message: "Lesson name is required" },
        { status: 400 }
      )
    }

    const prompt = `Tu es un expert en mathématiques au Maroc. Génère une fiche pédagogique en français pour le cours de ${lesson} niveau ${level}. Utilise LaTeX pour les formules (utilise $$ pour les formules en display et $ pour inline).`

    const payload = {
      contents: [
        {
          parts: [{ text: prompt }],
        },
      ],
    }

    const res = await fetch(`${GEMINI_URL}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })

    const result = await res.json()

    if (result?.candidates?.[0]?.content?.parts?.[0]?.text) {
      const textContent = result.candidates[0].content.parts[0].text

      if (SUPABASE_URL && SUPABASE_ANON_KEY) {
        try {
          const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
          await supabase.from("worksheets").insert({
            title: lesson,
            level,
            content: textContent,
            updated_at: new Date().toISOString(),
          })
        } catch {
          // non-blocking: generation succeeded even if save fails
        }
      }

      return NextResponse.json({ status: "success", content: textContent })
    }

    console.error("Gemini API error:", result)
    return NextResponse.json(
      {
        status: "error",
        message: result?.error?.message ?? "Clé API invalide ou quota atteint",
      },
      { status: 500 }
    )
  } catch (e) {
    console.error("Generate API error:", e)
    return NextResponse.json(
      { status: "error", message: e instanceof Error ? e.message : "Server error" },
      { status: 500 }
    )
  }
}
