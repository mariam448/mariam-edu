import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

async function list() {
  const key = process.env.GEMINI_API_KEY;
  console.log("⏳ جاري التحقق من المفتاح في خوادم Google...");
  
  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.error) {
      console.error("❌ خطأ من Google:");
      console.error(`- الرسالة: ${data.error.message}`);
      console.error(`- السبب: ${data.error.status}`);
    } else if (data.models) {
      console.log("✅ الموديلات المتاحة لمفتاحك هي:");
      data.models.forEach(m => console.log(`- ${m.name}`));
    } else {
      console.log("❓ استجابة غير معروفة:", data);
    }
  } catch (error) {
    console.error("❌ فشل الاتصال بالشبكة:", error.message);
  }
}
list();