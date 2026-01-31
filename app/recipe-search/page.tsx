import React from "react";
import RecipeSearch from "@/components/pages/search/RecipeSearch";
import {
  initialState,
  RecipeOverviewCard,
  RecipeSearchState,
  SpoonacularRecipes,
} from "@/types/recipeTypes";
import { SPOONACULAR_ROOT_URL_COMPLEX_SEARCH } from "@/lib/spoonacularRootURL";

export async function fetchRecipesForQuery(query: string) {
  const apiKey = process.env.SPOONACULAR_API_KEY;
  if (!apiKey) return { result: [], totalResults: 0 };

  const q = query.trim();
  if (!q) return { result: [], totalResults: 0 };

  const limit = Number(process.env.DEFAULT_SEARCH_LIMIT);

  const url = new URL(SPOONACULAR_ROOT_URL_COMPLEX_SEARCH);
  url.searchParams.set("apiKey", apiKey);
  url.searchParams.set("query", q);
  url.searchParams.set("number", String(limit));
  url.searchParams.set("addRecipeInformation", "true");

  const response = await fetch(url.toString(), {
    next: { revalidate: 60 * 30, tags: [`spoon:search:${q.toLowerCase()}`] },
  });

  if (!response.ok) return { result: [], totalResults: 0 };

  const data = (await response.json()) as SpoonacularRecipes;

  const result: RecipeOverviewCard[] = (data.results ?? []).map((r) => ({
    id: r.id.toString(),
    title: r.title,
    image: r.image,
    readyInMinutes: r.readyInMinutes,
    healthScore: r.healthScore,
    aggregateLikes: r.aggregateLikes,
    dishTypes: r.dishTypes,
  }));

  return {
    result,
    totalResults: data.totalResults ?? 0,
  };
}

const RecipeSearchPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) => {
  const { q } = await searchParams;
  const query = (q ?? "").trim();

  const { result, totalResults } = query
    ? await fetchRecipesForQuery(query)
    : { result: [], totalResults: 0 };

  const preloaded: RecipeSearchState = query
    ? {
        status: result.length ? "done" : "error",
        query,
        result,
        totalResults,
        error:
          result.length === 0 ? `No recipes found for "${query}"` : undefined,
        offset: 0,
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
