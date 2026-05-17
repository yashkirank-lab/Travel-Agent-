import { GoogleGenAI, Type } from "@google/genai";
import { Recommendation, Category } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function verifyLocation(location: string): Promise<{ valid: boolean; normalizedName?: string } | null> {
  const prompt = `
    Verify if the following location exists: "${location}".
    If it exists, return its standardized name (e.g., "Tokyo, Japan" instead of "tokyo").
    If it is too vague or doesn't exist, indicate it is invalid.
    Use Google Search to confirm.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            valid: { type: Type.BOOLEAN },
            normalizedName: { type: Type.STRING }
          },
          required: ["valid"]
        }
      }
    });

    const text = response.text;
    if (!text) return { valid: false };
    return JSON.parse(text);
  } catch (error) {
    console.error("Location verification error:", error);
    return null;
  }
}

export async function getRecommendations(
  location: string,
  categories: Category[]
): Promise<Recommendation[]> {
  const prompt = `
    Act as a local travel expert and AI guide. 
    Find 5 interesting, non-tourist-trap places in or near ${location} that match these vibes: ${categories.join(", ")}.
    
    SPECIAL INSTRUCTION for 'Local Favorites': 
    If 'Local Favorites' is selected, prioritize places that have high ratings from locals, or reviews mentioning 'local gem', 'authentic experience', or 'hidden treasure'. 
    STRICTLY filter out places that are primarily known as major tourist attractions or sponsored results. Focus on underrated, highly-rated spots.
    
    Use Google Search to verify the current sentiment and ensure these are actually highly rated by locals and not just tourist traps.
    
    For each place, provide:
    - A unique ID
    - Name
    - A short, engaging description explaining why it fits the vibe and why it's a "hidden gem"
    - The primary category it belongs to
    - 2-3 vibe tags (e.g., "Authentic", "Quiet", "Photo-op")
    - Price level as a string: "$", "$$", "$$$", or "$$$$"
    - Mock URLs for Yelp, TripAdvisor, or an official site
    - Approximate coordinates (latitude and longitude) for a map view in ${location}
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              name: { type: Type.STRING },
              description: { type: Type.STRING },
              category: { type: Type.STRING },
              tags: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              priceLevel: { type: Type.STRING, description: "Price level: $, $$, $$$, or $$$$" },
              links: {
                type: Type.OBJECT,
                properties: {
                  yelp: { type: Type.STRING },
                  tripadvisor: { type: Type.STRING },
                  official: { type: Type.STRING }
                }
              },
              coordinates: {
                type: Type.OBJECT,
                properties: {
                  lat: { type: Type.NUMBER },
                  lng: { type: Type.NUMBER }
                },
                required: ["lat", "lng"]
              }
            },
            required: ["id", "name", "description", "category", "tags", "priceLevel", "links", "coordinates"]
          }
        }
      }
    });

    const text = response.text;
    if (!text) return [];
    try {
      return JSON.parse(text) as Recommendation[];
    } catch (e) {
      console.error("JSON parsing error:", e);
      return [];
    }
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    return [];
  }
}
