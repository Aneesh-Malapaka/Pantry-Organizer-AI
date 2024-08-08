"use client";
import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";

const recipeGemini = () => {
  const apiKey = process.env.NEXT_PUBLIC_API_KEY_GEMINI;
  const genAI = new GoogleGenerativeAI(apiKey);

  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    systemInstruction: process.env.NEXT_PUBLIC_SYSTEM_INSTRUCTIONS_GEMINI,
  });

  const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
  };

  const safetySettings = [
    {
      category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
      threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
    },
  ];

  async function run(ingredientsArray) {
    const chatSession = model.startChat({
      generationConfig,
      safetySettings,
      history: [],
    });
    const result = await chatSession.sendMessage(ingredientsArray);
    return result.response.text();
  }

  return run;
};

export default recipeGemini;
