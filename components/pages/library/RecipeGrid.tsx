import React from "react";
import RecipeCard from "./RecipeCard";
import { SavedRecipeType } from "@/types/recipeTypes";

interface Props {
  items: SavedRecipeType[];
}

const RecipeGrid = ({ items }: Props) => {
  if (items.length === 0) {
    return (
      <div className="p-6 rounded-md border border-dashed">
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
        <RecipeCard key={r.recipeID} recipe={r} />
      ))}
    </div>
  );
};

export default RecipeGrid;
