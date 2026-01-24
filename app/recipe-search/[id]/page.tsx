import { SpoonacularRecipeInfo } from "@/lib/types/recipe-search";
import Image from "next/image";
import Link from "next/link";
import { BsAlarmFill } from "react-icons/bs";
import { FaStar } from "react-icons/fa";

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

    // throw here so you can use error boundaries or `notFound()`
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
  return url.replace(/-\d+x\d+(?=\.\w+$)/, "-636x393"); // bigger common size
  // or try: "-312x231", "-480x360", "-636x393"
}

function pickNutrient(
  nutrition: SpoonacularRecipeInfo["nutrition"] | undefined,
  name: "Calories" | "Protein" | "Carbohydrates" | "Fat",
) {
  return nutrition?.nutrients?.find((n) => n.name === name);
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border bg-background px-2.5 py-1 text-xs text-muted-foreground shadow-sm">
      {children}
    </span>
  );
}

function SectionCard({
  title,
  children,
  right,
}: {
  title: string;
  children: React.ReactNode;
  right?: React.ReactNode;
}) {
  return (
    <section className="rounded-lg border bg-background shadow-sm">
      <div className="flex items-center justify-between gap-3 border-b px-4 py-3">
        <h3 className="text-sm font-semibold">{title}</h3>
        {right}
      </div>
      <div className="p-4">{children}</div>
    </section>
  );
}

function PremiumLock({ label }: { label: string }) {
  return (
    <div className="rounded-lg border bg-muted/40 p-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium">{label}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Unlock advanced nutrition insights (micros, glycemic load,
            ingredient contribution).
          </p>
        </div>
        <button className="btn shrink-0 rounded-md border bg-background px-3 py-1.5 text-xs shadow-sm hover-anim">
          Upgrade
        </button>
      </div>
    </div>
  );
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
    <div className="relative overflow-hidden rounded-2xl border bg-muted shadow-sm">
      {/* blurred backdrop */}
      <div className="absolute inset-0">
        <Image
          src={src}
          alt=""
          fill
          aria-hidden
          sizes="(min-width: 1024px) 768px, 100vw"
          className="object-cover scale-110 blur-2xl opacity-60"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/25 via-black/0" />
      </div>

      {/* foreground */}
      <div className="relative aspect-4/3">
        <Image
          src={src}
          alt={alt}
          fill
          priority
          quality={85}
          sizes="(min-width: 1024px) 768px, 100vw"
          className="object-contain"
        />
      </div>
    </div>
  );
}

