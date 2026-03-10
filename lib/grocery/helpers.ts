import type { Meal } from "@/components/pages/plan/calendar/Calendar";

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */

export type GroceryItem = {
  name: string;
  amount: number;
  unit: string;
};

type UnitFamily = "mass" | "volume" | "count" | "unknown";

/* -------------------------------------------------------------------------- */
/* Conversion tables                                                          */
/* -------------------------------------------------------------------------- */

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

/* -------------------------------------------------------------------------- */
/* Normalizers                                                                */
/* -------------------------------------------------------------------------- */

export function normalizeName(name: string) {
  return name.trim().toLowerCase();
}

export function normalizeUnit(unit: string) {
  return (unit || "").trim().toLowerCase().replace(/\./g, "");
}

/* -------------------------------------------------------------------------- */
/* Unit helpers                                                               */
/* -------------------------------------------------------------------------- */

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

  if (tied.includes("g")) return "g";
  if (tied.includes("ml")) return "ml";
  if (tied.includes("piece")) return "piece";

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

/* -------------------------------------------------------------------------- */
/* Aggregation                                                                */
/* -------------------------------------------------------------------------- */

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

/* -------------------------------------------------------------------------- */
/* Formatters                                                                 */
/* -------------------------------------------------------------------------- */

export function formatAmount(n: number) {
  if (!Number.isFinite(n)) return "0";
  const r = Math.round(n * 100) / 100;
  return r % 1 === 0 ? String(r | 0) : String(r);
}

export function formatDateShort(dateISO: string) {
  const [y, m, d] = dateISO.split("-").map(Number);
  const dt = new Date(y, (m ?? 1) - 1, d ?? 1);
  return dt.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export function formatRange(startISO: string, endISO: string) {
  return `${formatDateShort(startISO)} – ${formatDateShort(endISO)}`;
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
