import RecipeOverview from "@/components/shared/RecipeOverview";
import { RecipeSearchState } from "@/types/recipeTypes";

interface Props {
  state: RecipeSearchState;
  isPending: boolean;
  action: (formData: FormData) => void;
}

const SearchedRecipesList = ({ state, isPending, action }: Props) => {
  const hasMore =
    state.totalResults! > 0 ? state.result.length < state.totalResults! : false;

  return (
    <section className="flex flex-col gap-6">
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {state.result.map((recipe) => (
          <RecipeOverview key={recipe.id} recipe={recipe} />
        ))}
      </div>

      {hasMore && (
        <form action={action} className="flex justify-center">
          <input type="hidden" name="intent" value="more" />
          <input type="hidden" name="query" value={state.query} />

          <button
            type="submit"
            disabled={isPending}
            className="btn btn-secondary"
          >
            {isPending ? "Loading…" : "Show more recipes"}
          </button>
        </form>
      )}
    </section>
  );
};

export default SearchedRecipesList;
