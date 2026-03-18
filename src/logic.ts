import { GoogleGenAI, Type } from "@google/genai";
import { Archetype, FormData, Result, Episode } from './types';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export async function generateResult(data: FormData): Promise<Result> {
  const model = "gemini-3.1-pro-preview";
  
  const prompt = `
    You are a Senior Brand Strategist at Loreia, a creative agency that specializes in brand world-building.
    Your task is to architect a "Signature Series" content blueprint for a client.
    
    Client Data:
    - Business Name: ${data.businessName}
    - Product/Service: ${data.product}
    - Brand Personality: ${data.personality.join(', ')}
    - Desired Feeling: ${data.feeling}
    - Ideal Customer: ${data.idealCustomer}
    - Core Question: ${data.coreQuestion}
    - Common Misconception: ${data.misconception}
    - Customer Struggle: ${data.struggle}
    - Posting Frequency: ${data.frequency}
    - Passion Topic: ${data.passionTopic}

    Instructions:
    1. Determine the best "Archetype" for their series from this list: Myth Buster, How-To, Behind the Scenes, Customer Spotlight, AMA, Problem Solver, Industry Insider, Product Deep Dive, Storytime, Trend Watch.
    2. Create at least 5 "Series Name" ideas that are strictly "brand-coded" to the client's world, NOT Loreia's. 
    3. The tone of the Series Names must match the Brand Personality. If the brand is "Minimalist", "Relatable", or "Playful", keep the names simple, direct, and grounded. Only use "fancy" or "editorial" names if the personality is "Luxury", "Authoritative", or "Bold".
    4. Write a "Why This Works" strategic paragraph (3-4 sentences). Use simple, clear language. Avoid marketing jargon like "archetype", "resonate", or "strategic alignment". Explain it like you're talking to a friend about why their customers will actually care.
    5. Generate 10 specific "Episode Ideas". Each episode title or description MUST explicitly mention or address a core issue or struggle the target audience is facing (based on the "Customer Struggle" provided). These should be highly creative and specific to their business.
    
    Return the result in JSON format.
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            archetype: { type: Type.STRING },
            seriesNames: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "At least 5 creative series name ideas"
            },
            whyItWorks: { type: Type.STRING },
            episodes: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.NUMBER },
                  title: { type: Type.STRING },
                  description: { type: Type.STRING }
                },
                required: ["id", "title", "description"]
              }
            }
          },
          required: ["archetype", "seriesNames", "whyItWorks", "episodes"]
        }
      }
    });

    const result = JSON.parse(response.text || '{}');
    return result as Result;
  } catch (error) {
    console.error("Error generating result:", error);
    // Fallback to a basic generation if AI fails
    return {
      archetype: 'Storytime',
      seriesNames: [`${data.businessName} Chronicles`, `The ${data.businessName} Story`, `Behind ${data.businessName}`, `Our Journey`, `The ${data.businessName} Way`],
      whyItWorks: "People love seeing the human side of a business. This series lets your customers get to know you and trust you more.",
      episodes: Array.from({ length: 10 }, (_, i) => ({
        id: i + 1,
        title: `Episode ${i + 1}: Overcoming ${data.struggle}`,
        description: `A deep dive into how we help you with ${data.struggle}.`
      }))
    };
  }
}

