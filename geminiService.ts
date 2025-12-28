
import { GoogleGenAI, Type } from "@google/genai";
import { RedesignData, FileData } from "./types";

export const redesignDocument = async (file: FileData): Promise<RedesignData> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const systemInstruction = `You are a World-Class Academic Document Designer specializing in VTU Engineering.
Your goal is to transform raw notes into a high-end, textbook-quality PDF.

STRICT DESIGN RULES:
1. NO DIAGRAMS: Do not generate Mermaid code or diagrams.
2. VISUAL HIERARCHY: Use 'callout' boxes for Key Definitions, Exam Tips, and Memory Tricks.
3. COMPARISON TABLES: Convert all comparisons, differences, or multi-attribute lists into professional Markdown Tables.
4. VERBATIM CONTENT: Do not summarize or omit technical details. Ensure every concept from the source is included.
5. NO PLACEHOLDERS: Never output text like "[Insert Image Here]" or empty boxes.
6. STRUCTURE: Break the content into logical 'sections'. Each section should have clear 'blocks'.

BLOCK TYPES:
- 'paragraph': For standard explanations.
- 'list': For bulleted points.
- 'table': Use for comparisons/lists with attributes. Format: Markdown | col | col |
- 'callout': For highlighted boxes. Labels: "KEY DEFINITION", "EXAM TIP", "MEMORY TRICK".
- 'subheading': For internal section titles.

OUTPUT: Valid JSON only. Do not include markdown code blocks.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: {
      parts: [
        {
          inlineData: {
            mimeType: file.mimeType,
            data: file.base64
          }
        },
        {
          text: "Redesign this document into a professional, visual, and easy-to-read textbook layout. Use Tables and Callout boxes extensively. Do NOT use diagrams. Preserve all content verbatim."
        }
      ]
    },
    config: {
      systemInstruction,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          documentTitle: { type: Type.STRING },
          subjectCode: { type: Type.STRING },
          themeColors: {
            type: Type.OBJECT,
            properties: {
              primary: { type: Type.STRING },
              secondary: { type: Type.STRING }
            },
            required: ["primary", "secondary"]
          },
          sections: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                blocks: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      type: { type: Type.STRING, description: "paragraph, list, table, callout, or subheading" },
                      content: { type: Type.STRING },
                      label: { type: Type.STRING, description: "Only for callouts: e.g. EXAM TIP" }
                    },
                    required: ["type", "content"]
                  }
                }
              },
              required: ["title", "blocks"]
            }
          }
        },
        required: ["documentTitle", "themeColors", "sections"]
      }
    }
  });

  if (!response.text) {
    throw new Error("The AI designer failed to process the request. Please try a clearer source.");
  }

  return JSON.parse(response.text) as RedesignData;
};
