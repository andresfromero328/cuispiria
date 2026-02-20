import React, { useMemo, useState } from "react";
import { CalendarView, Meal } from "./Calendar";
import { addDays, startOfWeek, toDateISO } from "@/lib/calendar/helpers";

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */

// ✅ Lightweight type for aggregated groceries (NOT the recipe Ingredients type)
export type GroceryItem = {
  name: string;
  amount: number;
  unit: string;
};

interface Props {
  view: CalendarView;
  activeDate: Date;
  meals: Meal[];
  maxItemsPerDay?: number;
}

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

type UnitFamily = "mass" | "volume" | "count" | "unknown";

/** canonical conversion maps (generic, not ingredient-specific) */
const MASS_TO_G: Record<string, number> = {
  g: 1,
  gram: 1,
  grams: 1,
  kg: 1000,
  kilogram: 1000,
  kilograms: 1000,
  oz: 28.349523125,
  ounce: 28.349523125,
  ounces: 28.349523125,
  lb: 453.59237,
  lbs: 453.59237,
  pound: 453.59237,
  pounds: 453.59237,
};

const VOL_TO_ML: Record<string, number> = {
  ml: 1,
  milliliter: 1,
  milliliters: 1,
  l: 1000,
  liter: 1000,
  liters: 1000,
  tsp: 4.92892159375,
  teaspoon: 4.92892159375,
  teaspoons: 4.92892159375,
  tbsp: 14.78676478125,
  tablespoon: 14.78676478125,
  tablespoons: 14.78676478125,
  cup: 236.5882365,
  cups: 236.5882365,
  "fl oz": 29.5735295625,
  floz: 29.5735295625,
};

const COUNT_UNITS = new Set([
  "piece",
  "pieces",
  "clove",
  "cloves",
  "slice",
  "slices",
  "item",
  "items",
]);

export function normalizeName(name: string) {
  return name.trim().toLowerCase();
}

export function normalizeUnit(unit: string) {
  return (unit || "").trim().toLowerCase().replace(/\./g, "");
}

function unitFamily(unit: string): UnitFamily {
  if (!unit) return "unknown";
  if (MASS_TO_G[unit]) return "mass";
  if (VOL_TO_ML[unit]) return "volume";
  if (COUNT_UNITS.has(unit)) return "count";
  return "unknown";
}

function chooseBestUnit(units: string[]) {
  const counts = new Map<string, number>();
  for (const u of units) counts.set(u, (counts.get(u) ?? 0) + 1);

  const entries = [...counts.entries()].sort((a, b) => b[1] - a[1]);
  const top = entries[0]?.[1] ?? 0;
  const tied = entries.filter(([, c]) => c === top).map(([u]) => u);

  // Prefer canonical base units
  if (tied.includes("g")) return "g";
  if (tied.includes("ml")) return "ml";
  if (tied.includes("piece")) return "piece";

  // Prefer "smaller" units
  const rank: Record<string, number> = {
    g: 1,
    kg: 2,
    ml: 1,
    l: 2,
    tsp: 1,
    tbsp: 2,
    cup: 3,
    "fl oz": 3,
  };

  tied.sort((a, b) => (rank[a] ?? 999) - (rank[b] ?? 999));
  return tied[0]!;
}

function convert(amount: number, fromUnit: string, toUnit: string) {
  const fromFam = unitFamily(fromUnit);
  const toFam = unitFamily(toUnit);

  // Same family
  if (fromFam === toFam) {
    if (fromFam === "mass") {
      const g = amount * MASS_TO_G[fromUnit];
      return g / MASS_TO_G[toUnit];
    }
    if (fromFam === "volume") {
      const ml = amount * VOL_TO_ML[fromUnit];
      return ml / VOL_TO_ML[toUnit];
    }
    if (fromFam === "count") {
      return fromUnit === toUnit ? amount : null;
    }
    return null;
  }

  // Cross-family (approx). Treat 1 ml ≈ 1 g.
  if (fromFam === "volume" && toFam === "mass") {
    const ml = amount * VOL_TO_ML[fromUnit];
    const g = ml;
    return g / MASS_TO_G[toUnit];
  }

  if (fromFam === "mass" && toFam === "volume") {
    const g = amount * MASS_TO_G[fromUnit];
    const ml = g;
    return ml / VOL_TO_ML[toUnit];
  }

  return null;
}

