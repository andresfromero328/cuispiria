import { getMealPlanData } from "@/actions/getMealPlanAction";
import { auth } from "@/auth";
import LockedContent from "@/components/pages/home/mealPlanningOverview/LockedContent";
import MealPlanningOverview from "@/components/pages/home/mealPlanningOverview/MealPlanningOverview";
import PopularRecipes from "@/components/pages/home/popularMeals/PopularRecipes";
import { endOfWeek, startOfWeek, toDateISO } from "@/lib/calendar/helpers";
import { SPOONACULAR_ROOT_URL_COMPLEX_SEARCH } from "@/lib/spoonacularRootURL";
import { RecipeOverviewCard, SpoonacularRecipes } from "@/types/recipeTypes";

const fetchPopularRecipes = async () => {
  const apiKey = process.env.SPOONACULAR_API_KEY;
  if (!apiKey) {
    return { recipes: [] as RecipeOverviewCard[], totalRecipes: 0 };
  }
  const limit = Number(process.env.DEFAULT_SEARCH_LIMIT ?? 12);

  const url = new URL(SPOONACULAR_ROOT_URL_COMPLEX_SEARCH);
  url.searchParams.set("apiKey", apiKey);
  url.searchParams.set("sort", "popularity");
  url.searchParams.set("number", String(limit / 2));
  url.searchParams.set("addRecipeInformation", "true");

  const response = await fetch(url.toString(), {
    next: { revalidate: 60 * 30, tags: [`spoon:home`] },
  });

  if (!response.ok) {
    return {
      recipes: [] as RecipeOverviewCard[],
      totalRecipes: 0,
    };
  }

  const data = (await response.json()) as SpoonacularRecipes;

  const recipes: RecipeOverviewCard[] = (data.results ?? []).map((recipe) => ({
    id: recipe.id.toString(),
    title: recipe.title,
    image: recipe.image,
    readyInMinutes: recipe.readyInMinutes,
    healthScore: recipe.healthScore,
    aggregateLikes: recipe.aggregateLikes,
    dishTypes: recipe.dishTypes,
  }));

  return {
    recipes,
    totalRecipes: typeof data.totalResults === "number" ? data.totalResults : 0,
  };
};

export default async function Home() {
  const session = await auth();
  const { recipes } = await fetchPopularRecipes();

  const today = toDateISO(new Date());
  const start = toDateISO(startOfWeek(new Date()));
  const end = toDateISO(endOfWeek(new Date()));
  const plannedMeals = await getMealPlanData(session?.userID, start, end);

  return (
    <main className="w-full max-w-7xl mx-auto flex-1 flex flex-col gap-5">
      <PopularRecipes recipes={recipes} />

      <div className="relative">
        <div className="line-break mt-0" />
      </div>

      {session ? (
        <MealPlanningOverview
          plannedMeals={plannedMeals}
          today={today}
          start={start}
          end={end}
        />
      ) : (
        <LockedContent />
      )}
    </main>
  );
}
