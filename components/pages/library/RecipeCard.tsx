"use client";

import { deleteLibraryRecipe } from "@/actions/deleteRecipeAction";
import { Button } from "@/components/ui/button";
import { SavedRecipeType } from "@/types/recipeTypes";
import { CookingPot, Star, Clock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useTransition } from "react";
import AddMealPopOver from "../../shared/AddMealPopOver";
import { addMealToPlan } from "@/actions/addMealToPlanAction";

interface Props {
  recipe: SavedRecipeType;
}

function RatingPill({ rating }: { rating: number }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border bg-background/60 px-2.5 py-1 text-xs shadow-sm">
      <Star size={14} className="opacity-80" />
      <span className="tabular-nums font-medium">{rating}</span>
    </span>
  );
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function HealthPill({ score }: { score: number }) {
  const s = clamp(score, 0, 100);
  const label = s >= 85 ? "Great" : s >= 70 ? "Good" : s >= 50 ? "Okay" : "Low";

  return (
    <span className="inline-flex items-center gap-2 rounded-full border bg-background/60 px-2.5 py-1 text-xs shadow-sm">
      <span className="font-semibold">Health</span>
      <span className="tabular-nums font-medium">{s}</span>
      <span className="text-muted-foreground">({label})</span>
    </span>
  );
}

export async function onAddMeal(
  recipe: SavedRecipeType | undefined,
  dateISO: Date,
  time24h: string,
) {
  if (!recipe) return;
  await addMealToPlan({
    userID: recipe.userID,
    recipe,
    dateISO,
    time24h,
  });
}

const RecipeCard = ({ recipe }: Props) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const currDate = new Date();

  const handleRemoveRecipe = () => {
    startTransition(async () => {
      const result = await deleteLibraryRecipe({
        userID: recipe.userID,
        savedRecipeId: recipe.recipeID,
      });
      if (!result.ok) {
        console.error("Failed to remove recipe:", result.reason);
        return;
      }
      router.refresh();
    });
  };

  const href =
    recipe.type === "saved"
      ? `/recipe-search/${recipe.recipeID}`
      : `/library/${recipe.recipeID}`;

  const dishType = recipe.dishTypes?.[0] || "Unknown Type";

  return (
    <div className="group relative flex h-full flex-col overflow-hidden rounded-xl border bg-background shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      {/* clickable content */}
      <Link href={href} className="block">
        {/* image */}
        <div className="relative aspect-16/10 w-full overflow-hidden bg-muted">
          {recipe.image ? (
            <Image
              src={recipe.image}
              alt={recipe.title}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover transition duration-300 group-hover:scale-[1.03]"
              priority={false}
            />
          ) : (
            <div className="absolute inset-0 grid place-items-center bg-linear-to-br from-muted to-background">
              <CookingPot className="opacity-70" />
            </div>
          )}
        </div>

        {/* content */}
        <div className="flex flex-1 flex-col gap-3 p-4">
          <div className="space-y-1.5">
            <p className="line-clamp-2 text-base font-semibold leading-snug md:text-[1.05rem]">
              {recipe.title}
            </p>

            <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <Clock size={14} className="opacity-70" />
                <span className="font-semibold text-foreground tabular-nums">
                  {recipe.readyInMinutes}
                </span>
                <span>min</span>
              </span>

              <span className="opacity-60">•</span>

              <span className="inline-flex items-center gap-1">
                <span className="font-semibold text-foreground">
                  {dishType}
                </span>
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <HealthPill score={recipe.healthScore} />
            <RatingPill rating={recipe.aggregateLikes} />
          </div>
        </div>
      </Link>

      {/* footer actions */}
      <div className="mt-auto flex items-center gap-2 border-t bg-background/40 p-3 backdrop-blur">
        <AddMealPopOver
          defaultDayISO={currDate}
          onAdd={(r, dateISO, time24h) => onAddMeal(r, dateISO, time24h)}
          recipe={recipe}
        />

        {recipe.type === "custom" && (
          <Button variant="outline" className="h-9 rounded-lg px-3 text-sm">
            Edit
          </Button>
        )}

        <Button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleRemoveRecipe();
          }}
          variant="outline"
          disabled={isPending}
          className="ml-auto h-9 rounded-lg px-3 text-sm cursor-pointer"
        >
          {isPending ? "Removing..." : "Remove"}
        </Button>
      </div>
    </div>
  );
};

export default RecipeCard;
