import { GoogleGenerativeAI } from "@google/generative-ai";

// Remplace par ta vraie clé juste pour ce test rapide
const genAI = new GoogleGenerativeAI("TA_CLE_API_ICI");

async function run() {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent("Bonjour, es-tu prêt pour des mathématiques ?");
    console.log("Réponse de l'API :", result.response.text());
  } catch (error) {
    console.error("L'API a échoué :", error.message);
  }
}

run();