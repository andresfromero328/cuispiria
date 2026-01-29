"use client";

import { saveRecipeAction } from "@/actions/saveRecipeAction";
import { SpoonacularRecipeInfo } from "@/types/recipeTypes";
import React from "react";

interface Props {
  recipe: SpoonacularRecipeInfo;
  userID: string | undefined;
}

const RecipeHandles = ({ userID, recipe }: Props) => {
  const handleSaveRecipe = async () => {
    if (userID && recipe) await saveRecipeAction({ userID, recipe });
  };

  return (
    <div className="flex items-center justify-end gap-3">
      <div className="flex items-center gap-2">
        <button
          onClick={async () => handleSaveRecipe()}
          className="btn btn-secondary"
        >
          Save
        </button>
        <button className="btn btn-primary">Add to Plan</button>
      </div>
    </div>
  );
};

export default RecipeHandles;
