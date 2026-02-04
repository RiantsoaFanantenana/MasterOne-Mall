
import { Injectable } from '@angular/core';
import { GoogleGenAI, Type } from "@google/genai";

@Injectable({
  providedIn: 'root'
})
export class GeminiService {
  async analyzeContent(prompt: string) {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          systemInstruction: "You are MasterOne Assistant, an expert in shopping mall management and retail. You are polite, analytical, and your responses aim to optimize customer flow and boutique profitability for MasterOne Mall.",
          temperature: 0.7,
          thinkingConfig: { thinkingBudget: 0 }
        }
      });
      return response.text || "Sorry, I couldn't generate an analysis at this time.";
    } catch (error) {
      console.error("Gemini Mall Service Error:", error);
      throw error;
    }
  }

  async getSmartSuggestions(context: string) {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `As the MasterOne Mall management AI, provide 3 optimization suggestions based on: ${context}`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                type: { type: Type.STRING, description: "Suggestion type: SECURITY, FLOW, RETAIL, ENERGY" }
              },
              required: ["title", "description", "type"]
            }
          }
        }
      });
      return JSON.parse(response.text.trim());
    } catch (error) {
      console.error("Gemini Mall Suggestion Error:", error);
      return [];
    }
  }
}
