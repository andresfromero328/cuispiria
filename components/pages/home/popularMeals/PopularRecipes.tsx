import RecipeOverview from "@/components/shared/RecipeOverview";
import { RecipeOverviewCard } from "@/types/recipeTypes";
import React from "react";

interface Props {
  recipes: RecipeOverviewCard[];
}

const PopularRecipes = ({ recipes }: Props) => {
  return (
    <section className="flex flex-col gap-5 px-4 py-2">
      <header>
        <h2>Trending Recipes </h2>
        <small>Popular recipes to help you plan your next meals.</small>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
        {recipes.map((recipe, i) => (
          <RecipeOverview key={i} recipe={recipe} />
        ))}
      </section>
    </section>
  );
};

export default PopularRecipes;
