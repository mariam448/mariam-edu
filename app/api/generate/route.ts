import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk"

/**
 * هندسة الأوامر (Prompt Engineering) - تماشياً مع أهداف Axe 3 [cite: 16]
 */
const FICHE_PROMPT = `أنت أستاذ خبير في ديدكتيك الرياضيات بالمغرب. 
مهمتك توليد جذاذة تربوية (Fiche Pédagogique) عالية الجودة تلتزم بالتوجيهات التربوية المغربية.

التعليمات الصارمة:
1. اللغة: الفرنسية (مع استخدام المصطلحات التقنية الرياضية المعتمدة في المغرب).
2. التنسيق: استخدم LaTeX لجميع الصيغ الرياضية ($$...$$ للسطر المستقل و $...$ للتضمين).
3. الهيكلة: يجب أن تحتوي الجذاذة على العناوين التالية (##):
   ## Objectifs (3 à 5 objectifs mesurables) [cite: 15]
   ## Support (Matériel didactique)
   ## Déroulement (Étapes, durées, consignes)
   ## Évaluation (Critères et modalités)`;

const GROQ_MODEL = "llama-3.3-70b-versatile"

async function generateWithGroq(apiKey: string, prompt: string) {
  const groq = new Groq({ apiKey })

  const response: any = await groq.generate({
    model: GROQ_MODEL,
    prompt,
  })

  return response
}

export async function POST(request: NextRequest) {
  const GROQ_API_KEY = process.env.GROQ_API_KEY;

  if (!GROQ_API_KEY) {
    console.error("[API /api/generate] Missing GROQ_API_KEY");
    return NextResponse.json(
      { status: "error", message: "Groq API key not configured" },
      { status: 500 }
    );
  }

  try {
    const { lesson, level } = await request.json();

    if (!lesson) {
      return NextResponse.json(
        { status: "error", message: "Lesson name is required" },
        { status: 400 }
      );
    }

    // دمج البرومبت مع معطيات المستخدم (Axe 3: Maîtrise du Prompt Engineering) [cite: 16]
    const fullPrompt = `${FICHE_PROMPT}\n\n**Cours :** ${lesson}\n**Niveau :** ${level}`;
    
    const response: any = await generateWithGroq(GROQ_API_KEY, fullPrompt);

    const content = response?.output?.[0]?.content ?? response?.output ?? response?.text;

    if (!content) {
      console.warn("[API /api/generate] Groq returned no content", response);
      return NextResponse.json(
        { status: "error", message: "Groq returned no content" },
        { status: 500 }
      );
    }

    return NextResponse.json({ status: "success", content });
  } catch (e) {
    return NextResponse.json(
      { status: "error", message: "Internal Server Error" },
      { status: 500 }
    );
  }
}