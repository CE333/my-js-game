
import { GoogleGenAI, Type, Schema } from "@google/genai";
import { GameConfig } from "../types";
import { DEFAULT_CONFIG } from "../constants";

// Safely retrieve API Key
const getApiKey = () => {
  try {
    if (typeof process !== 'undefined' && process.env) {
      return process.env.API_KEY;
    }
  } catch (e) {
    // Ignore ReferenceError
  }
  return '';
};

const ai = new GoogleGenAI({ apiKey: getApiKey() });

const gameConfigSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    gravity: { type: Type.NUMBER, description: "Gravity force (0.15 to 0.8)" },
    jumpStrength: { type: Type.NUMBER, description: "Jump velocity. IMPORTANT: Must be negative. For higher gravity, this must be MORE negative (e.g. -7 to -10) to allow climbing." },
    pipeSpeed: { type: Type.NUMBER, description: "Speed of pipes moving left (2 to 6)" },
    pipeSpawnRate: { type: Type.NUMBER, description: "Frames between pipe spawns (70 to 140)" },
    gapSize: { type: Type.NUMBER, description: "Gap between top and bottom pipes (130 to 220)" },
    volatility: { type: Type.NUMBER, description: "Vertical movement range of pipes. 0 for static, 20-80 for moving pipes." },
    themeName: { type: Type.STRING, description: "A creative name for this challenge in Persian (Nature inspired)" },
    themeDescription: { type: Type.STRING, description: "Short description of the challenge in Persian" },
    primaryColor: { type: Type.STRING, description: "Hex color code for the pipes/obstacles" },
    skyColor: { type: Type.STRING, description: "Hex color code for the base sky" },
    season: { type: Type.STRING, enum: ['Spring', 'Summer', 'Autumn', 'Winter'], description: "The season for visual theme" },
    timeOfDay: { type: Type.STRING, enum: ['Day', 'Night'], description: "Time of day" },
  },
  required: ["gravity", "jumpStrength", "pipeSpeed", "pipeSpawnRate", "gapSize", "volatility", "themeName", "themeDescription", "primaryColor", "skyColor", "season", "timeOfDay"],
};

export const generateChallenge = async (difficulty: string): Promise<GameConfig> => {
  try {
    const apiKey = getApiKey();
    if (!apiKey) {
        console.warn("No API Key found. Using default config.");
        return DEFAULT_CONFIG;
    }

    const prompt = `
      Create a unique Flappy Bird game configuration JSON based on the difficulty level: "${difficulty}".
      The game is called "Creative Energy 333".
      
      CRITICAL PHYSICS RULE:
      If Gravity is high (> 0.4), JumpStrength MUST be very strong (e.g., -8 to -11) so the bird can climb fast. 
      If JumpStrength is too weak (-4 or -5) with high gravity, the game is impossible.
      
      - For "Easy": Low gravity (0.2), Jump -5, Slow speed.
      - For "Hard": High gravity (0.5), STRONG Jump (-7.5 to -8.5), Faster speed, Volatility 30-50.
      - For "Crazy": High gravity (0.6+), VERY STRONG Jump (-9 to -12), Fast speeds, High Volatility (60-100).
      
      Vary the "season" and "timeOfDay" for beautiful visuals.
      Return the response in Persian where text is required.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: gameConfigSchema,
        temperature: 0.95, 
      },
    });

    if (response.text) {
      return JSON.parse(response.text) as GameConfig;
    }
    
    throw new Error("Empty response from AI");
  } catch (error) {
    console.error("Failed to generate challenge:", error);
    return DEFAULT_CONFIG;
  }
};