const RecipePage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const recipe = await getData(id);
  const image = upgradeSpoonacularImage(recipe.image);
  const cal = pickNutrient(recipe.nutrition, "Calories");
  const protein = pickNutrient(recipe.nutrition, "Protein");
  const carbs = pickNutrient(recipe.nutrition, "Carbohydrates");
  const fat = pickNutrient(recipe.nutrition, "Fat");

  return (
    <main className="w-full max-w-7xl mx-auto flex-1 px-4 sm:px-6 lg:px-8 py-6 space-y-5">
      {/* Top bar / breadcrumbs */}
      <div className="flex items-center justify-between gap-3">
        <Link
          href="/recipe-search"
          className="text-sm text-muted-foreground hover:text-foreground hover-anim"
        >
          ← Back to Search
        </Link>

        <div className="flex items-center gap-2">
          <button className="btn rounded-md border bg-background px-3 py-1.5 text-xs shadow-sm hover-anim">
            Save
          </button>
          <button className="btn rounded-md border bg-background px-3 py-1.5 text-xs shadow-sm hover-anim">
            Add to Plan
          </button>
        </div>
      </div>

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
                <span>{Math.round(recipe.healthScore)}</span>
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
        </div>

        {/* Quick macro line (kept simple & premium) */}
        {(cal || protein || carbs || fat) && (
          <p className="text-sm text-muted-foreground">
            {cal ? `🔥 ${Math.round(cal.amount)} ${cal.unit}` : "🔥 —"}
            {"  •  "}
            {protein
              ? `🥩 ${Math.round(protein.amount)}${protein.unit} protein`
              : "🥩 —"}
            {"  •  "}
            {carbs
              ? `🍞 ${Math.round(carbs.amount)}${carbs.unit} carbs`
              : "🍞 —"}
            {"  •  "}
            {fat ? `🧈 ${Math.round(fat.amount)}${fat.unit} fat` : "🧈 —"}
          </p>
        )}
      </header>

      {/* Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left / main */}
        <div className="lg:col-span-2 space-y-5">
          {/* Image (constrained by layout, premium treatment for bad source images) */}
          <div className="w-full max-w-3xl">
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

          {/* Ingredients */}
          <SectionCard
            title="Ingredients"
            right={
              (recipe.extendedIngredients?.length ?? 0) > 0 ? (
                <span className="text-xs text-muted-foreground">
                  {recipe.extendedIngredients!.length} items
                </span>
              ) : null
            }
          >
            {(recipe.extendedIngredients?.length ?? 0) > 0 ? (
              <ul className="space-y-2">
                {recipe.extendedIngredients!.map((ing) => (
                  <li
                    key={ing.id}
                    className="flex items-start justify-between gap-3 rounded-md border bg-background px-3 py-2"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium leading-snug">
                        {ing.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {ing.original}
                      </p>
                    </div>
                    {(typeof ing.amount === "number" || ing.unit) && (
                      <div className="shrink-0 text-xs text-muted-foreground">
                        {typeof ing.amount === "number" ? ing.amount : ""}
                        {ing.unit ? ` ${ing.unit}` : ""}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">
                No ingredient list available.
              </p>
            )}
          </SectionCard>

          {/* Instructions */}
          <SectionCard title="Instructions">
            {recipe.instructions ? (
              <div
                className="prose prose-sm max-w-none prose-p:text-muted-foreground"
                dangerouslySetInnerHTML={{ __html: recipe.instructions }}
              />
            ) : (
              <p className="text-sm text-muted-foreground">
                No instructions available.
              </p>
            )}
          </SectionCard>
        </div>

        {/* Right / sidebar */}
        <aside className="space-y-5">
          {/* Nutrition (keep it restrained + premium-friendly) */}
          <SectionCard title="Nutrition">
            {(recipe.nutrition?.nutrients?.length ?? 0) > 0 ? (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div className="rounded-md border bg-background p-3">
                    <p className="text-xs text-muted-foreground">Calories</p>
                    <p className="text-sm font-semibold">
                      {cal ? `${Math.round(cal.amount)} ${cal.unit}` : "—"}
                    </p>
                  </div>
                  <div className="rounded-md border bg-background p-3">
                    <p className="text-xs text-muted-foreground">Protein</p>
                    <p className="text-sm font-semibold">
                      {protein
                        ? `${Math.round(protein.amount)}${protein.unit}`
                        : "—"}
                    </p>
                  </div>
                  <div className="rounded-md border bg-background p-3">
                    <p className="text-xs text-muted-foreground">Carbs</p>
                    <p className="text-sm font-semibold">
                      {carbs ? `${Math.round(carbs.amount)}${carbs.unit}` : "—"}
                    </p>
                  </div>
                  <div className="rounded-md border bg-background p-3">
                    <p className="text-xs text-muted-foreground">Fat</p>
                    <p className="text-sm font-semibold">
                      {fat ? `${Math.round(fat.amount)}${fat.unit}` : "—"}
                    </p>
                  </div>
                </div>

                {recipe.nutrition?.caloricBreakdown ? (
                  <div className="rounded-md border bg-background p-3">
                    <p className="text-xs text-muted-foreground">
                      Caloric breakdown
                    </p>
                    <p className="mt-1 text-sm">
                      {Math.round(
                        recipe.nutrition.caloricBreakdown.percentProtein,
                      )}
                      % protein •{" "}
                      {Math.round(
                        recipe.nutrition.caloricBreakdown.percentCarbs,
                      )}
                      % carbs •{" "}
                      {Math.round(recipe.nutrition.caloricBreakdown.percentFat)}
                      % fat
                    </p>
                  </div>
                ) : null}

                {/* Premium gate for the noisy stuff */}
                <PremiumLock label="Advanced nutrition" />
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Nutrition info not available.
                </p>
                <PremiumLock label="Advanced nutrition" />
              </div>
            )}
          </SectionCard>

          {/* Wine Pairing */}
          <SectionCard title="Wine pairing">
            {recipe.winePairing ? (
              <div className="space-y-3">
                {recipe.winePairing.pairingText ? (
                  <p className="text-sm text-muted-foreground">
                    {recipe.winePairing.pairingText}
                  </p>
                ) : null}

                {(recipe.winePairing.pairedWines?.length ?? 0) > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {recipe.winePairing.pairedWines.map((w) => (
                      <Chip key={w}>{w}</Chip>
                    ))}
                  </div>
                ) : null}

                {(recipe.winePairing.productMatches?.length ?? 0) > 0 ? (
                  <div className="space-y-2">
                    {recipe.winePairing.productMatches.map((p) => (
                      <div
                        key={p.id}
                        className="rounded-md border bg-background p-3"
                      >
                        <p className="text-sm font-medium leading-snug">
                          {p.title}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {p.price} • {p.ratingCount} ratings •{" "}
                          {Math.round(p.averageRating * 10) / 10}⭐
                        </p>
                        {p.description ? (
                          <p className="mt-2 text-xs text-muted-foreground line-clamp-3">
                            {p.description}
                          </p>
                        ) : null}
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No pairing info available.
              </p>
            )}
          </SectionCard>

          {/* Small “facts” card (keeps right rail feeling complete even with missing data) */}
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
