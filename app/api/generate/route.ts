import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

/**
 * هندسة الأوامر (Prompt Engineering) - Axe 3
 */
const FICHE_PROMPT = `أنت أستاذ خبير في ديدكتيك الرياضيات بالمغرب. 
مهمتك توليد جذاذة تربوية (Fiche Pédagogique) عالية الجودة تلتزم بالتوجيهات التربوية المغربية.

التعليمات الصارمة:
1. اللغة: الفرنسية (مع استخدام المصطلحات التقنية الرياضية المعتمدة في المغرب).
2. التنسيق: استخدم LaTeX لجميع الصيغ الرياضية ($$...$$ للسطر المستقل و $...$ للتضمين).
3. الهيكلة: يجب أن تحتوي الجذاذة على العناوين التالية (##):
   ## Objectifs (3 à 5 objectifs mesurables)
   ## Support (Matériel didactique)
   ## Déroulement (Étapes, durées, consignes)
   ## Évaluation (Critères et modalités)`;

const GROQ_MODEL = "llama-3.3-70b-versatile";

// دالة الاتصال المصححة حسب معايير Groq SDK 2026
async function generateWithGroq(apiKey: string, level: string, lesson: string) {
  const groq = new Groq({ apiKey });

  const response = await groq.chat.completions.create({
    messages: [
      {
        role: "system",
        content: FICHE_PROMPT,
      },
      {
        role: "user",
        content: `Génère une fiche pédagogique complète pour le cours de : ${lesson}. Niveau : ${level}.`,
      },
    ],
    model: GROQ_MODEL,
    temperature: 0.3, // حرارة منخفضة لضمان الدقة الرياضية وعدم "الهلوسة"
  });

  return response.choices[0]?.message?.content;
}

export async function POST(request: NextRequest) {
  const GROQ_API_KEY = process.env.GROQ_API_KEY;

  if (!GROQ_API_KEY) {
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

    // استدعاء الدالة الجديدة
    const content = await generateWithGroq(GROQ_API_KEY, level, lesson);

    if (!content) {
      return NextResponse.json(
        { status: "error", message: "Groq returned no content" },
        { status: 500 }
      );
    }

    return NextResponse.json({ status: "success", content });
  } catch (e: any) {
    console.error("[Groq Error]:", e.message);
    return NextResponse.json(
      { status: "error", message: e.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}