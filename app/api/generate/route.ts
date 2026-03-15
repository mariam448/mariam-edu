import { NextRequest, NextResponse } from "next/server"

const FICHE_PROMPT = `Tu es un expert en pédagogie et en mathématiques au Maroc. Génère une **Fiche Pédagogique** de haute qualité, en français.
Structure : ## Objectifs, ## Support, ## Déroulement, ## Évaluation.
Utilise LaTeX : $$...$$`;

async function callGemini(apiKey: string, model: string, text: string) {
  const url = `https://generativelanguage.googleapis.com/v1/models/${model}:generateContent?key=${apiKey}`
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ contents: [{ parts: [{ text }] }] }),
  })
  return await res.json()
}

export async function POST(request: NextRequest) {
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY
  
  if (!GEMINI_API_KEY) {
    return NextResponse.json({ status: "error", message: "Clé API manquante dans Vercel" }, { status: 500 })
  }

  try {
    const { lesson, level } = await request.json()
    const fullPrompt = `${FICHE_PROMPT}\n\nCours: ${lesson}\nNiveau: ${level}`

    // نحاول استخدام موديل واحد سريع للتجربة
    const result = await callGemini(GEMINI_API_KEY, "gemini-1.5-flash", fullPrompt)

    if (result?.candidates?.[0]?.content?.parts?.[0]?.text) {
      const textContent = result.candidates[0].content.parts[0].text
      return NextResponse.json({ status: "success", content: textContent })
    }

    return NextResponse.json({ 
      status: "error", 
      message: result?.error?.message || "Gemini n'a pas pu générer de texte" 
    }, { status: 500 })

  } catch (e) {
    return NextResponse.json({ status: "error", message: "Erreur Serveur" }, { status: 500 })
  }
}