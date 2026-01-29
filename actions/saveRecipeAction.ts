"use server";

import { SavedRecipe } from "@/models/User";
import { connectDB } from "@/lib/database/mongodb";
import type { SpoonacularRecipeInfo } from "@/types/recipeTypes";

type SaveRecipeArgs = {
  userID: string;
  recipe: SpoonacularRecipeInfo;
};

function pickMacros(recipe: SpoonacularRecipeInfo) {
  const nutrients = recipe?.nutrition?.nutrients ?? [];

  const getAmount = (name: string) =>
    Number(nutrients.find((n) => n.name === name)?.amount ?? 0);

  return {
    protein: getAmount("Protein"),
    carbs: getAmount("Carbohydrates"),
    fat: getAmount("Fat"),
    calories: getAmount("Calories"),
  };
}

export async function saveRecipeAction({ userID, recipe }: SaveRecipeArgs) {
  if (!userID) throw new Error("Missing userID");
  if (!recipe?.id) throw new Error("Missing recipe.id");

  await connectDB();

  const macros = pickMacros(recipe);

  const doc = {
    userID,
    recipeID: recipe.id,
    type: "saved" as const,

    title: recipe.title,
    image: recipe.image ?? "",

    readyInMinutes: recipe.readyInMinutes ?? recipe.preparationMinutes ?? 0,
    dishTypes: recipe.dishTypes ?? [],
    aggregateLikes: recipe.aggregateLikes ?? 0,

    macros,
  };

  try {
    await SavedRecipe.findOneAndUpdate(
      { userID, recipeID: recipe.id, type: "saved" },
      { $set: doc },
      { new: true, upsert: true, runValidators: true },
    ).lean();

    return { ok: true };
  } catch (err) {
    console.log("SaveRecipeAction:", err);
    throw err;
  }
}
