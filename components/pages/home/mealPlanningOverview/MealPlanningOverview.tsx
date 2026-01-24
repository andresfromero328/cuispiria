import React from "react";
import MealPlanning from "./mealPlanning/MealPlanning";
import { WeeklyMealOverview } from "./weeklyMealOverview/WeeklyMealOverview";

function startofWeek(d: Date) {
  const date = new Date(d);
  const day = date.getDay(); // 0 = Sun
  const diff = date.getDate() - day + 1; // Mon start
  date.setDate(diff);
  return date;
}

function endOfWeek(start: Date) {
  const date = new Date(start);
  date.setDate(start.getDate() + 6);
  return date;
}

const meals: number[] | undefined = [1, 2, 3, 4];

const MealPlanningOverview = () => {
  const today = new Date();
  const weekStart = startofWeek(today);
  const weekEnd = endOfWeek(today);
  const weekLabel = `${weekStart.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  })} - ${weekEnd.toLocaleDateString(undefined, {
    day: "numeric",
  })}`;

  return (
    <section className="flex flex-col gap-5 px-4 py-2">
      <header>
        <h2>Today</h2>
        <small>
          {today.toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
          })}{" "}
          - Week of {weekLabel}
        </small>
      </header>

      <MealPlanning meals={meals} />

      <WeeklyMealOverview
        meals={[
          {
            id: "m1",
            dateISO: "2026-01-12",
            timeLabel: "8:00 AM",
            type: "Breakfast",
            title: "Greek Yogurt Bowl",
            prepMins: 10,
            macros: { calories: 420, protein: 28, carbs: 45, fat: 14 },
          },
          {
            id: "m2",
            dateISO: "2026-01-12",
            timeLabel: "1:00 PM",
            type: "Lunch",
            title: "Grilled Chicken Bowl",
            prepMins: 20,
            macros: { calories: 620, protein: 45, carbs: 55, fat: 18 },
          },
          {
            id: "m3",
            dateISO: "2026-01-14",
            timeLabel: "7:00 PM",
            type: "Dinner",
            title: "Salmon with Rice",
            prepMins: 15,
            macros: { calories: 720, protein: 42, carbs: 65, fat: 28 },
          },
        ]}
        weekDates={[
          "2026-01-12",
          "2026-01-13",
          "2026-01-14",
          "2026-01-15",
          "2026-01-16",
          "2026-01-17",
          "2026-01-18",
        ]}
      />
    </section>
  );
};

export default MealPlanningOverview;
