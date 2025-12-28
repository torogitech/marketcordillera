import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Chef AI assistant service using Google Gemini API
export const askChefAI = async (query: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are a helpful, professional 3-star Michelin head chef assisting front-of-house staff.
      
      User Query: ${query}
      
      Provide a concise, helpful answer (under 50 words) suitable for explaining to a customer. 
      If asked about pairings, suggest something generic but fancy. 
      If asked about ingredients, assume standard fresh ingredients.
      Tone: Warm, knowledgeable, succinct.`,
    });
    // Use response.text property directly as per Gemini API guidelines
    return response.text || "Sorry, the chef is busy right now.";
  } catch (error) {
    console.error("Chef AI Error:", error);
    return "The chef is currently unavailable.";
  }
};