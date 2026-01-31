// lib/data/library.ts
import { unstable_cache } from "next/cache";
import { connectDB } from "@/lib/database/mongodb";
import { SavedRecipe } from "@/models/models";
import type { SavedRecipeType } from "@/types/recipeTypes";

function serialize(docs: SavedRecipeType[]) {
  return docs.map((d) => ({
    userID: d.userID,
    recipeID: d.recipeID,
    type: d.type,
    title: d.title,
    image: d.image,
    readyInMinutes: d.readyInMinutes,
    dishTypes: d.dishTypes,
    aggregateLikes: d.aggregateLikes,
    healthScore: d.healthScore,
    macros: d.macros,
    ingredients: d.ingredients,
    createdAt: d.createdAt ? new Date(d.createdAt).toISOString() : null,
    updatedAt: d.updatedAt ? new Date(d.updatedAt).toISOString() : null,
  })) as Array<
    SavedRecipeType & { createdAt: string | null; updatedAt: string | null }
  >;
}

export async function getLibraryData(userID: string) {
  return unstable_cache(
    async () => {
      await connectDB();
      const [saved, custom] = await Promise.all([
        SavedRecipe.find({ userID, type: "saved" })
          .sort({ createdAt: -1 })
          .lean(),
        SavedRecipe.find({ userID, type: "custom" })
          .sort({ createdAt: -1 })
          .lean(),
      ]);

      return {
        saved: serialize(saved),
        custom: serialize(custom),
      };
    },
    [`library:${userID}`],
    { tags: [`library:${userID}`] },
  )();
}
