export interface RecipeSearchQuery {
  id: string;
  title: string;
  image?: string;
  readyInMinutes: number;
  healthScore: number;
  dishTypes?: string[];
}

export interface RecipeSearchState {
  status: "idle" | "searching" | "done" | "error";
  query: string;
  result: RecipeSearchQuery[];
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
  results: RecipeSearchQuery[];
  offset: number;
  number: number;
  totalResults: number;
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
  summary?: string;
  instructions?: string;
  dishTypes?: string[];
  cuisines?: string[];
  diets?: string[];
  winePairing?: {
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
  };
  extendedIngredients?:
    | Array<{
        id: number;
        name: string;
        original: string;
        amount?: number;
        unit?: string;
      }>
    | undefined;
  nutrition?: {
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
  };
}
