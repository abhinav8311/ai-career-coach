// scripts/list-models.mjs
import { GoogleGenerativeAI } from "@google/generative-ai";

const client = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function listModels() {
  try {
    const models = await client.listModels();
    console.log(JSON.stringify(models, null, 2));
  } catch (err) {
    console.error("listModels error:", err);
  }
}

listModels();