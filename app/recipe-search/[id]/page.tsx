import Image from "next/image";
import { SpoonacularRecipeInfo } from "@/types/recipeTypes";

import Chip from "@/components/pages/search/recipePage/helpers/Chip";
import Nutrition from "@/components/pages/search/recipePage/components/Nutrition";
import RecipeHandles from "@/components/pages/search/recipePage/components/RecipeHandles";
import SectionCard from "@/components/pages/search/recipePage/helpers/SectionCard";
import WinePairing from "@/components/pages/search/recipePage/components/WinePairing";
import { BsAlarmFill } from "react-icons/bs";
import { FaStar } from "react-icons/fa";
import { HeartPulse } from "lucide-react";
import Ingredients from "@/components/pages/search/recipePage/components/Ingredients";
import Instructions from "@/components/pages/search/recipePage/components/Instructions";
import { auth } from "@/auth";
import { SavedRecipe } from "@/models/models";
import { connectDB } from "@/lib/database/mongodb";

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
      return "Unable to fetch recipe right now.";
  }
}

const getData = async (id: string) => {
  const apiKey = process.env.SPOONACULAR_API_KEY;
  if (!apiKey) throw new Error("Missing SPOONACULAR_API_KEY");

  const recipeId = typeof id === "string" ? id.trim() : String(id);
  const url = new URL(
    `https://api.spoonacular.com/recipes/${recipeId}/information`,
  );
  url.searchParams.set("apiKey", apiKey);
  url.searchParams.set("includeNutrition", "true");
  url.searchParams.set("addWinePairing", "true");

  const res = await fetch(url.toString(), {
    next: { revalidate: 60 * 60, tags: [`spoon:recipe:${recipeId}`] },
  });

  if (!res.ok) {
    let body = "";
    try {
      body = await res.text();
    } catch {}

    console.error("Spoonacular recipe info failed", {
      status: res.status,
      recipeId,
      body: body.slice(0, 400),
    });
    throw new Error(mapStatusToMessage(res.status));
  }

  const recipe: SpoonacularRecipeInfo = await res.json();

  return {
    id: recipe.id,
    title: recipe.title,
    image: recipe.image,
    readyInMinutes: recipe.readyInMinutes,
    preparationMinutes: recipe.preparationMinutes,
    cookingMinutes: recipe.cookingMinutes,
    servings: recipe.servings,
    healthScore: recipe.healthScore,
    aggregateLikes: recipe.aggregateLikes,
    summary: recipe.summary,
    instructions: recipe.instructions,
    dishTypes: recipe.dishTypes,
    cuisines: recipe.cuisines,
    diets: recipe.diets,
    winePairing: recipe.winePairing,
    extendedIngredients: recipe.extendedIngredients,
    nutrition: {
      nutrients: recipe.nutrition?.nutrients,
      caloricBreakdown: recipe.nutrition?.caloricBreakdown,
      weightPerServing: recipe.nutrition?.weightPerServing,
    },
  };
};

function upgradeSpoonacularImage(url?: string) {
  if (!url) return url;
  return url.replace(/-\d+x\d+(?=\.\w+$)/, "-636x393");
}

function RecipeImage({ src, alt }: { src?: string; alt: string }) {
  if (!src) {
    return (
      <div className="grid aspect-4/3 place-items-center rounded-2xl border bg-muted text-sm text-muted-foreground">
        No image
      </div>
    );
  }

  return (
    <div className="w-full md:mx-auto md:w-3/4 relative overflow-hidden">
      <div className="relative w-full aspect-4/3 overflow-hidden rounded-sm border-4 border-foreground/75">
        <Image
          src={src}
          alt={alt}
          fill
          priority
          quality={85}
          sizes="(min-width: 768px) 70vw, 100vw"
          className="object-cover "
        />
      </div>
    </div>
  );
}

async function isRecipeSaved(recipeID: number, userID: string | undefined) {
  if (!recipeID || !userID) return false;
  await connectDB();
  const saved = await SavedRecipe.findOne({
    userID,
    recipeID,
  }).lean();

  return Boolean(saved);
}

