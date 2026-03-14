import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const FICHE_PROMPT = `Tu es un expert en pédagogie et en mathématiques au Maroc. Génère une **Fiche Pédagogique** de haute qualité, en français, pour le cours indiqué et le niveau indiqué.

Structure obligatoire de la fiche (respecte exactement ces sections avec des titres en ##) :

## Objectifs
- Lister 3 à 5 objectifs pédagogiques clairs et mesurables pour cette séance.

## Support
- Décrire le matériel et les supports nécessaires (manuel, tableau, fiches, etc.).

## Déroulement de la séance
- Décrire les étapes de la séance (introduction, développement, activités, synthèse) avec des durées indicatives et des consignes précises pour l'enseignant.

## Évaluation
- Proposer des critères et des modalités d'évaluation (formative ou sommative) pour vérifier la maîtrise des objectifs.

Utilise **LaTeX** pour toutes les formules mathématiques : $$...$$ pour les formules en display et $...$ pour inline. Sois concret et directement utilisable en classe.`

async function callGemini(
  apiKey: string,
  model: string,
  text: string
): Promise<{ text: string } | null> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`
  const payload = {
    contents: [{ parts: [{ text }] }],
  }
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })
  const result = await res.json()
  const content = result?.candidates?.[0]?.content?.parts?.[0]?.text ?? null
  if (content) return { text: content }
  return null
}

export async function POST(request: NextRequest) {
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY
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

    const fullPrompt = `${FICHE_PROMPT}\n\n**Cours :** ${lesson}\n**Niveau :** ${level}`

    let out = await callGemini(GEMINI_API_KEY, "gemini-1.5-flash-latest", fullPrompt)
    if (!out) {
      out = await callGemini(GEMINI_API_KEY, "gemini-pro", fullPrompt)
    }

    if (!out) {
      return NextResponse.json(
        { status: "error", message: "Clé API invalide, quota atteint ou modèle indisponible." },
        { status: 500 }
      )
    }

    const textContent = out.text

    if (SUPABASE_URL && SUPABASE_ANON_KEY) {
      const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
      const { error: insertError } = await supabase.from("worksheets").insert({
        title: lesson,
        level,
        content: textContent,
        updated_at: new Date().toISOString(),
      })
      if (insertError) {
        console.error("Supabase insert error:", insertError)
      }
    }

    return NextResponse.json({ status: "success", content: textContent })
  } catch (e) {
    console.error("Generate API error:", e)
    const message = e instanceof Error ? e.message : "Server error"
    return NextResponse.json(
      { status: "error", message },
      { status: 500 }
    )
  }
}
