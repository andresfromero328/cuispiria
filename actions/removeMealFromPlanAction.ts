"use server";

import { connectDB } from "@/lib/database/mongodb";
import { MealPlanDay } from "@/models/models";
import { Types } from "mongoose";
import { revalidateTag } from "next/cache";

export async function removeMealFromPlan({
  userID,
  mealId,
}: {
  userID: string;
  mealId: string;
}) {
  if (!Types.ObjectId.isValid(mealId)) throw new Error("Invalid mealId");

  try {
    await connectDB();

    const _mealId = new Types.ObjectId(mealId);

    const updatedDay = await MealPlanDay.findOneAndUpdate(
      { userID, "meals._id": _mealId },
      { $pull: { meals: { _id: _mealId } } },
      { new: true },
    ).lean();

    if (!updatedDay)
      return { ok: false as const, reason: "not_found" as const };

    if (Array.isArray(updatedDay.meals) && updatedDay.meals.length === 0) {
      await MealPlanDay.deleteOne({ _id: updatedDay._id, userID });
    }

    revalidateTag(`mealplan:${userID}`);
    return { ok: true as const };
  } catch (err) {
    console.error("removeMealFromPlan:", err);
    return { ok: false as const, reason: "db_error" as const };
  }
}
