"use server";

import { SPOONACULAR_ROOT_URL_COMPLEX_SEARCH } from "@/lib/spoonacularRootURL";
import {
  RecipeOverviewCard,
  RecipeSearchState,
  SpoonacularRecipes,
} from "@/types/recipeTypes";

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
  const intent = (formData.get("intent") as string | null) ?? "search";

  // For "more", we keep using the current query from state if input is missing
  const rawQuery =
    (formData.get("query") as string | null) ?? prevState.query ?? "";
  const query = rawQuery.trim();

  if (!query) {
    return {
      status: "error",
      query: "",
      result: [],
      error: "Query is required",
      offset: 0,
      totalResults: 0,
    };
  }

  const apiKey = process.env.SPOONACULAR_API_KEY;
  if (!apiKey) {
    return {
      status: "error",
      query,
      result: [],
      error: "Currently not processing searches",
      offset: prevState.offset ?? 0,
      totalResults: prevState.totalResults ?? 0,
    };
  }

  const limit = Number(process.env.DEFAULT_SEARCH_LIMIT ?? 12);
  const pageSize = Number.isFinite(limit) && limit > 0 ? limit : 12;

  const offset = intent === "more" ? (prevState.offset ?? 0) + pageSize : 0;

  try {
    const url = new URL(SPOONACULAR_ROOT_URL_COMPLEX_SEARCH);
    url.searchParams.set("apiKey", apiKey);
    url.searchParams.set("query", query);
    url.searchParams.set("number", String(pageSize));
    url.searchParams.set("offset", String(offset));
    url.searchParams.set("addRecipeInformation", "true");

    const response = await fetch(url.toString(), {
      next: {
        revalidate: 60 * 30,
        tags: [`spoon:search:${query.toLowerCase()}`],
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
        result: intent === "more" ? prevState.result : [],
        error: mapStatusToMessage(response.status),
        offset: prevState.offset ?? 0,
        totalResults: prevState.totalResults ?? 0,
      };
    }

    const data = (await response.json()) as SpoonacularRecipes;

    const page: RecipeOverviewCard[] = (data.results ?? []).map((recipe) => ({
      id: recipe.id.toString(),
      title: recipe.title,
      image: recipe.image,
      readyInMinutes: recipe.readyInMinutes,
      healthScore: recipe.healthScore,
      aggregateLikes: recipe.aggregateLikes,
      dishTypes: recipe.dishTypes,
    }));

    const result = intent === "more" ? [...prevState.result, ...page] : page;

    const totalResults =
      typeof data.totalResults === "number"
        ? data.totalResults
        : (prevState.totalResults ?? 0);

    if (intent !== "more" && result.length === 0) {
      return {
        status: "done",
        query,
        result: [],
        error: `No recipes found for "${query}"`,
        offset: 0,
        totalResults,
      };
    }

    if (intent === "more" && page.length === 0) {
      return {
        ...prevState,
        status: "done",
        query,
        error: undefined,
        offset: prevState.offset ?? 0,
        totalResults,
      };
    }

    return {
      status: "done",
      query,
      result,
      error: undefined,
      offset,
      totalResults,
    };
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
      result: intent === "more" ? prevState.result : [],
      error: message,
      offset: prevState.offset ?? 0,
      totalResults: prevState.totalResults ?? 0,
    };
  }
};
