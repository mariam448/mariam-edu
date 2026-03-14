import { NextRequest, NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"
import { createClient } from "@supabase/supabase-js"

const GEMINI_API_KEY = process.env.GEMINI_API_KEY
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

/** Model string for the SDK; API version is handled by @google/generative-ai */
const GEMINI_MODEL = "gemini-1.5-flash"

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

    const fullPrompt = `${FICHE_PROMPT}\n\n**Cours :** ${lesson}\n**Niveau :** ${level}`

    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY)
    const model = genAI.getGenerativeModel({ model: GEMINI_MODEL })
    const result = await model.generateContent(fullPrompt)
    const response = result.response
    const textContent = response.text()

    if (!textContent) {
      console.error("Gemini returned no text", result)
      return NextResponse.json(
        { status: "error", message: "La réponse du modèle est vide" },
        { status: 500 }
      )
    }

    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      return NextResponse.json(
        { status: "error", message: "Supabase not configured; cannot save worksheet" },
        { status: 500 }
      )
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
    const { error: insertError } = await supabase.from("worksheets").insert({
      title: lesson,
      level,
      content: textContent,
      updated_at: new Date().toISOString(),
    })

    if (insertError) {
      console.error("Supabase insert error:", insertError)
      return NextResponse.json(
        {
          status: "error",
          message: "Fiche générée mais erreur lors de l'enregistrement: " + insertError.message,
        },
        { status: 500 }
      )
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
