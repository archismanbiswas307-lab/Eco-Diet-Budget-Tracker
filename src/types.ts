export interface Transaction {
  id: string;
  date: string;
  name: string;
  amount: number;
  category: string[];
}

export interface Vegetable {
  name: string;
  pricePerKg: number;
  caloriesPer100g: number;
  proteinPer100g: number;
  fiberPer100g: number;
  season: string[];
  purchaseUrl?: string;
  discountPercentage?: number;
}

export interface DietPlan {
  dailyCalories: number;
  meals: {
    name: string;
    description: string;
    ingredients: { 
      name: string; 
      amount: string;
      estimatedCost?: number;
      purchaseUrl?: string;
    }[];
  }[];
  estimatedMonthlyCost: number;
}

export interface HealthProfile {
  age: number;
  gender: "male" | "female" | "other";
  weight: number; // in kg
  height: number; // in cm
  activityLevel: "sedentary" | "light" | "moderate" | "active" | "very_active";
  bmi?: number;
  bmr?: number;
  tdee?: number;
}

export interface UserProfile {
  name: string;
  monthlyBudget: number;
  dietaryPreferences: string[];
  nutritionalGoals: {
    calories: number;
  };
  healthProfile?: HealthProfile;
  useHealthMetrics: boolean;
}
