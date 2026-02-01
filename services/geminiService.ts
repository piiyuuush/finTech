
import { GoogleGenAI, Type } from "@google/genai";
import { Transaction, FinancialGoal } from '../types';

// Finance observations helper
export const getFinancialObservations = async (
  transactions: Transaction[],
  goals: FinancialGoal[]
) => {
  // Always initialize a fresh GoogleGenAI instance before the call to ensure up-to-date config/API key
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const prompt = `
    Act as an expert personal finance advisor. Analyze the following financial data and provide 3-4 concise, actionable observations or tips.
    
    Recent Transactions: ${JSON.stringify(transactions.slice(-20))}
    Goals: ${JSON.stringify(goals)}
    
    Focus on spending patterns and goal progress.
    Return the response as a valid JSON array of strings.
  `;

  try {
    // Upgraded to gemini-3-pro-preview for better complex reasoning in financial analysis
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      },
    });

    return JSON.parse(response.text || "[]");
  } catch (error) {
    console.error("Gemini Error:", error);
    return ["Unable to generate insights at this moment. Please try again later."];
  }
};