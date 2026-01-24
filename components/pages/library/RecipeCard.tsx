import { RecipePreview } from "@/app/library/page";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import Link from "next/link";
import React from "react";

interface Props {
  recipe: RecipePreview;
}

function RatingPill({ rating }: { rating: number }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs">
      <Star size={14} className="opacity-80" />
      <span className="tabular-nums">{rating.toFixed(1)}</span>
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
    <span className="inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-xs">
      <span className="font-medium">Health</span>
      <span className="tabular-nums">{s}</span>
      <span className="text-muted-foreground">({label})</span>
    </span>
  );
}

const RecipeCard = ({ recipe }: Props) => {
  return (
    <Link
      href={`/library/${recipe.id}`}
      className="overflow-hidden rounded-lg border bg-background shadow-sm hover-anim"
    >
      {/* Image */}
      <div className="h-45 w-full bg-muted flex items-center justify-center text-xs text-muted-foreground">
        {recipe.imageUrl ? "[image]" : "[image]"}
      </div>

      {/* Content */}
      <div className="flex flex-col gap-2 p-3">
        {/* Title */}
        <p className="font-medium">{recipe.title}</p>

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <span className="font-medium text-foreground tabular-nums">
              {recipe.prepMinutes}
            </span>
            <span>min</span>
          </span>

          <span className="text-muted-foreground">•</span>

          <span className="inline-flex items-center gap-1">
            <span className="font-medium text-foreground">
              {recipe.mealType}
            </span>
          </span>

          <span className="text-muted-foreground">•</span>

          <span className="inline-flex items-center gap-1">
            <span className="font-medium text-foreground">
              {recipe.source === "custom" ? "Custom" : "Saved"}
            </span>
          </span>
        </div>

        {/* Scores */}
        <div className="flex flex-wrap items-center gap-2">
          <HealthPill score={recipe.healthScore} />
          {/* Rating is ONLY rendered if present (custom recipes won't show anything) */}
          {typeof recipe.rating === "number" && (
            <RatingPill rating={recipe.rating} />
          )}
        </div>

        {/* Footer actions */}
        <div className="mt-1 flex items-center gap-2">
          <Button className="cursor-pointer" variant="ghost">
            View
          </Button>
          <Button className="cursor-pointer" variant="outline">
            Add to Plan
          </Button>

          {/* Optional: only show Edit for custom */}
          {recipe.source === "custom" && (
            <Button className="btn" variant="outline">
              Edit
            </Button>
          )}
        </div>
      </div>
    </Link>
  );
};

export default RecipeCard;
