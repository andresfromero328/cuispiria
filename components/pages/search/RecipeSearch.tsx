"use client";

import React, { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { recipeSearchAction } from "@/actions/recipeSearchAction";
import { RecipeSearchState } from "@/types/recipeTypes";
import RecipeSearchForm from "@/components/forms/RecipeSearchForm";
import SearchedRecipesList from "./SearchedRecipesList";

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
    if (state.status !== "done" && state.status !== "error") return;

    const q = state.query.trim();
    if (!q) {
      router.replace("/recipe-search", { scroll: false });
      return;
    }

    router.replace(`/recipe-search?q=${encodeURIComponent(q)}`, {
      scroll: false,
    });
  }, [state.status, state.query, router]);

  return (
    <>
      <RecipeSearchForm
        action={formAction}
        isPending={isPending}
        state={state}
      />

      {state.status === "done" && state.result.length > 0 && (
        <SearchedRecipesList
          state={state}
          isPending={isPending}
          action={formAction}
        />
      )}
    </>
  );
};

export default RecipeSearch;
