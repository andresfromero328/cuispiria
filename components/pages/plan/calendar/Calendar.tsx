"use client";
import { useState, useEffect, useMemo } from "react";
import MonthView from "./views/MonthView";
import WeekView from "./views/WeekView";
import DayView from "./views/DayView";
import CalendarHeader from "./comps/CalendarHeader";
import {groupMealsByDate, safeId, toDateISO } from "@/lib/calendar/helpers";
import GrocerySummary from "./GrocerySummary";

export type CalendarView = "month" | "week" | "day";

export type MacroOverview = {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
};

export type MealType =
  | "Breakfast"
  | "Lunch"
  | "Dinner"
  | "Snack"
  | "Dessert"
  | "Other";

export type Ingredient = {
  name: string;
  amount: number;
  unit: string; // keep as string for flexibility (g, cup, tbsp, etc.)
};

export type IngredientUnit =
  | "g"
  | "kg"
  | "ml"
  | "l"
  | "tsp"
  | "tbsp"
  | "cup"
  | "oz"
  | "lb"
  | "piece"
  | "clove"
  | "slice"
  | "pinch";

export type Meal = {
  id: string;

  // Baseline overview fields
  title: string;
  imageUrl?: string | null;
  description?: string;
  dateISO: string; // "YYYY-MM-DD"
  time24h: string; // "HH:mm" (required)
  prepMinutes: number;
  type: MealType;
  ingredients?: Ingredient[];
  instructions?: string[];
  macros: MacroOverview;
  source?: "saved" | "custom";
};

export function Calendar({ meals }: { meals: Meal[] }) {
  const [view, setView] = useState<CalendarView>("month");
  const [activeDate, setActiveDate] = useState<Date>(new Date());

  const [localMeals, setLocalMeals] = useState<Meal[]>(() => meals);

  useEffect(() => {
    setLocalMeals(meals);
  }, [meals]);

  const mealsByDate = useMemo(() => groupMealsByDate(localMeals), [localMeals]);
  const activeISO = toDateISO(activeDate);
  const dayMeals = mealsByDate.get(activeISO) ?? [];

  function pickDay(d: Date) {
    setActiveDate(d);
    setView("day");
  }

  // Internal actions (no callbacks required)
  function addMeal(dateISO: string, time24h: string) {
    const title = "New meal";
    const newMeal: Meal = {
      id: safeId(),
      title,
      imageUrl: null,
      dateISO,
      time24h,
      prepMinutes: 10,
      type: "Other",
      macros: { calories: 0, protein: 0, carbs: 0, fat: 0 },
      source: "custom",
    };

    setLocalMeals((prev) => {
      const next = [...prev, newMeal];
      return next.sort((a, b) =>
        (a.dateISO + a.time24h).localeCompare(b.dateISO + b.time24h)
      );
    });
  }

  function editMeal(mealId: string) {
    console.log(`edit meal - ${mealId}`);
  }

  function removeMeal(mealId: string) {
    setLocalMeals((prev) => prev.filter((x) => x.id !== mealId));
  }

  return (
    <>
    <section className="w-full flex flex-col gap-4">
      <CalendarHeader
        view={view}
        activeDate={activeDate}
        onChangeActiveDate={setActiveDate}
        onChangeView={setView}
        onAddMeal={addMeal}
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
      <GrocerySummary view={view} activeDate={activeDate} meals={meals} />
    </section>
    </>
  );
}
