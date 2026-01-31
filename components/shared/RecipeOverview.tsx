import { RecipeOverviewCard } from "@/types/recipeTypes";
import { Clock, CookingPot, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

interface Props {
  recipe: RecipeOverviewCard;
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

function RatingPill({ rating }: { rating: number }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border bg-background/60 px-2.5 py-1 text-xs shadow-sm">
      <Star size={14} className="opacity-80" />
      <span className="tabular-nums font-medium">{rating}</span>
    </span>
  );
}

const RecipeOverview = ({ recipe }: Props) => {
  const dishType = recipe.dishTypes?.[0] || "Unknown Type";

  return (
    <Link
      href={`/recipe-search/${recipe.id}`}
      className="group relative flex h-full flex-col overflow-hidden rounded-xl border bg-background shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
    >
      {/* Image */}
      <div className="relative aspect-16/10 w-full overflow-hidden bg-muted">
        {recipe.image ? (
          <Image
            src={recipe.image}
            alt={recipe.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover object-center transition duration-300 group-hover:scale-[1.02]"
          />
        ) : (
          <div className="absolute inset-0 grid place-items-center bg-linear-to-br from-muted to-background">
            <CookingPot className="opacity-70" />
          </div>
        )}

        {/* Top-left badge (optional but matches RecipeCard vibe) */}
        {/* <div className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full border bg-background/80 px-2.5 py-1 text-xs shadow-sm backdrop-blur">
          <UtensilsCrossed size={14} className="opacity-80" />
          <span className="font-medium">Recipe</span>
        </div> */}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-3 p-4">
        {/* Meta row */}
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
            <span className="font-semibold text-foreground">{dishType}</span>
          </span>

          {/* push rating to the right on wider cards */}
          <span className="ml-auto">
            <RatingPill rating={recipe.aggregateLikes} />
          </span>
        </div>

        {/* Title */}
        <p className="line-clamp-2 text-base font-semibold leading-snug md:text-[1.05rem]">
          {recipe.title}
        </p>

        {/* Bottom pills */}
        <div className="mt-auto flex flex-wrap items-center gap-2">
          <HealthPill score={recipe.healthScore} />
        </div>
      </div>
    </Link>
  );
};

export default RecipeOverview;
