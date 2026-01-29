"use client";

import { Search, X } from "lucide-react";
import { Input } from "../ui/input";
import { RecipeSearchState } from "@/types/recipeTypes";

interface Props {
  action: (formData: FormData) => void;
  isPending: boolean;
  state: RecipeSearchState;
}

const RecipeSearchForm = ({ action, state, isPending }: Props) => {
  return (
    <>
      <form
        action={action}
        className="rounded-2xl border bg-background shadow-sm"
      >
        <div className="flex items-center gap-3 px-4 py-3">
          <div className="grid size-10 place-items-center rounded-xl border bg-muted/40">
            <Search className="size-5 text-muted-foreground" />
          </div>

          <Input
            id="query"
            name="query"
            placeholder="search ingredients (e.g., chicken, rice, broccoli...)"
            autoComplete="off"
            className="
          h-auto flex-1 border-0 bg-transparent p-0 text-base shadow-none
          focus-visible:ring-0 focus-visible:ring-offset-0
          placeholder:text-muted-foreground
          "
          />
          {state.query.length > 0 && (
            <button
              type="button"
              onClick={() => {}}
              className=" btn btn-secondary"
              aria-label="Clear search"
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
