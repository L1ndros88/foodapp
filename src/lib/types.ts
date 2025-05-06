export interface FoodEntry {
  id: string;
  name: string;
  time: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  scores: {
    overall: number;
    nutrition: number;
    ingredients: number;
    processing: number;
    caloric: number;
  };
  image?: string;
  mealType?: string;
}

export interface MealGroup {
  title: string;
  entries: FoodEntry[];
}

export interface NutritionScore {
  score: number;
  color: string;
  label: string;
  available?: boolean;
}

export interface NutritionFacts {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
  sodium: number;
}

export interface AdditionalInfo {
  storage?: string;
  manufacturer?: string;
  contactInfo?: string;
  countryOfOrigin?: string;
  quantity?: string;
  certifications?: string[];
  cookingInstructions?: string;
}

export interface ScannedProduct {
  name: string;
  image: string;
  overallScore: NutritionScore;
  nutritionScore: NutritionScore;
  processingScore: NutritionScore;
  environmentalScore: NutritionScore;
  nutritionFacts: NutritionFacts;
  ingredients: string | string[];
  allergens: string[];
  barcode?: string;
  additionalInfo?: AdditionalInfo;
}
