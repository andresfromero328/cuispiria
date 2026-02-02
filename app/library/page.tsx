import React from "react";

import LibraryList from "@/components/pages/library/LibraryList";
import { auth } from "@/auth";
import { SavedRecipeType } from "@/types/recipeTypes";
import { getLibraryData } from "@/lib/data/getLibraryData";

// export const dynamic = "force-dynamic";

const LibraryPage = async () => {
  const session = await auth();
  const {
    saved,
    custom,
  }: { saved: SavedRecipeType[]; custom: SavedRecipeType[] } =
    await getLibraryData(session!.userID);

  return (
    <main className="w-full max-w-7xl mx-auto flex-1 flex flex-col gap-5">
      <section className="flex flex-col gap-5 px-4 py-2">
        <header>
          <h2>Library</h2>
          <small>Explore and manage your collection of recipes.</small>
        </header>
      </section>
      <LibraryList saved={saved} custom={custom} />
    </main>
  );
};

export default LibraryPage;
