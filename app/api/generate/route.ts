import { NextRequest, NextResponse } from "next/server"

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
  const url = `https://generativelanguage.googleapis.com/${GEMINI_API_VERSION}/models/${model}:generateText?key=${apiKey}`
  const payload = {
    prompt: { text },
    // Optional: set maxOutputTokens or temperature here if desired
  }

  console.log("[Gemini] Calling model:", model, "URL:", url)
  console.log("[Gemini] Payload:", payload)

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })

    const result = await res.json()
    console.log(
      "[Gemini] Raw response for model",
      model,
      ":",
      JSON.stringify(result).slice(0, 500)
    )

    // Google Generative Language API v1 uses `candidates[0].output`.
    const candidateOutput =
      result?.candidates?.[0]?.output ??
      result?.candidates?.[0]?.content?.parts?.[0]?.text

    if (candidateOutput) {
      return { text: candidateOutput }
    }

    const apiMessage =
      result?.error?.message || result?.error || `Error ${res.status}`
    return { error: apiMessage }
  } catch (err) {
    console.error("[Gemini] Network or server error:", err)
    return { error: "Network or Server Error" }
  }
}

export async function POST(request: NextRequest) {
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY
  if (!GEMINI_API_KEY) {
    console.error("[API /api/generate] Missing GEMINI_API_KEY")
    return NextResponse.json(
      { status: "error", message: "Gemini API key not configured" },
      { status: 500 }
    )
  }

  try {
    const body = await request.json()
    console.log("[API /api/generate] Incoming body:", body)
    const lesson = (body?.lesson ?? "").trim()
    const level = body?.level ?? ""

    if (!lesson) {
      return NextResponse.json(
        { status: "error", message: "Lesson name is required" },
        { status: 400 }
      )
    }

    const fullPrompt = `${FICHE_PROMPT}\n\n**Cours :** ${lesson}\n**Niveau :** ${level}`
    console.log("[API /api/generate] Built prompt length:", fullPrompt.length)

    const modelsToTry = ["gemini-1.5-flash", "gemini-1.5-pro"]

    let usedModel = modelsToTry[0]
    let out = await callGemini(GEMINI_API_KEY, usedModel, fullPrompt)

    if ("error" in out && /not found|not supported/i.test(out.error)) {
      usedModel = modelsToTry[1]
      console.warn(
        "[API /api/generate] Model not available, trying fallback model",
        usedModel,
        "(original error:", out.error, ")"
      )
      out = await callGemini(GEMINI_API_KEY, usedModel, fullPrompt)
    }

    if ("text" in out) {
      const textContent = out.text
      console.log(
        "[API /api/generate] Success with model",
        usedModel,
        "content length:",
        textContent.length
      )

      // Supabase persistence disabled by default to help isolate 500 errors.
      // Enable it by setting ENABLE_SUPABASE=true in your environment.
      if (process.env.ENABLE_SUPABASE === "true") {
        console.log("[API /api/generate] Supabase writes enabled")
      } else {
        console.log("[API /api/generate] Supabase writes disabled (set ENABLE_SUPABASE=true to enable)")
      }

      return NextResponse.json({ status: "success", content: textContent })
    }

    console.warn("[API /api/generate] Gemini error:", out.error)
    return NextResponse.json(
      {
        status: "error",
        message: `Gemini error: ${out.error}`,
      },
      { status: 500 }
    )
  } catch (e) {
    console.error("[API /api/generate] Unhandled server error:", e)
    return NextResponse.json(
      { status: "error", message: "Server Error" },
      { status: 500 }
    )
  }
}