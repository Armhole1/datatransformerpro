import { GoogleGenAI, Schema } from "@google/genai";

const getAI = () => new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function extractDocumentData(fileBase64: string, mimeType: string, prompt: string, schema: Schema) {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [
      {
        inlineData: {
          data: fileBase64,
          mimeType: mimeType,
        },
      },
      {
        text: prompt,
      },
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: schema,
    },
  });

  return JSON.parse(response.text || "{}");
}
