import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react";
import React from "react";
import SectionHeader from "./SectionHeader";
import RecipeGrid from "./RecipeGrid";
import { RecipePreview } from "@/app/library/page";

interface Props {
  recipes: RecipePreview[];
}

const LibraryList = ({ recipes }: Props) => {
  const saved = recipes.filter((r) => r.source === "saved");
  const custom = recipes.filter((r) => r.source === "custom");

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
              className="h-10 rounded-md border bg-background px-3 text-sm"
              defaultValue="recent"
            >
              <option value="recent">Recent</option>
              <option value="alpha">A → Z</option>
              <option value="health">Health score</option>
              <option value="prep">Prep time</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <Button className="btn bg-calendar-btn">
              <Plus size={18} />
              <span className="ml-2 hidden sm:inline">Add Recipe</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Saved section */}
      <div className="flex flex-col gap-3">
        <SectionHeader title="Saved Recipes" count={saved.length} />
        <RecipeGrid items={saved} />
      </div>

      {/* Custom section */}
      <div className="flex flex-col gap-3">
        <SectionHeader
          title="Custom Recipes"
          count={custom.length}
          right={
            <Button className="btn bg-calendar-btn" size="sm">
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
