// MealPlanning.tsx
"use client";

import React, { useMemo } from "react";
import MacroPieChart from "./MacroPieChart";
import MealPlanningTable from "./MealPlanningTable";
import { Meal } from "@/actions/getMealPlanAction";

interface Props {
  meals?: Meal[];
  today: string; // yyyy-mm-dd
}

function toNumber(n: unknown) {
  const v = typeof n === "number" ? n : Number(n);
  return Number.isFinite(v) && v >= 0 ? v : 0;
}

function sumTodayMacros(todayMeals: Meal[]) {
  return todayMeals.reduce(
    (acc, m) => {
      const macros = m.recipe?.macros ?? {};
      acc.protein += toNumber(macros.protein);
      acc.carbs += toNumber(macros.carbs);
      acc.fat += toNumber(macros.fat);
      return acc;
    },
    { protein: 0, carbs: 0, fat: 0 },
  );
}

function macrosToPercents(t: { protein: number; carbs: number; fat: number }) {
  const total = t.protein + t.carbs + t.fat;
  if (total <= 0) return { percentProtein: 0, percentCarbs: 0, percentFat: 0 };

  // keep 1 decimal like your example numbers
  const round1 = (x: number) => Math.round(x * 10) / 10;

  return {
    percentProtein: round1((t.protein / total) * 100),
    percentCarbs: round1((t.carbs / total) * 100),
    percentFat: round1((t.fat / total) * 100),
  };
}

const MealPlanning = ({ meals = [], today }: Props) => {
  const todayMeals = useMemo(
    () => meals.filter((m) => m.dayISO === today),
    [meals, today],
  );

  const macros = useMemo(() => {
    const totals = sumTodayMacros(todayMeals);
    return macrosToPercents(totals);
  }, [todayMeals]);
  return (
    <section className="flex flex-col gap-5 px-2">
      <header>
        <h2>Meals for {today}</h2>
        <small>An overview of everything you’re planning to eat today.</small>
      </header>

      {todayMeals.length > 0 ? (
        <>
          <MacroPieChart macros={macros} />
          <MealPlanningTable meals={todayMeals} />
        </>
      ) : (
        <div className="grid place-content-center p-5">
          <p>There are no meals for today.</p>
        </div>
      )}
    </section>
  );
};

export default MealPlanning;
