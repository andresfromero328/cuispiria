// MealPlanningTable.tsx
"use client";

import { Clock, Flame } from "lucide-react";
import React, { useMemo } from "react";
import { Meal } from "@/actions/getMealPlanAction";
import Link from "next/link";

function byTime(a: Meal, b: Meal) {
  return a.time24h.localeCompare(b.time24h);
}

const MealPlanningTable = ({ meals }: { meals: Meal[] }) => {
  const rows = useMemo(() => meals.slice().sort(byTime), [meals]);

  return (
    <>
      {/* Header (desktop only) */}
      <div className="hidden sm:grid grid-cols-[84px_1fr_120px_160px] gap-3 px-4 py-2 text-xs text-muted-foreground">
        <span>Time</span>
        <span>Meal</span>
        <span className="text-right">Prep</span>
        <span className="text-right">Actions</span>
      </div>

      {/* Rows */}
      <div className="divide-y divide-foreground/50">
        {rows.map((m) => (
          <div
            key={m.id}
            className="grid grid-cols-[84px_1fr] sm:grid-cols-[84px_1fr_120px_160px] gap-3 px-2 py-3 items-center"
          >
            {/* Time */}
            <div className="text-sm font-medium tabular-nums">{m.time24h}</div>

            {/* Meal summary */}
            <div className="min-w-0 flex flex-col gap-1">
              {/* Title row */}
              <div className="flex items-center gap-2 min-w-0">
                <small className="text-xs rounded-full ui-border-soft px-2 py-0.5 text-muted-foreground shrink-0">
                  {m.recipe.type}
                </small>
                <p className="truncate">{m.recipe.title}</p>
              </div>

              {/* Secondary row */}
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Flame size={14} className="text-red-500" />
                  <span>{m.recipe.macros?.calories ?? 0} kcal</span>
                </div>

                {/* ✅ Prep time on mobile */}
                <div className="flex items-center gap-1 sm:hidden">
                  <Clock size={14} />
                  <span>{m.recipe.readyInMinutes ?? 0} min</span>
                </div>
              </div>
            </div>

            {/* Prep (desktop) */}
            <div className="hidden sm:block text-sm text-right text-muted-foreground">
              {m.recipe.readyInMinutes ?? 0} min
            </div>

            {/* Actions (desktop) */}
            <div className="hidden sm:flex justify-end gap-2">
              <Link
                href={
                  m.recipe.type === "saved"
                    ? `/recipe-search/${m.recipe.recipeID}`
                    : `/library/${m.recipe.recipeID}`
                }
                className="btn btn-ghost"
              >
                View
              </Link>
              <button className="btn btn-secondary">Replace</button>
            </div>

            {/* Actions (mobile) */}
            <div className="sm:hidden col-span-2 flex gap-2 pt-1">
              <Link
                href={
                  m.recipe.type === "saved"
                    ? `/recipe-search/${m.recipe.recipeID}`
                    : `/library/${m.recipe.recipeID}`
                }
                className="btn btn-ghost w-full"
              >
                View
              </Link>
              <button className="btn btn-secondary w-full">Replace</button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default MealPlanningTable;
