"use client";

import { Search, X } from "lucide-react";
import { Input } from "../ui/input";
import { RecipeSearchState } from "@/types/recipeTypes";
import { useRouter } from "next/navigation";

interface Props {
  action: (formData: FormData) => void;
  isPending: boolean;
  state: RecipeSearchState;
}

const RecipeSearchForm = ({ action, state, isPending }: Props) => {
  const router = useRouter();

  return (
    <>
      <form
        action={action}
        className="rounded-2xl border bg-background shadow-sm"
      >
        <input type="hidden" name="intent" value="search" />

        <div className="flex items-center gap-3 px-4 py-3">
          <div className="grid size-10 place-items-center rounded-xl border bg-muted/40">
            <Search className="size-5 text-muted-foreground" />
          </div>

          <Input
            name="query"
            defaultValue={state.query}
            placeholder="search ingredients (e.g., chicken, rice, broccoli...)"
            autoComplete="off"
            className="h-auto flex-1 border-0 bg-transparent p-0 text-base shadow-none
              focus-visible:ring-0 focus-visible:ring-offset-0"
          />

          {state.query && (
            <button
              type="button"
              onClick={() => router.replace("/recipe-search")}
              className="btn btn-secondary"
            >
              <X size={18} />
            </button>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="btn btn-primary"
          >
            Search
          </button>
        </div>
      </form>
      {state.query && <small>previous search: {state.query}</small>}
    </>
  );
};

export default RecipeSearchForm;
