"use client";

import RecipeSearchForm from "@/components/forms/RecipeSearchForm";
import React, { useActionState, useEffect } from "react";
import SearchedRecipesList from "./SearchedRecipesList";
import { recipeSearchAction } from "@/actions/recipeSearchAction";
import { RecipeSearchState } from "@/lib/types/recipe-search";
import { useRouter } from "next/navigation";

interface Props {
  preloaded: RecipeSearchState;
}

const RecipeSearch = ({ preloaded }: Props) => {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(
    recipeSearchAction,
    preloaded,
  );

  useEffect(() => {
    if (state.status === "done" || state.status === "error") {
      const q = state.query.trim();
      if (!q) {
        router.replace("/recipe-search", { scroll: false });
        return;
      }
      router.replace(
        `/recipe-search?q=${encodeURIComponent(q)}&o=${state.offset}`,
        {
          scroll: false,
        },
      );
    }
  }, [state.status, state.query, state.offset, router]);

  return (
    <>
      <RecipeSearchForm
        action={formAction}
        isPending={isPending}
        state={state}
      />
      {state.status === "done" && state.result.length > 0 && (
        <SearchedRecipesList state={state} isPending={isPending} />
      )}
    </>
  );
};

export default RecipeSearch;
