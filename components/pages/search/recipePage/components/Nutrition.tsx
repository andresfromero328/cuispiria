import React from "react";
import SectionCard from "../helpers/SectionCard";
import { Nutrition as NutritionType } from "@/types/recipeTypes";
import { auth } from "@/auth";
import PremiumLock from "@/components/shared/PremiumLock";
import MacroPieChart from "@/components/pages/home/mealPlanningOverview/mealPlanning/MacroPieChart";
import NutritionExpandable from "./NutritionalExpandable";

interface Props {
  nutritionInfo: NutritionType;
}

function pickNutrient(
  nutrition: NutritionType | undefined,
  name: "Calories" | "Protein" | "Carbohydrates" | "Fat",
) {
  return nutrition?.nutrients?.find((n) => n.name === name);
}

function toNumber(n: unknown) {
  const v = typeof n === "number" ? n : Number(n);
  return Number.isFinite(v) && v >= 0 ? v : 0;
}

// ✅ Keep consistent with MealPlanning: grams → % of total grams
function gramsToMacroPercents(proteinG: number, carbsG: number, fatG: number) {
  const total = proteinG + carbsG + fatG;
  if (total <= 0) {
    return { percentProtein: 0, percentCarbs: 0, percentFat: 0 };
  }

  // match your prior numbers style (can keep decimals; chart accepts numbers)
  const round1 = (x: number) => Math.round(x * 10) / 10;

  return {
    percentProtein: round1((proteinG / total) * 100),
    percentCarbs: round1((carbsG / total) * 100),
    percentFat: round1((fatG / total) * 100),
  };
}

const Nutrition = async ({ nutritionInfo }: Props) => {
  const cal = pickNutrient(nutritionInfo, "Calories");
  const protein = pickNutrient(nutritionInfo, "Protein");
  const carbs = pickNutrient(nutritionInfo, "Carbohydrates");
  const fat = pickNutrient(nutritionInfo, "Fat");

  // ✅ derive macro percents from the same grams you're displaying above
  const macroPercents = gramsToMacroPercents(
    toNumber(protein?.amount),
    toNumber(carbs?.amount),
    toNumber(fat?.amount),
  );

  const session = await auth();

  return (
    <SectionCard title="Nutrition">
      {(nutritionInfo?.nutrients?.length ?? 0) > 0 ? (
        <div className="space-y-3">
          {/* Tier 1: quick glance (5–6 items) */}
          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-md border bg-background p-3">
              <small>Calories</small>
              <p className="text-sm font-semibold">
                {cal ? `${Math.round(cal.amount)} ${cal.unit}` : "—"}
              </p>
            </div>

            <div className="rounded-md border bg-background p-3">
              <small>Protein</small>
              <p className="text-sm font-semibold">
                {protein ? `${Math.round(protein.amount)}${protein.unit}` : "—"}
              </p>
            </div>

            <div className="rounded-md border bg-background p-3">
              <small>Carbs</small>
              <p className="text-sm font-semibold">
                {carbs ? `${Math.round(carbs.amount)}${carbs.unit}` : "—"}
              </p>
            </div>

            <div className="rounded-md border bg-background p-3">
              <small>Fat</small>
              <p className="text-sm font-semibold">
                {fat ? `${Math.round(fat.amount)}${fat.unit}` : "—"}
              </p>
            </div>

            {/* Add Fiber + Sodium as Tier 1 (recommended) */}
            {(() => {
              const fiber =
                nutritionInfo?.nutrients?.find((n) => n.name === "Fiber") ??
                null;
              return (
                <div className="rounded-md border bg-background p-3">
                  <small>Fiber</small>
                  <p className="text-sm font-semibold">
                    {fiber ? `${Math.round(fiber.amount)}${fiber.unit}` : "—"}
                  </p>
                </div>
              );
            })()}

            {(() => {
              const sodium =
                nutritionInfo?.nutrients?.find((n) => n.name === "Sodium") ??
                null;
              return (
                <div className="rounded-md border bg-background p-3">
                  <small>Sodium</small>
                  <p className="text-sm font-semibold">
                    {sodium
                      ? `${Math.round(sodium.amount)}${sodium.unit}`
                      : "—"}
                  </p>
                </div>
              );
            })()}
          </div>

          {/* Tier 1.5: breakdown (optional) */}
          {/* ✅ keep MacroPieChart consistent with MealPlanning: feed grams-based percents */}
          <div className="rounded-md border bg-background p-3">
            <p className="font-semibold">Macro breakdown</p>

            <MacroPieChart macros={macroPercents} />

            <div className="text-center">
              <small className="text-center ">
                {Math.round(macroPercents.percentProtein)}% protein •{" "}
                {Math.round(macroPercents.percentCarbs)}% carbs •{" "}
                {Math.round(macroPercents.percentFat)}% fat
              </small>
            </div>
          </div>

          {/* Tier 2 / Tier 3 access */}
          {session ? (
            <NutritionExpandable nutrients={nutritionInfo.nutrients ?? []} />
          ) : (
            <PremiumLock label="Advanced nutrition" />
          )}
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Nutrition info not available.
          </p>
          <PremiumLock label="Advanced nutrition" />
        </div>
      )}
    </SectionCard>
  );
};

export default Nutrition;
