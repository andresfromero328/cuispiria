import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react";
import React from "react";
import SectionHeader from "./SectionHeader";
import RecipeGrid from "./RecipeGrid";
import { SavedRecipeType } from "@/types/recipeTypes";

interface Props {
  saved: SavedRecipeType[];
  custom: SavedRecipeType[];
}

const LibraryList = ({ saved, custom }: Props) => {
  return (
    <section className="flex flex-col gap-5 px-4 py-2">
      <div className="flex flex-col md:flex-row gap-2">
        <div className="flex-1 flex flex-col md:flex-row gap-2 items-center justify-between">
          <div className="flex-1 w-full md:w-auto inline-flex items-center gap-2">
            <div className="flex w-full items-center gap-2 rounded-md border bg-background px-3 py-2">
              <Search size={16} className="text-muted-foreground" />
              <input
                placeholder="Search recipes..."
                className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
            </div>

            <select
              className="h-10 rounded-md border bg-background outline-none cursor-pointer px-3 text-sm"
              defaultValue="recent"
            >
              <option value="recent">Recent</option>
              <option value="alpha">A → Z</option>
              <option value="health">Health score</option>
              <option value="prep">Prep time</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <SectionHeader title="Saved Recipes" count={saved.length} />
        <RecipeGrid items={saved} />
      </div>

      <div className="flex flex-col gap-3">
        <SectionHeader
          title="Custom Recipes"
          count={custom.length}
          right={
            <Button className="btn btn-ghost" size="sm">
              <Plus size={16} />
              <span className="ml-2">New</span>
            </Button>
          }
        />
        <RecipeGrid items={custom} />
      </div>
    </section>
  );
};

export default LibraryList;
