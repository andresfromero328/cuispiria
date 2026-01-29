import RecipeOverview from "@/components/shared/RecipeOverview";
import { RecipeSearchState } from "@/types/recipeTypes";

interface Props {
  isPending: boolean;
  state: RecipeSearchState;
}

const SearchedRecipesList = ({ isPending, state }: Props) => {
  return (
    <section className="flex flex-col gap-6">
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {state.result.map((recipe, i) => (
          <RecipeOverview key={i} recipe={recipe} />
        ))}
      </div>

      {state.status === "done" && state.result.length > 0 && (
        <div className="flex justify-center">
          <button type="button" className="btn btn-secondary">
            Show more recipes
          </button>
        </div>
      )}
    </section>
  );
};

export default SearchedRecipesList;
