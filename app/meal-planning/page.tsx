import { addMealToPlan } from "@/actions/addMealToPlanAction";
import { getMealPlanData } from "@/actions/getMealPlanAction";
import { removeMealFromPlan } from "@/actions/removeMealFromPlanAction";
import { auth } from "@/auth";
import { Calendar } from "@/components/pages/plan/calendar/Calendar";
import { getMonthRangeISO } from "@/lib/calendar/helpers";
import { getLibraryData } from "@/lib/data/getLibraryData";
import React from "react";

const MealPlanningPage = async () => {
  const session = await auth();
  const { fromISO, toISO } = getMonthRangeISO(new Date());

  const [library, plannedMeals] = await Promise.all([
    getLibraryData(session?.userID),
    getMealPlanData(session?.userID, fromISO, toISO),
  ]);

  return (
    <main className="w-full max-w-7xl mx-auto flex-1 flex flex-col gap-5">
      <section className="flex flex-col gap-5 px-4 py-2">
        <header>
          <h2>Meal Planning</h2>
          <small>
            Organize your meals and keep your plans simple and clear.
          </small>
        </header>
        <Calendar
          plannedMeals={plannedMeals}
          library={library}
          onAddMeal={async (recipe, date, time24h) => {
            "use server";
            await addMealToPlan({
              userID: session!.userID,
              recipe,
              dateISO: date,
              time24h,
            });
          }}
          onRemoveMeal={async (mealId) => {
            "use server";
            await removeMealFromPlan({ userID: session!.userID, mealId });
          }}
        />
      </section>
    </main>
  );
};

export default MealPlanningPage;