const RecipePage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const recipe = await getData(id);
  const image = upgradeSpoonacularImage(recipe.image);
  const session = await auth();
  const isSaved = await isRecipeSaved(Number(id), session?.userID);

  return (
    <main className="w-full max-w-7xl mx-auto flex-1 px-4 sm:px-6 lg:px-8 py-6 space-y-5">
      {/* Top bar / breadcrumbs */}
      <RecipeHandles
        userID={session?.userID}
        recipe={recipe}
        isSaved={isSaved}
      />

      {/* Title + meta */}
      <header className="space-y-3">
        <h1 className="text-xl sm:text-2xl font-semibold leading-tight">
          {recipe.title}
        </h1>

        <div className="flex flex-wrap items-center gap-2">
          <Chip>
            <span className="inline-flex items-center gap-2">
              <BsAlarmFill />
              <span>{recipe.readyInMinutes ?? 0} min</span>
            </span>
          </Chip>

          {typeof recipe.servings === "number" && (
            <Chip>{recipe.servings} servings</Chip>
          )}

          {typeof recipe.healthScore === "number" && (
            <Chip>
              <span className="inline-flex items-center gap-2">
                <FaStar />
                <span>{Math.round(recipe.aggregateLikes)}</span>
              </span>
            </Chip>
          )}

          {(recipe.cuisines?.length ?? 0) > 0 && (
            <Chip>{recipe.cuisines!.slice(0, 2).join(" • ")}</Chip>
          )}

          {(recipe.diets?.length ?? 0) > 0 && (
            <Chip>{recipe.diets!.slice(0, 2).join(" • ")}</Chip>
          )}

          {(recipe.dishTypes?.length ?? 0) > 0 && (
            <Chip>{recipe.dishTypes!.slice(0, 2).join(" • ")}</Chip>
          )}

          <Chip>
            <HeartPulse size={18} /> {recipe.healthScore}
          </Chip>
        </div>
      </header>

      {/* Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left / main */}
        <div className="lg:col-span-2 space-y-5">
          {/* Image */}
          <div className="relative w-full md:p-8 shadow-inner rounded-xl">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 hidden md:block opacity-50"
              style={{
                backgroundImage: "url('/background.svg')",
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
              }}
            />
            <RecipeImage src={image || recipe.image} alt={recipe.title} />
          </div>

          {/* Summary */}
          {recipe.summary ? (
            <SectionCard title="Overview">
              {/* Spoonacular summary often includes HTML */}
              <div
                className="prose prose-sm max-w-none prose-p:text-muted-foreground"
                dangerouslySetInnerHTML={{ __html: recipe.summary }}
              />
            </SectionCard>
          ) : null}
          <Ingredients ingredients={recipe.extendedIngredients ?? []} />
          <Instructions instructions={recipe.instructions} />
        </div>

        {/* Sidebar */}
        <aside className="space-y-5">
          <Nutrition nutritionInfo={recipe.nutrition} />
          <WinePairing wines={recipe.winePairing} />

          {/* Small “facts” */}
          <SectionCard title="Details">
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between gap-3">
                <span className="text-muted-foreground">Ready in</span>
                <span className="font-medium">
                  {recipe.readyInMinutes ?? 0} min
                </span>
              </div>
              {recipe.preparationMinutes != null ? (
                <div className="flex items-center justify-between gap-3">
                  <span className="text-muted-foreground">Prep</span>
                  <span className="font-medium">
                    {recipe.preparationMinutes} min
                  </span>
                </div>
              ) : null}
              {recipe.cookingMinutes != null ? (
                <div className="flex items-center justify-between gap-3">
                  <span className="text-muted-foreground">Cook</span>
                  <span className="font-medium">
                    {recipe.cookingMinutes} min
                  </span>
                </div>
              ) : null}
              {typeof recipe.servings === "number" ? (
                <div className="flex items-center justify-between gap-3">
                  <span className="text-muted-foreground">Servings</span>
                  <span className="font-medium">{recipe.servings}</span>
                </div>
              ) : null}
            </div>
          </SectionCard>
        </aside>
      </div>
    </main>
  );
};

export default RecipePage;
