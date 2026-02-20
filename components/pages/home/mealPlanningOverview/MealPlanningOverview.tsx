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

const MealPlanningOverview = ({ plannedMeals, today, start, end }: Props) => {
  const weekLabel = `${start} - ${end}`;

  return (
    <section className="flex flex-col gap-5 px-4 py-2">
      <header>
        <h2>Today</h2>
        <small>
          {today} - Week of {weekLabel}
        </small>
      </header>

      <MealPlanning meals={plannedMeals} today={today} />

      <WeeklyMealOverview
        meals={plannedMeals}
        weekDates={[
          "2026-02-16",
          "2026-02-17",
          "2026-02-18",
          "2026-02-19",
          "2026-02-20",
          "2026-02-21",
          "2026-02-22",
        ]}
      />
    </section>
  );
};

export default MealPlanningOverview;
