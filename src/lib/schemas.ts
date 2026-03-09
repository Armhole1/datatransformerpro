import { Type, Schema } from "@google/genai";

export const INVOICE_PROMPT = "Extract the following information from this invoice. If a value is missing, leave it empty or 0.";

export const INVOICE_SCHEMA: Schema = {
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
};
