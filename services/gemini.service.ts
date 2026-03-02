import { Injectable } from '@angular/core';
import { GoogleGenAI, Type } from "@google/genai";
import { env } from '../env';

@Injectable({
  providedIn: 'root'
})
export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    // Initialize once in constructor
    this.ai = new GoogleGenAI({ apiKey: env.geminiApiKey });
  }

  async analyzeContent(prompt: string) {
    try {
      const response = await this.ai.models.generateContent({
        model: "gemini-2.5-flash", // Fixed model name
        contents: prompt,
        config: {
          systemInstruction: "You are MasterOne Assistant, an expert in shopping mall management and retail. You are polite, analytical, and your responses aim to optimize customer flow and boutique profitability for MasterOne Mall.",
          temperature: 0.7,
        }
      });
      return response.text || "Sorry, I couldn't generate an analysis at this time.";
    } catch (error) {
      console.error("Gemini Mall Service Error:", error);
      throw error;
    }
  }

  async getSmartSuggestions(context: string) {
    try {
      const response = await this.ai.models.generateContent({
        model: "gemini-2.5-flash", // Fixed model name
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
                type: { 
                  type: Type.STRING, 
                  description: "Suggestion type: SECURITY, FLOW, RETAIL, ENERGY" 
                }
              },
              required: ["title", "description", "type"]
            }
          }
        }
      });
      return JSON.parse(response.text?.trim() || '[]');
    } catch (error) {
      console.error("Gemini Mall Suggestion Error:", error);
      return [];
    }
  }
}