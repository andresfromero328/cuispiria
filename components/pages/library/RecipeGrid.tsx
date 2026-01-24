import { RecipePreview } from "@/app/library/page";
import React from "react";
import RecipeCard from "./RecipeCard";

interface Props {
  items: RecipePreview[];
}

const RecipeGrid = ({ items }: Props) => {
  if (items.length === 0) {
    return (
      <div className="border bg-background shadow-sm p-6 rounded-md">
        <h4 className="font-medium">Nothing here yet</h4>
        <p className="mt-1 text-sm text-muted-foreground">
          Try saving recipes from Search or create a custom recipe.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((r) => (
        <RecipeCard key={r.id} recipe={r} />
      ))}
    </div>
  );
};

export default RecipeGrid;
