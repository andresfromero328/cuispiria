"use client";

import { useEffect, useMemo, useState } from "react";
import MonthView from "./views/MonthView";
import WeekView from "./views/WeekView";
import DayView from "./views/DayView";
import CalendarHeader from "./comps/CalendarHeader";
import { groupMealsByDate, toDateISO } from "@/lib/calendar/helpers";
import GrocerySummary from "./GrocerySummary";
import { MealRecipeSnapshot, SavedRecipeType } from "@/types/recipeTypes";

export type CalendarView = "month" | "week" | "day";

export interface Meal {
  id: string;
  dayISO: string;
  time24h: string;
  dateTime: string;
  recipe: MealRecipeSnapshot;
}

export interface LibraryData {
  saved: SavedRecipeType[];
  custom: SavedRecipeType[];
}

interface Props {
  plannedMeals: Meal[];
  library: LibraryData;
  onAddMeal: (
    recipe: SavedRecipeType,
    date: Date,
    time24h: string,
  ) => Promise<void> | void;
  onRemoveMeal?: (mealId: string) => Promise<void> | void;
}

export function Calendar({
  plannedMeals,
  library,
  onAddMeal,
  onRemoveMeal,
}: Props) {
  const [view, setView] = useState<CalendarView>("month");
  const [activeDate, setActiveDate] = useState<Date>(new Date());

  const [localMeals, setLocalMeals] = useState<Meal[]>(() => plannedMeals);
  useEffect(() => setLocalMeals(plannedMeals), [plannedMeals]);

  const mealsByDate = useMemo(() => groupMealsByDate(localMeals), [localMeals]);
  const activeISO = toDateISO(activeDate);
  const dayMeals = mealsByDate.get(activeISO) ?? [];

  function pickDay(d: Date) {
    setActiveDate(d);
    setView("day");
  }

  function editMeal(mealId: string) {
    console.log(`edit meal - ${mealId}`);
  }

  async function removeMeal(mealId: string) {
    setLocalMeals((prev) => prev.filter((m) => m.id !== mealId));
    await onRemoveMeal?.(mealId);
  }

  return (
    <>
      <section className="w-full flex flex-col gap-4">
        <CalendarHeader
          view={view}
          activeDate={activeDate}
          onChangeActiveDate={setActiveDate}
          onChangeView={setView}
          library={library}
          onAddMeal={onAddMeal}
        />

        {view === "month" ? (
          <MonthView
            activeDate={activeDate}
            onPickDay={pickDay}
            mealsByDate={mealsByDate}
          />
        ) : view === "week" ? (
          <WeekView
            activeDate={activeDate}
            onPickDay={pickDay}
            mealsByDate={mealsByDate}
            onEditMeal={editMeal}
            onRemoveMeal={removeMeal}
          />
        ) : (
          <DayView
            activeDate={activeDate}
            meals={dayMeals}
            onEditMeal={editMeal}
            onRemoveMeal={removeMeal}
          />
        )}
      </section>

      <section>
        {/* ✅ IMPORTANT: pass ALL meals, not just dayMeals */}
        <GrocerySummary
          view={view}
          activeDate={activeDate}
          meals={localMeals}
        />
      </section>
    </>
  );
}
