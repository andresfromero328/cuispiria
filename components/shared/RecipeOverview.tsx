import { RecipeSearchQuery } from "@/lib/types/recipe-search";
import { Clock, CookingPot, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

interface Props {
  recipe: RecipeSearchQuery;
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function HealthPill({ score }: { score: number }) {
  const s = clamp(score, 0, 100);
  const label = s >= 85 ? "Great" : s >= 70 ? "Good" : s >= 50 ? "Okay" : "Low";

  return (
    <span className="inline-flex items-center gap-2 rounded-full ui-border-soft px-2 py-0.5 shrink-0">
      <small className="font-medium">Health</small>
      <small className="tabular-nums">{s}</small>
      <small className="text-muted-foreground">({label})</small>
    </span>
  );
}

const RecipeOverview = ({ recipe }: Props) => {
  return (
    <Link
      href={`recipe-search/${recipe.id}`}
      className="flex flex-col overflow-hidden rounded-lg border bg-background shadow-sm hover-anim"
    >
      <div className="h-45 w-full bg-muted flex items-center justify-center text-xs text-muted-foreground">
        {recipe.image ? (
          <Image
            src={recipe.image}
            alt={recipe.title}
            width={300}
            height={200}
            quality={100}
            className="h-45 w-full object-cover"
          />
        ) : (
          <CookingPot size={20} />
        )}
      </div>

      <div className="flex flex-col gap-1.5 p-3 min-w-0 flex-1">
        <div className="flex items-center justify-between text-muted-foreground">
          <div className="flex items-center gap-2">
            <Clock size={14} />
            <small>{recipe.readyInMinutes} min</small>
          </div>
          <div className="flex items-center gap-2">
            <Star size={14} />
            <small>{recipe.healthScore}</small>
          </div>
        </div>

        <h3>{recipe.title}</h3>

        <div className="flex items-center gap-2 mt-auto">
          <small className="rounded-full ui-border-soft px-2 py-0.5 shrink-0">
            {recipe.dishTypes?.[0] || "Unknown Type"}
          </small>
          <HealthPill score={recipe.healthScore} />
        </div>
      </div>
    </Link>
  );
};

export default RecipeOverview;
