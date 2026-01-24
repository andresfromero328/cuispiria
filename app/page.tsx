import { auth } from "@/auth";
import LockedContent from "@/components/pages/home/mealPlanningOverview/LockedContent";
import MealPlanningOverview from "@/components/pages/home/mealPlanningOverview/MealPlanningOverview";
import PopularRecipes from "@/components/pages/home/popularMeals/PopularRecipes";

export default async function Home() {
  const session = await auth();

  return (
    <main className="w-full max-w-7xl mx-auto flex-1 flex flex-col gap-5">
      <PopularRecipes />

      <div className="relative">
        <div className="line-break mt-0" />
      </div>

      {session ? <MealPlanningOverview /> : <LockedContent />}
    </main>
  );
}
