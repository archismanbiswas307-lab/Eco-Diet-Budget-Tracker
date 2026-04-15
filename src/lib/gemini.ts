import { GoogleGenAI, Type, ThinkingLevel } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function generateDietPlan(
  budget: number,
  preferences: string[],
  goals: { calories: number },
  vegetablePrices: any,
  healthProfile?: any
) {
  let healthContext = "";
  if (healthProfile) {
    healthContext = `
    User Health Profile:
    - Age: ${healthProfile.age}
    - Gender: ${healthProfile.gender}
    - Weight: ${healthProfile.weight}kg
    - Height: ${healthProfile.height}cm
    - Activity Level: ${healthProfile.activityLevel}
    - BMI: ${healthProfile.bmi?.toFixed(1)}
    - TDEE: ${healthProfile.tdee?.toFixed(0)} kcal
    `;
  }

  const prompt = `Generate a monthly diet plan that minimizes cost while meeting these nutritional goals:
  - Daily Calories: ${goals.calories}
  - Monthly Budget: ₹${budget}
  - Preferences: ${preferences.join(", ")}
  - Current Vegetable Prices & Purchase URLs: ${JSON.stringify(vegetablePrices)}
  ${healthContext}

  Note: The currency is Indian Rupees (₹). Focus on Indian cuisine and locally available vegetables.
  If health profile is provided, ensure the meals are balanced for their activity level and BMI.
  
  CRITICAL: For each ingredient in the meals, if it matches one of the provided vegetables, include its "estimatedCost" based on the amount and its "purchaseUrl" from the provided data.
  
  Provide the plan in JSON format with a list of daily meals and estimated monthly cost.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          dailyCalories: { type: Type.NUMBER },
          meals: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                description: { type: Type.STRING },
                ingredients: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING },
                      amount: { type: Type.STRING },
                      estimatedCost: { type: Type.NUMBER },
                      purchaseUrl: { type: Type.STRING },
                    },
                    required: ["name", "amount"],
                  },
                },
              },
            },
          },
          estimatedMonthlyCost: { type: Type.NUMBER },
        },
        required: ["dailyCalories", "meals", "estimatedMonthlyCost"],
      },
    },
  });

  return JSON.parse(response.text);
}
