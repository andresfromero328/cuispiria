// app/actions/deleteRecipeAction.ts
"use server";

import { revalidateTag } from "next/cache";
import { connectDB } from "@/lib/database/mongodb";
import { SavedRecipe } from "@/models/models";

type DeleteRecipeArgs = {
  userID: string;
  savedRecipeId: number;
};

export async function deleteLibraryRecipe({
  userID,
  savedRecipeId,
}: DeleteRecipeArgs) {
  if (!userID) throw new Error("Missing userID");
  if (!savedRecipeId) throw new Error("Missing savedRecipeId");

  await connectDB();

  try {
    const res = await SavedRecipe.deleteOne({
      recipeID: savedRecipeId,
      userID,
    });
    revalidateTag(`library:${userID}`);
    return { ok: true as const, deletedCount: res.deletedCount };
  } catch (err) {
    console.error("deleteLibraryRecipe:", err);
    return { ok: false as const, reason: "db_error" as const };
  }
}
