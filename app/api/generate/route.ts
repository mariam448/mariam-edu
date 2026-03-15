import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const FICHE_PROMPT = `Tu es un expert en pédagogie et en mathématiques au Maroc. Génère une **Fiche Pédagogique** de haute qualité, en français, pour le cours indiqué et le niveau indiqué.

Structure obligatoire de la fiche (respecte exactement ces sections avec des titres en ##) :

## Objectifs
- Lister 3 à 5 objectifs pédagogiques clairs et mesurables.

## Support
- Décrire le matériel nécessaire.

## Déroulement de la séance
- Étapes, durées et consignes précises.

## Évaluation
- Critères et modalités d'évaluation.

Utilise **LaTeX** pour toutes les formules : $$...$$ pour display et $...$ pour inline.`

// تم التغيير إلى v1 لضمان الاستقرار
const GEMINI_API_VERSION = "v1" 

async function callGemini(
  apiKey: string,
  model: string,
  text: string
): Promise<{ text: string } | { error: string }> {
  const url = `https://generativelanguage.googleapis.com/${GEMINI_API_VERSION}/models/${model}:generateContent?key=${apiKey}`
  const payload = {
    contents: [{ parts: [{ text }] }],
  }
  
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
    
    const result = await res.json()

    if (result?.candidates?.[0]?.content?.parts?.[0]?.text) {
      return { text: result.candidates[0].content.parts[0].text }
    }

    const apiMessage = result?.error?.message || `Error ${res.status}`
    return { error: apiMessage }
  } catch (err) {
    return { error: "Network or Server Error" }
  }
}

// حذفنا الموديلات القديمة التي تسبب 404
const MODELS_TO_TRY = [
  "gemini-1.5-flash",
  "gemini-1.5-pro"
]

export async function POST(request: NextRequest) {
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY
  if (!GEMINI_API_KEY) {
    return NextResponse.json({ status: "error", message: "API key missing" }, { status: 500 })
  }

  try {
    const body = await request.json()
    const lesson = (body?.lesson ?? "").trim()
    const level = body?.level ?? ""

    if (!lesson) {
      return NextResponse.json({ status: "error", message: "Lesson required" }, { status: 400 })
    }

    const fullPrompt = `${FICHE_PROMPT}\n\n**Cours :** ${lesson}\n**Niveau :** ${level}`

    let lastError = ""
    for (const model of MODELS_TO_TRY) {
      const out = await callGemini(GEMINI_API_KEY, model, fullPrompt)
      if ("text" in out) {
        const textContent = out.text

        // حفظ في Supabase
        if (SUPABASE_URL && SUPABASE_ANON_KEY) {
          const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
          await supabase.from("worksheets").insert({
            title: lesson,
            level,
            content: textContent,
            updated_at: new Date().toISOString(),
          })
        }

        return NextResponse.json({ status: "success", content: textContent })
      }
      lastError = out.error
    }

    return NextResponse.json(
      { status: "error", message: `Erreur: ${lastError}` },
      { status: 500 }
    )
  } catch (e) {
    return NextResponse.json({ status: "error", message: "Server Error" }, { status: 500 })
  }
}