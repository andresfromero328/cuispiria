import React from "react";

import RecipeSearch from "@/components/pages/search/RecipeSearch";
import {
  initialState,
  RecipeSearchQuery,
  RecipeSearchState,
  SpoonacularRecipes,
} from "@/types/recipeTypes";
import { SPOONACULAR_ROOT_URL_COMPLEX_SEARCH } from "@/lib/spoonacularRootURL";

export async function fetchRecipesForQuery(query: string, offset: number) {
  const apiKey = process.env.SPOONACULAR_API_KEY;
  if (!apiKey) {
    return { result: [] as RecipeSearchQuery[], offset: 0, totalResults: 0 };
  }

  const q = query.trim();
  if (!q)
    return { result: [] as RecipeSearchQuery[], offset: 0, totalResults: 0 };

  const limit = Number(process.env.DEFAULT_SEARCH_LIMIT ?? 12);
  const pageSize = Number.isFinite(limit) && limit > 0 ? limit : 12;

  const safeOffset = Number.isFinite(offset) && offset >= 0 ? offset : 0;

  const url = new URL(SPOONACULAR_ROOT_URL_COMPLEX_SEARCH);
  url.searchParams.set("apiKey", apiKey);
  url.searchParams.set("query", q);
  url.searchParams.set("number", String(pageSize));
  url.searchParams.set("offset", String(safeOffset));
  url.searchParams.set("addRecipeInformation", "true");

  const response = await fetch(url.toString(), {
    next: { revalidate: 60 * 30, tags: [`spoon:search:${q.toLowerCase()}`] },
  });

  if (!response.ok) {
    return {
      result: [] as RecipeSearchQuery[],
      offset: safeOffset,
      totalResults: 0,
    };
  }

  const data = (await response.json()) as SpoonacularRecipes;

  const result: RecipeSearchQuery[] = (data.results ?? []).map((recipe) => ({
    id: recipe.id.toString(),
    title: recipe.title,
    image: recipe.image,
    readyInMinutes: recipe.readyInMinutes,
    healthScore: recipe.healthScore,
    aggregateLikes: recipe.aggregateLikes,
    dishTypes: recipe.dishTypes,
  }));

  return {
    result,
    offset: typeof data.offset === "number" ? data.offset : safeOffset,
    totalResults: typeof data.totalResults === "number" ? data.totalResults : 0,
  };
}

const RecipeSearchPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; o?: string }>;
}) => {
  const { q, o } = await searchParams;

  const query = (q ?? "").trim();

  const parsed = Number(o ?? "0");
  const offset = Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;

  const { result, totalResults } = query
    ? await fetchRecipesForQuery(query, offset)
    : { result: [], totalResults: 0 };

  const preloaded: RecipeSearchState = query
    ? {
        status: result.length ? "done" : "error",
        query,
        result,
        offset,
        totalResults,
        error:
          result.length === 0 ? `No recipes found for "${query}"` : undefined,
      }
    : initialState;

  return (
    <main className="w-full max-w-7xl mx-auto flex-1 flex flex-col gap-5">
      <section className="flex flex-col gap-5 px-4 py-2">
        <header>
          <h2>Search Recipes</h2>
          <small>Discover recipes to help you plan your next meals.</small>
        </header>

        <RecipeSearch preloaded={preloaded} />
      </section>
    </main>
  );
};

export default RecipeSearchPage;
