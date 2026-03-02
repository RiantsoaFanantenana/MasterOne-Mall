
import { GoogleGenAI, Type } from "@google/genai";

export const analyzeContent = async (prompt: string) => {
  // Initialize GoogleGenAI directly with process.env.API_KEY per library requirements
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        temperature: 0.7,
        topP: 0.8,
        topK: 40,
        thinkingConfig: { thinkingBudget: 0 }
      },
    });
    
    // Access .text property directly (it's a getter, not a method)
    return response.text || "No response received.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};

export const getSmartSuggestions = async (context: string) => {
  // Initialize GoogleGenAI directly with process.env.API_KEY per library requirements
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Generate 3 smart action suggestions based on this context: ${context}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              type: { type: Type.STRING }
            },
            required: ["title", "description", "type"]
          }
        }
      }
    });
    
    // Access response text using property getter and parse JSON
    return JSON.parse(response.text.trim());
  } catch (error) {
    console.error("Gemini Suggestion Error:", error);
    return [];
  }
};
