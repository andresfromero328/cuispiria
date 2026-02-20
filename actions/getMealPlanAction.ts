// actions/getMealPlanData.ts
"use server";

import { unstable_cache } from "next/cache";
import { connectDB } from "@/lib/database/mongodb";
import { MealPlanDay, MealPlanMeal } from "@/models/models";
import type { MealRecipeSnapshot } from "@/types/recipeTypes";
import { Types } from "mongoose";

export interface Meal {
  id: string;
  dayISO: string;
  time24h: string;
  dateTime: string;
  recipe: MealRecipeSnapshot;
}

type LeanMeal = MealPlanMeal & { _id: Types.ObjectId };

export async function getMealPlanData(
  userID: string,
  fromISO: string,
  toISO: string,
) {
  const cacheKey = `mealplan:${userID}:${fromISO}:${toISO}`;

  return unstable_cache(
    async () => {
      await connectDB();

      const docs = await MealPlanDay.find({
        userID,
        dayISO: { $gte: fromISO, $lte: toISO },
      })
        .sort({ dayISO: 1 })
        .lean();

      const plannedMeals: Meal[] = [];

      for (const day of docs) {
        const dayISO = day.dayISO as string;
        const meals = (day.meals ?? []) as LeanMeal[];

        for (const m of meals) {
          plannedMeals.push({
            id: String(m._id),
            dayISO,
            time24h: m.time24h,
            dateTime: new Date(m.dateTime).toISOString(),
            recipe: m.recipe,
          });
        }
      }

      return plannedMeals;
    },
    [cacheKey],
    { revalidate: 60, tags: [cacheKey, `mealplan:${userID}`] },
  )();
}
