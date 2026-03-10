import React from "react";
import MealPlanning from "./mealPlanning/MealPlanning";
import { WeeklyMealOverview } from "./weeklyMealOverview/WeeklyMealOverview";
import { Meal } from "@/actions/getMealPlanAction";

interface Props {
  plannedMeals: Meal[];
  today: string;
  start: string;
  end: string;
}

function buildWeekDates(startISO: string): string[] {
  const d = new Date(startISO + "T00:00:00");
  return Array.from({ length: 7 }, (_, i) => {
    const day = new Date(d);
    day.setDate(d.getDate() + i);
    const y = day.getFullYear();
    const m = String(day.getMonth() + 1).padStart(2, "0");
    const dd = String(day.getDate()).padStart(2, "0");
    return `${y}-${m}-${dd}`;
  });
}

const MealPlanningOverview = ({ plannedMeals, today, start, end }: Props) => {
  const weekLabel = `${start} - ${end}`;
  const weekDates = buildWeekDates(start);

  return (
    <section className="flex flex-col gap-5 px-4 py-2">
      <header>
        <h2>Today</h2>
        <small>
          {today} - Week of {weekLabel}
        </small>
      </header>

      <MealPlanning meals={plannedMeals} today={today} />

      <WeeklyMealOverview meals={plannedMeals} weekDates={weekDates} />
    </section>
  );
};

export default MealPlanningOverview;
