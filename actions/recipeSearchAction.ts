"use server";

import { SPOONACULAR_ROOT_URL_COMPLEX_SEARCH } from "@/lib/spoonacularRootURL";
import {
  RecipeSearchQuery,
  RecipeSearchState,
  SpoonacularRecipes,
} from "@/lib/types/recipe-search";

function mapStatusToMessage(status: number): string {
  switch (status) {
    case 401:
      return "Authentication with recipe service failed.";
    case 402:
      return "Recipe service quota exceeded.";
    case 429:
      return "Too many requests. Please try again shortly.";
    case 500:
    case 502:
    case 503:
      return "Recipe service is temporarily unavailable.";
    default:
      return "Unable to fetch recipes right now.";
  }
}

export const recipeSearchAction = async (
  prevState: RecipeSearchState,
  formData: FormData,
): Promise<RecipeSearchState> => {
  const query = formData.get("query") as string;
  if (!query) {
    return {
      status: "error",
      query: "",
      result: [],
      error: "Query is required",
    };
  }
  const apiKey = process.env.SPOONACULAR_API_KEY;
  if (!apiKey) {
    return {
      status: "error",
      query,
      result: [],
      error: "Currently not processing searches",
    };
  }
  try {
    const url = new URL(SPOONACULAR_ROOT_URL_COMPLEX_SEARCH);
    url.searchParams.set("apiKey", apiKey);
    url.searchParams.set("query", query);
    url.searchParams.set("number", process.env.DEFAULT_SEARCH_LIMIT as string);
    url.searchParams.set("addRecipeInformation", "true");

    const response = await fetch(url.toString(), {
      next: {
        revalidate: 60 * 30,
        tags: [`spoon:search:${query.toLocaleLowerCase()}`],
      },
    });

    if (!response.ok) {
      let body = "";
      try {
        body = await response.text();
      } catch {}

      console.error("Spoonacular request failed", {
        status: response.status,
        finalUrl: response.url,
        body: body.slice(0, 300),
      });

      return {
        status: "error",
        query,
        result: [],
        error: mapStatusToMessage(response.status),
      };
    }

    const data = (await response.json()) as SpoonacularRecipes;

    const result: RecipeSearchQuery[] = (data.results ?? []).map((recipe) => ({
      id: recipe.id.toString(),
      title: recipe.title,
      image: recipe.image,
      readyInMinutes: recipe.readyInMinutes,
      healthScore: recipe.healthScore,
      dishTypes: recipe.dishTypes,
    }));

    if (result.length === 0) {
      return {
        status: "done",
        query,
        result: [],
        error: `No recipes found for "${query}"`,
      };
    }

    return { status: "done", query, result, error: undefined };
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : typeof error === "string"
          ? error
          : "Unknown error";
    return {
      status: "error",
      query,
      result: [],
      error: message,
    };
  }
};
