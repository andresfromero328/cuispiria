"use server";

import { connectDB } from "@/lib/database/mongodb";
import { MealPlanDay } from "@/models/models";
import { SavedRecipeType } from "@/types/recipeTypes";
import { revalidatePath } from "next/cache";

function toDayISO(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function toDateTime(dayISO: string, time24h: string) {
  return new Date(`${dayISO}T${time24h}:00`);
}

export async function addMealToPlan(input: {
  userID: string;
  dateISO: string | Date;
  time24h: string;
  recipe: SavedRecipeType;
}) {
  const { userID, time24h, recipe } = input;
  const dayISO =
    typeof input.dateISO === "string" ? input.dateISO : toDayISO(input.dateISO);

  const dateTime = toDateTime(dayISO, time24h);

  const recipeSnapshot = {
    recipeID: recipe.recipeID,
    type: recipe.type,
    title: recipe.title,
    image: recipe.image ?? "",
    readyInMinutes: recipe.readyInMinutes,
    dishTypes: recipe.dishTypes ?? [],
    macros: recipe.macros,
    ingredients: recipe.ingredients ?? [],
    aggregateLikes: recipe.aggregateLikes ?? 0,
    healthScore: recipe.healthScore ?? 0,
  };
  await connectDB();
  try {
    await MealPlanDay.findOneAndUpdate(
      { userID, dayISO },
      {
        $setOnInsert: { userID, dayISO },
        $push: {
          meals: {
            time24h,
            dateTime,
            recipe: recipeSnapshot,
            servings: 1,
            notes: "",
          },
        },
      },
      { upsert: true, new: true },
    );

    revalidatePath("/meal-plan");
  } catch (err) {
    console.log("addMealToPlan", err);
  }
}
