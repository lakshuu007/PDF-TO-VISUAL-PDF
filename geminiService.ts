import { GoogleGenAI, Type } from "@google/genai";
import { RedesignData, FileData } from "./types";

// Vite-compatible environment variable
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

/**
 * Redesigns an academic document using Gemini AI.
 * Throws a controlled error if API key is missing or AI fails.
 */
export const redesignDocument = async (
  file: FileData
): Promise<RedesignData> => {

  // 🔒 Safety check (prevents blank page crash)
  if (!API_KEY) {
    throw new Error(
      "AI service is not configured. Please add VITE_GEMINI_API_KEY."
    );
  }

  try {
    const ai = new GoogleGenAI({
      apiKey: API_KEY
    });

    const systemInstruction = `
You are a World-Class Academic Document Designer specializing in VTU Engineering.

GOAL:
Transform raw VTU notes into a visually rich, exam-oriented, textbook-quality document.

STRICT DESIGN RULES:
1. NO DIAGRAMS: Do not generate Mermaid or flow diagrams.
2. VISUAL HIERARCHY: Use callout boxes for Definitions, Exam Tips, and Memory Tricks.
3. TABLES: Convert comparisons into structured Markdown tables.
4. CONTENT SAFETY: Do NOT omit or summarize technical details.
5. CLEAN OUTPUT: No placeholders, no filler text, no emojis.

OUTPUT FORMAT:
Return ONLY valid JSON matching the provided schema.
`;

    const response = await ai.models.generateContent({
      model: "gemini-1.5-pro",
      contents: [
        {
          role: "user",
          parts: [
            { text: systemInstruction },
            { text: file.content }
          ]
        }
      ],
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            documentTitle: { type: Type.STRING },
            themeColors: {
              type: Type.OBJECT,
              properties: {
                primary: { type: Type.STRING },
                secondary: { type: Type.STRING },
                accent: { type: Type.STRING }
              },
              required: ["primary", "secondary", "accent"]
            },
            sections: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  heading: { type: Type.STRING },
                  content: { type: Type.STRING }
                },
                required: ["heading", "content"]
              }
            }
          },
          required: ["documentTitle", "themeColors", "sections"]
        }
      }
    });

    if (!response.text) {
      throw new Error("AI returned an empty response.");
    }

    return JSON.parse(response.text) as RedesignData;

  } catch (error: any) {
    console.error("Gemini AI Error:", error);
    throw new Error(
      error?.message || "Failed to process document with AI."
    );
  }
};