function titleCase(s: string) {
  return s
    .trim()
    .split(/\s+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

/**
 * ✅ Sum ingredients from meals (ingredients live in meal.recipe.ingredients)
 * Returns a map of "name|unit" -> GroceryItem
 */
export function sumIngredientsSmart(meals: Meal[]) {
  const byName: Record<
    string,
    { displayName: string; entries: { amount: number; unit: string }[] }
  > = {};

  for (const meal of meals) {
    const ingredients = meal.recipe?.ingredients ?? [];

    for (const ing of ingredients ?? []) {
      const nameKey = normalizeName(ing.name);
      const unit = normalizeUnit(ing.unit ?? "");
      const amount = Number(ing.amount) || 0;

      if (!byName[nameKey]) {
        byName[nameKey] = { displayName: titleCase(ing.name), entries: [] };
      }
      byName[nameKey].entries.push({ amount, unit: unit || "piece" });
    }
  }

  const out: Record<string, GroceryItem> = {};

  for (const [nameKey, bucket] of Object.entries(byName)) {
    const units = bucket.entries.map((e) => e.unit).filter(Boolean);
    const best = chooseBestUnit(units.length ? units : ["piece"]);

    let sumBest = 0;

    for (const e of bucket.entries) {
      const converted = convert(e.amount, e.unit, best);
      sumBest += converted == null ? e.amount : converted;
    }

    const key = `${nameKey}|${best}`;
    out[key] = { name: bucket.displayName, amount: sumBest, unit: best };
  }

  return out;
}

/** Builds groceries grouped by dayISO */
export function groceriesByDay(meals: Meal[]) {
  const byDate: Record<string, Meal[]> = {};

  for (const meal of meals) {
    if (!byDate[meal.dayISO]) byDate[meal.dayISO] = [];
    byDate[meal.dayISO].push(meal);
  }

  return Object.entries(byDate)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([dateISO, dayMeals]) => ({
      dateISO,
      items: Object.values(sumIngredientsSmart(dayMeals)).sort((a, b) =>
        a.name.localeCompare(b.name),
      ),
    }));
}

export function formatAmount(n: number) {
  if (!Number.isFinite(n)) return "0";
  const r = Math.round(n * 100) / 100;
  return r % 1 === 0 ? String(r | 0) : String(r);
}

export function formatRange(startISO: string, endISO: string) {
  return `${formatDateShort(startISO)} – ${formatDateShort(endISO)}`;
}

export function formatDateShort(dateISO: string) {
  const [y, m, d] = dateISO.split("-").map(Number);
  const dt = new Date(y, (m ?? 1) - 1, d ?? 1);
  return dt.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export function formatDateHuman(dateISO: string) {
  const [y, m, d] = dateISO.split("-").map(Number);
  const dt = new Date(y, (m ?? 1) - 1, d ?? 1);
  return dt.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

const GrocerySummary = ({
  view,
  activeDate,
  meals,
  maxItemsPerDay = 10,
}: Props) => {
  const scope = useMemo(() => {
    const activeISO = toDateISO(activeDate);

    if (view === "day") {
      return {
        mode: "range" as const,
        label: "Groceries",
        subtitle: "For this day",
        startISO: activeISO,
        endISO: activeISO,
      };
    }

    if (view === "week") {
      const start = startOfWeek(activeDate);
      const startISO = toDateISO(start);
      const endISO = toDateISO(addDays(start, 6));
      return {
        mode: "range" as const,
        label: "Groceries",
        subtitle: "This week",
        startISO,
        endISO,
      };
    }

    return {
      mode: "month" as const,
      label: "Groceries",
      subtitle: activeDate.toLocaleDateString(undefined, {
        month: "long",
        year: "numeric",
      }),
      startISO: "",
      endISO: "",
    };
  }, [view, activeDate]);

  const scopedMeals = useMemo(() => {
    if (scope.mode !== "range") return [];

    return meals
      .filter((m) => m.dayISO >= scope.startISO && m.dayISO <= scope.endISO)
      .sort((a, b) => {
        const aKey = `${a.dayISO} ${a.time24h ?? "00:00"}`;
        const bKey = `${b.dayISO} ${b.time24h ?? "00:00"}`;
        return aKey.localeCompare(bKey);
      });
  }, [meals, scope]);

  const days = useMemo(() => {
    if (scope.mode !== "range") return [];
    return groceriesByDay(scopedMeals);
  }, [scopedMeals, scope.mode]);

  const [expandedDates, setExpandedDates] = useState<Record<string, boolean>>(
    {},
  );

  const toggleDay = (dateISO: string) => {
    setExpandedDates((prev) => ({ ...prev, [dateISO]: !prev[dateISO] }));
  };

  return (
    <section className="border bg-background p-3 shadow-sm">
      <div className="flex flex-col gap-1 md:flex-row md:items-end md:justify-between">
        <div className="flex flex-col gap-1">
          <h3 className="text-sm font-semibold">{scope.label}</h3>
          <p className="text-xs text-muted-foreground">{scope.subtitle}</p>
        </div>

        {scope.mode === "range" ? (
          <span className="rounded-md border bg-muted px-2 py-1 text-xs text-muted-foreground">
            {formatRange(scope.startISO, scope.endISO)}
          </span>
        ) : (
          <span className="rounded-md border bg-muted px-2 py-1 text-xs text-muted-foreground">
            {scope.subtitle}
          </span>
        )}
      </div>

      {scope.mode === "month" ? (
        <div className="mt-3 rounded-md border border-dashed p-4 text-sm text-muted-foreground">
          Switch to day or week view to see ingredients for your planned meals.
        </div>
      ) : days.length ? (
        <div className="mt-3 divide-y divide-foreground/50">
          {days.map((day) => {
            const expanded = !!expandedDates[day.dateISO];
            const visible = expanded
              ? day.items
              : day.items.slice(0, maxItemsPerDay);
            const hiddenCount = Math.max(0, day.items.length - visible.length);

            return (
              <div key={day.dateISO} className="py-3">
                <div className="grid grid-cols-1 gap-2 md:grid-cols-[140px_1fr_auto] md:items-start">
                  <div className="flex items-center justify-between md:block">
                    <div className="text-xs font-semibold text-muted-foreground">
                      {formatDateHuman(day.dateISO)}
                    </div>

                    {day.items.length > maxItemsPerDay ? (
                      <button
                        type="button"
                        className="btn rounded-md px-2 py-1 text-xs hover:bg-primary/15 md:hidden"
                        onClick={() => toggleDay(day.dateISO)}
                      >
                        {expanded ? "Less" : "All"}
                      </button>
                    ) : null}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {visible.map((ing) => (
                      <div
                        key={`${day.dateISO}-${normalizeName(ing.name)}|${normalizeUnit(
                          ing.unit,
                        )}`}
                        className={[
                          "inline-flex items-center gap-2 rounded-md border",
                          "bg-[oklch(95%_0.02_95)] px-2.5 py-1.5",
                        ].join(" ")}
                      >
                        <span className="text-sm font-medium">{ing.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {formatAmount(ing.amount)} {ing.unit}
                        </span>
                      </div>
                    ))}

                    {!visible.length ? (
                      <div className="rounded-md border border-dashed px-3 py-2 text-sm text-muted-foreground">
                        No ingredients for this day
                      </div>
                    ) : null}

                    {hiddenCount > 0 && !expanded ? (
                      <span className="inline-flex items-center rounded-md border bg-muted px-2.5 py-1.5 text-xs text-muted-foreground">
                        +{hiddenCount} more
                      </span>
                    ) : null}
                  </div>

                  {day.items.length > maxItemsPerDay ? (
                    <button
                      type="button"
                      className="btn hidden md:inline-flex rounded-md px-2 py-1 text-xs hover:bg-primary/15"
                      onClick={() => toggleDay(day.dateISO)}
                    >
                      {expanded ? "Show less" : "Show all"}
                    </button>
                  ) : (
                    <span className="hidden md:block" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="mt-3 rounded-md border border-dashed p-4 text-sm text-muted-foreground">
          No ingredients yet. Add meals with ingredients to build your list.
        </div>
      )}
    </section>
  );
};

export default GrocerySummary;
