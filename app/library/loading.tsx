// app/(app)/library/loading.tsx
import React from "react";
import { Search, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

function SectionHeaderSkeleton({ withRight }: { withRight?: boolean }) {
  return (
    <div className="flex items-center justify-between border bg-background shadow-sm px-4 py-2 rounded-md">
      <div className="min-w-0 flex flex-col gap-2">
        <Skeleton className="h-5 w-36" />
        <Skeleton className="h-3 w-24" />
      </div>

      {withRight ? (
        <Button className="btn bg-calendar-btn" size="sm" disabled>
          <Plus size={16} />
          <span className="ml-2">New</span>
        </Button>
      ) : null}
    </div>
  );
}

function RecipeCardSkeleton() {
  return (
    <div className="rounded-lg border bg-background shadow-sm overflow-hidden">
      <Skeleton className="h-40 w-full" />
      <div className="p-3 flex flex-col gap-3">
        <Skeleton className="h-4 w-4/5" />
        <Skeleton className="h-3 w-2/5" />
        <div className="flex gap-2">
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-9 w-full" />
          <Skeleton className="h-9 w-full" />
        </div>
      </div>
    </div>
  );
}

function RecipeGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <RecipeCardSkeleton key={i} />
      ))}
    </div>
  );
}

export default function LoadingLibrary() {
  return (
    <section className="flex flex-col gap-5 px-4 py-2">
      <section className="flex flex-col gap-5 px-4 py-2">
        <header>
          <h2>Library</h2>
          <small>Explore and manage your collection of recipes.</small>
        </header>
      </section>
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
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <SectionHeaderSkeleton />
        <RecipeGridSkeleton count={3} />
      </div>

      <div className="flex flex-col gap-3">
        <SectionHeaderSkeleton withRight={true} />
        <RecipeGridSkeleton count={3} />
      </div>
    </section>
  );
}
