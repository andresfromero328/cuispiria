"use client";

import * as React from "react";
import type { Nutrition as NutritionType } from "@/types/recipeTypes";

type Nutrient = NonNullable<NutritionType["nutrients"]>[number];

function roundSmart(n: number) {
  if (!Number.isFinite(n)) return "—";
  if (n === 0) return "0";
  if (Math.abs(n) >= 100) return String(Math.round(n));
  if (Math.abs(n) >= 10) return n.toFixed(1);
  return n.toFixed(2);
}

function pct(n?: number) {
  if (typeof n !== "number" || !Number.isFinite(n)) return null;
  return `${Math.round(n)}%`;
}

function rowKey(n: Nutrient) {
  // Spoonacular nutrient names can repeat sometimes; this makes it stable
  return `${n.name}-${n.unit}-${n.amount}`;
}

function NutrientRow({ n }: { n: Nutrient }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-md border bg-background px-3 py-2">
      <div className="min-w-0">
        <p className="text-sm font-medium leading-snug">{n.name}</p>
        <small className="text-muted-foreground">
          {pct(n.percentOfDailyNeeds)
            ? `${pct(n.percentOfDailyNeeds)} daily value`
            : " "}
        </small>
      </div>

      <div className="shrink-0 text-right">
        <p className="text-sm font-semibold">
          {roundSmart(n.amount)} {n.unit}
        </p>
      </div>
    </div>
  );
}

function buildMap(nutrients: Nutrient[]) {
  const m = new Map<string, Nutrient>();
  for (const n of nutrients) {
    if (!n?.name) continue;
    m.set(n.name, n);
  }
  return m;
}

export default function NutritionExpandable({
  nutrients,
}: {
  nutrients: Nutrient[];
}) {
  const map = React.useMemo(() => buildMap(nutrients), [nutrients]);

  // Based on YOUR list split
  const DETAILED = [
    "Saturated Fat",
    "Net Carbohydrates",
    "Sugar",
    "Cholesterol",
    "Sodium",
    "Potassium",
    "Calcium",
    "Iron",
    "Vitamin C",
    "Vitamin A",
    "Vitamin E",
  ];

  const MICROS_VITAMINS = [
    "Vitamin K",
    "Folate",
    "Vitamin B1",
    "Vitamin B2",
    "Vitamin B3",
    "Vitamin B5",
    "Vitamin B6",
    "Vitamin B12",
  ];

  const MICROS_MINERALS = [
    "Magnesium",
    "Phosphorus",
    "Zinc",
    "Selenium",
    "Copper",
    "Manganese",
  ];

  const EDGE = ["Alcohol", "Alcohol %"];

  const detailedItems = DETAILED.map((k) => map.get(k)).filter(
    Boolean,
  ) as Nutrient[];
  const vitaminItems = MICROS_VITAMINS.map((k) => map.get(k)).filter(
    Boolean,
  ) as Nutrient[];
  const mineralItems = MICROS_MINERALS.map((k) => map.get(k)).filter(
    Boolean,
  ) as Nutrient[];
  const edgeItems = EDGE.map((k) => map.get(k)).filter(Boolean) as Nutrient[];

  const hasDetailed = detailedItems.length > 0;
  const hasMicros =
    vitaminItems.length + mineralItems.length + edgeItems.length > 0;

  const [showDetailed, setShowDetailed] = React.useState(false);
  const [showMicros, setShowMicros] = React.useState(false);

  React.useEffect(() => {
    if (!showDetailed) setShowMicros(false);
  }, [showDetailed]);

  if (!hasDetailed) return null;

  return (
    <div className="space-y-2">
      {/* Button 1 */}
      <button
        type="button"
        onClick={() => setShowDetailed((v) => !v)}
        className="btn w-full rounded-md border bg-background px-3 py-2 text-sm shadow-sm hover-anim"
        aria-expanded={showDetailed}
      >
        {showDetailed ? "Hide detailed nutrition" : "View detailed nutrition"}
      </button>

      <small className="text-muted-foreground">
        Includes fats & carbs detail, key vitamins/minerals, and % daily needs.
      </small>

      {showDetailed && (
        <div className="space-y-2">
          {detailedItems.map((n) => (
            <NutrientRow key={rowKey(n)} n={n} />
          ))}

          {/* Button 2 */}
          {hasMicros && (
            <div className="pt-2 space-y-2">
              <button
                type="button"
                onClick={() => setShowMicros((v) => !v)}
                className="btn w-full rounded-md border bg-background px-3 py-2 text-sm shadow-sm hover-anim"
                aria-expanded={showMicros}
              >
                {showMicros
                  ? "Hide full micronutrient breakdown"
                  : "Full micronutrient breakdown"}
              </button>

              {showMicros && (
                <div className="space-y-3">
                  {vitaminItems.length > 0 && (
                    <div className="space-y-2">
                      <small className="text-muted-foreground">Vitamins</small>
                      {vitaminItems.map((n) => (
                        <NutrientRow key={rowKey(n)} n={n} />
                      ))}
                    </div>
                  )}

                  {mineralItems.length > 0 && (
                    <div className="space-y-2">
                      <small className="text-muted-foreground">Minerals</small>
                      {mineralItems.map((n) => (
                        <NutrientRow key={rowKey(n)} n={n} />
                      ))}
                    </div>
                  )}

                  {edgeItems.length > 0 && (
                    <div className="space-y-2 opacity-80">
                      <small className="text-muted-foreground">Other</small>
                      {edgeItems.map((n) => (
                        <NutrientRow key={rowKey(n)} n={n} />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
