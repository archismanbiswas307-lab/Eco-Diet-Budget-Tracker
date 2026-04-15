import { Vegetable } from "../types";

export const MOCK_VEGETABLES: Vegetable[] = [
  { 
    name: "Spinach (Palak)", 
    pricePerKg: 40, 
    caloriesPer100g: 23, 
    proteinPer100g: 2.9, 
    fiberPer100g: 2.2, 
    season: ["Winter", "Spring"],
    purchaseUrl: "https://www.bigbasket.com/ps/?q=spinach",
    discountPercentage: 15
  },
  { 
    name: "Broccoli", 
    pricePerKg: 120, 
    caloriesPer100g: 34, 
    proteinPer100g: 2.8, 
    fiberPer100g: 2.6, 
    season: ["Winter"],
    purchaseUrl: "https://www.bigbasket.com/ps/?q=broccoli",
    discountPercentage: 10
  },
  { 
    name: "Carrots", 
    pricePerKg: 40, 
    caloriesPer100g: 41, 
    proteinPer100g: 0.9, 
    fiberPer100g: 2.8, 
    season: ["Winter"],
    purchaseUrl: "https://www.bigbasket.com/ps/?q=carrot"
  },
  { 
    name: "Potatoes (Aloo)", 
    pricePerKg: 25, 
    caloriesPer100g: 77, 
    proteinPer100g: 2.0, 
    fiberPer100g: 2.2, 
    season: ["Year-round"],
    purchaseUrl: "https://www.bigbasket.com/ps/?q=potato",
    discountPercentage: 5
  },
  { 
    name: "Tomatoes", 
    pricePerKg: 30, 
    caloriesPer100g: 18, 
    proteinPer100g: 0.9, 
    fiberPer100g: 1.2, 
    season: ["Year-round"],
    purchaseUrl: "https://www.bigbasket.com/ps/?q=tomato"
  },
  { 
    name: "Cabbage", 
    pricePerKg: 30, 
    caloriesPer100g: 25, 
    proteinPer100g: 1.3, 
    fiberPer100g: 2.5, 
    season: ["Winter"],
    purchaseUrl: "https://www.bigbasket.com/ps/?q=cabbage",
    discountPercentage: 20
  },
  { 
    name: "Okra (Bhindi)", 
    pricePerKg: 60, 
    caloriesPer100g: 33, 
    proteinPer100g: 1.9, 
    fiberPer100g: 3.2, 
    season: ["Summer", "Monsoon"],
    purchaseUrl: "https://www.bigbasket.com/ps/?q=okra"
  },
  { 
    name: "Onions", 
    pricePerKg: 35, 
    caloriesPer100g: 40, 
    proteinPer100g: 1.1, 
    fiberPer100g: 1.7, 
    season: ["Year-round"],
    purchaseUrl: "https://www.bigbasket.com/ps/?q=onion"
  },
  { 
    name: "Cauliflower (Gobi)", 
    pricePerKg: 40, 
    caloriesPer100g: 25, 
    proteinPer100g: 1.9, 
    fiberPer100g: 2.0, 
    season: ["Winter"],
    purchaseUrl: "https://www.bigbasket.com/ps/?q=cauliflower",
    discountPercentage: 12
  },
];

export const BUDGET_RESOURCES = [
  {
    name: "Blinkit",
    url: "https://blinkit.com",
    description: "Quick 10-minute grocery delivery for urgent needs.",
    category: "Grocery"
  },
  {
    name: "JioMart",
    url: "https://www.jiomart.com",
    description: "Great discounts on bulk groceries and household items.",
    category: "Grocery"
  },
  {
    name: "Zepto",
    url: "https://www.zeptonow.com",
    description: "Fast delivery with competitive pricing on fresh produce.",
    category: "Grocery"
  },
  {
    name: "Paisabazaar",
    url: "https://www.paisabazaar.com",
    description: "Compare credit cards, loans, and track credit score.",
    category: "Budgeting"
  },
  {
    name: "ClearTax",
    url: "https://cleartax.in",
    description: "Easy tax filing and investment planning for Indians.",
    category: "Investment"
  },
  {
    name: "Value Research",
    url: "https://www.valueresearchonline.com",
    description: "Best platform for mutual fund research and tracking.",
    category: "Investment"
  }
];
