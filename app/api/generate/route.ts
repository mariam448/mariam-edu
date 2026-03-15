import { NextRequest, NextResponse } from "next/server";

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

// الموديل الذي أكدنا وجوده في قائمة الاختبار الخاصة بكِ
const GEMINI_MODEL = "gemini-2.0-flash"; 

async function callGemini(apiKey: string, text: string) {
  // استخدام الإصدار v1beta الذي نجح في اختبار list-models.mjs
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`;
  
  const payload = {
    contents: [{ parts: [{ text }] }],
  };

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result?.error?.message || "Error calling Gemini API");
    }

    // استخراج النص حسب هيكلية استجابة Gemini الحديثة
    const candidateOutput = result?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (candidateOutput) {
      return { text: candidateOutput };
    }
    return { error: "No content generated" };
  } catch (err: any) {
    return { error: err.message };
  }
}

export async function POST(request: NextRequest) {
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

  if (!GEMINI_API_KEY) {
    return NextResponse.json(
      { status: "error", message: "Gemini API key not configured" },
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
    
    const out = await callGemini(GEMINI_API_KEY, fullPrompt);

    if ("text" in out) {
      // تفعيل Supabase إذا كنتِ بحاجة لبناء "بنك الموارد" (Banque de Ressources) [cite: 26]
      if (process.env.ENABLE_SUPABASE === "true") {
        console.log("[PPE] Saving to bank of resources...");
      }

      return NextResponse.json({ status: "success", content: out.text });
    }

    return NextResponse.json(
      { status: "error", message: `Gemini error: ${out.error}` },
      { status: 500 }
    );
  } catch (e) {
    return NextResponse.json(
      { status: "error", message: "Internal Server Error" },
      { status: 500 }
    );
  }
}