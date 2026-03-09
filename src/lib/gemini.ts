import { GoogleGenAI, Type } from "@google/genai";

const getAI = () => new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function extractInvoiceData(pdfBase64: string) {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: "gemini-3.1-pro-preview",
    contents: [
      {
        inlineData: {
          data: pdfBase64,
          mimeType: "application/pdf",
        },
      },
      {
        text: "Extract the following information from this invoice. If a value is missing, leave it empty or 0.",
      },
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          invoiceNumber: { type: Type.STRING },
          date: { type: Type.STRING },
          vendorName: { type: Type.STRING },
          totalAmount: { type: Type.NUMBER },
          taxAmount: { type: Type.NUMBER },
          lineItems: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                description: { type: Type.STRING },
                quantity: { type: Type.NUMBER },
                unitPrice: { type: Type.NUMBER },
                total: { type: Type.NUMBER },
              },
            },
          },
        },
      },
    },
  });

  return JSON.parse(response.text || "{}");
}
