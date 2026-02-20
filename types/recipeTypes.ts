export interface RecipeOverviewCard {
  id: string;
  title: string;
  image?: string;
  readyInMinutes: number;
  healthScore: number;
  aggregateLikes: number;
  dishTypes?: string[];
}

export interface RecipeSearchState {
  status: "idle" | "searching" | "done" | "error";
  query: string;
  result: RecipeOverviewCard[];
  error?: string;
  offset?: number;
  totalResults?: number;
}

export const initialState: RecipeSearchState = {
  status: "idle",
  query: "",
  result: [],
  error: undefined,
  offset: 0,
  totalResults: 0,
};

export interface SpoonacularRecipes {
  results: RecipeOverviewCard[];
  offset: number;
  number: number;
  totalResults: number;
}

export interface WinePairing {
  pairedWines: string[];
  pairingText: string;
  productMatches: Array<{
    id: number;
    title: string;
    averageRating: number;
    description?: string;
    price: string;
    imageUrl: string;
    ratingCount: number;
    score: number;
    link: string;
  }>;
}

export interface Nutrition {
  nutrients:
    | Array<{
        name: string;
        amount: number;
        unit: string;
        percentOfDailyNeeds?: number;
      }>
    | undefined;
  caloricBreakdown?:
    | {
        percentProtein: number;
        percentFat: number;
        percentCarbs: number;
      }
    | undefined;
  weightPerServing?:
    | {
        amount: number;
        unit: string;
      }
    | undefined;
}

export interface IngredientMeasures {
  us: {
    amount: number;
    unitShort: string;
    unitLong: string;
  };
  metric: {
    amount: number;
    unitShort: string;
    unitLong: string;
  };
}

export interface Ingredients {
  id: number;
  name: string;
  original: string;
  amount?: number;
  unit?: string;
  measures: {
    us: {
      amount: number;
      unitShort: string;
      unitLong: string;
    };
    metric: {
      amount: number;
      unitShort: string;
      unitLong: string;
    };
  };
}

export interface SpoonacularRecipeInfo {
  id: number;
  title: string;
  image?: string;
  readyInMinutes?: number;
  preparationMinutes?: number | null;
  cookingMinutes?: number | null;
  servings?: number;
  healthScore?: number;
  aggregateLikes: number;
  summary?: string;
  instructions?: string;
  dishTypes?: string[];
  cuisines?: string[];
  diets?: string[];
  winePairing?: WinePairing;
  extendedIngredients?: Array<Ingredients> | undefined;
  nutrition?: Nutrition;
}

export interface SavedRecipeType {
  userID: string;
  recipeID: number;
  image?: string | null;
  title: string;
  readyInMinutes: number;
  dishTypes?: string[];
  aggregateLikes: number;
  healthScore: number;
  type: "saved" | "custom";
  macros: {
    protein: number;
    carbs: number;
    fat: number;
    calories: number;
  };
  ingredients: Ingredients[];
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Snapshot of a recipe at the time it is added to a meal plan.
 * This is NOT SavedRecipeType — it is a frozen copy.
 */
export interface MealRecipeSnapshot {
  recipeID: number;
  type: "saved" | "custom";

  title: string;
  image: string;
  readyInMinutes: number;
  dishTypes: string[];

  macros: {
    protein: number;
    carbs: number;
    fat: number;
    calories: number;
  };

  ingredients: Ingredients[];

  aggregateLikes?: number;
  healthScore?: number;
}

export interface MealPlanMeal {
  _id?: string;
  time24h: string;
  dateTime: Date;
  recipe: MealRecipeSnapshot;
}

export interface MealPlanDay {
  _id?: string;
  userID: string;
  dayISO: string;
  meals: MealPlanMeal[];
  createdAt?: Date;
  updatedAt?: Date;
}
