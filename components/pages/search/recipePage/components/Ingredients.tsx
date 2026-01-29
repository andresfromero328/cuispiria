import React, { useMemo } from "react";
import SectionCard from "../helpers/SectionCard";
import type { Ingredients as Ingredient } from "@/types/recipeTypes";

interface Props {
  ingredients: Ingredient[];
}

type GroupedById = {
  id: number;
  name: string;
  originals: string[];
  measures: Array<{ amount?: number; unit?: string }>;
};

function formatMeasure(amount?: number, unit?: string) {
  const hasAmount = typeof amount === "number" && Number.isFinite(amount);
  const u = unit?.trim();

  if (!hasAmount && !u) return "";
  if (hasAmount && u) return `${Math.round(amount * 1000) / 1000} ${u}`;
  if (hasAmount) return `${amount}`;
  return `${u}`;
}

function groupById(list: Ingredient[]): GroupedById[] {
  const map = new Map<number, GroupedById>();

  for (const ing of list) {
    const existing = map.get(ing.id);
    const unit = ing.unit?.trim() || undefined;
    const amount =
      typeof ing.amount === "number" && Number.isFinite(ing.amount)
        ? ing.amount
        : undefined;

    if (!existing) {
      map.set(ing.id, {
        id: ing.id,
        name: ing.name,
        originals: ing.original ? [ing.original] : [],
        measures: [{ amount, unit }],
      });
      continue;
    }

    // keep a better name if needed (more specific)
    if ((ing.name?.length ?? 0) > (existing.name?.length ?? 0)) {
      existing.name = ing.name;
    }

    if (ing.original) existing.originals.push(ing.original);
    existing.measures.push({ amount, unit });
  }

  // Optional: sort alphabetically for stable UI
  return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name));
}

const Ingredients = ({ ingredients }: Props) => {
  const grouped = useMemo(() => groupById(ingredients ?? []), [ingredients]);

  return (
    <SectionCard
      title="Ingredients"
      right={
        grouped.length > 0 ? (
          <span className="text-xs text-muted-foreground">
            {grouped.length} items
          </span>
        ) : null
      }
    >
      {grouped.length > 0 ? (
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {grouped.map((g) => {
            const uniqueOriginals = Array.from(
              new Set(g.originals.map((s) => s.trim()).filter(Boolean)),
            );

            // Keep all measures, but dedupe exact duplicates like "2 tbsp" repeated
            const uniqueMeasures = Array.from(
              new Set(
                g.measures
                  .map((m) => formatMeasure(m.amount, m.unit))
                  .map((s) => s.trim())
                  .filter(Boolean),
              ),
            );

            return (
              <li
                key={g.id}
                className="flex items-start justify-between gap-3 rounded-md border bg-background px-3 py-2"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium leading-snug">{g.name}</p>

                  {uniqueOriginals.length <= 1 ? (
                    <p className="text-xs text-muted-foreground">
                      {uniqueOriginals[0] ?? ""}
                    </p>
                  ) : (
                    <div className="mt-1 space-y-1">
                      {uniqueOriginals.map((txt) => (
                        <p key={txt} className="text-xs text-muted-foreground">
                          • {txt}
                        </p>
                      ))}
                    </div>
                  )}
                </div>

                {/* Amounts/units: show each instance as a stacked list */}
                <div className="shrink-0 text-xs text-muted-foreground text-right">
                  {uniqueMeasures.length > 0 ? (
                    uniqueMeasures.map((m) => <div key={m}>{m}</div>)
                  ) : (
                    <div>—</div>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="text-sm text-muted-foreground">
          No ingredient list available.
        </p>
      )}
    </SectionCard>
  );
};

export default Ingredients;
