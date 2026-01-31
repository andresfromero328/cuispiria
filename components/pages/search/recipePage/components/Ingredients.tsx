"use client";

import React, { useMemo, useState } from "react";
import SectionCard from "../helpers/SectionCard";
import type { Ingredients as Ingredient } from "@/types/recipeTypes";

interface Props {
  ingredients: Ingredient[];
}

type MeasureSystem = "us" | "metric";

type GroupedById = {
  id: number;
  name: string;
  originals: string[];
  measures: Array<{
    us?: { amount?: number; unit?: string };
    metric?: { amount?: number; unit?: string };
  }>;
};

function round3(n: number) {
  return Math.round(n * 1000) / 1000;
}

function formatMeasure(amount?: number, unit?: string) {
  const hasAmount = typeof amount === "number" && Number.isFinite(amount);
  const u = unit?.trim();

  if (!hasAmount && !u) return "";
  if (hasAmount && u) return `${round3(amount)} ${u}`;
  if (hasAmount) return `${round3(amount)}`;
  return `${u}`;
}

function groupById(list: Ingredient[]): GroupedById[] {
  const map = new Map<number, GroupedById>();

  for (const ing of list) {
    const existing = map.get(ing.id);

    const us = ing.measures?.us
      ? {
          amount:
            typeof ing.measures.us.amount === "number" &&
            Number.isFinite(ing.measures.us.amount)
              ? ing.measures.us.amount
              : undefined,
          unit: ing.measures.us.unitShort?.trim() || undefined,
        }
      : undefined;

    const metric = ing.measures?.metric
      ? {
          amount:
            typeof ing.measures.metric.amount === "number" &&
            Number.isFinite(ing.measures.metric.amount)
              ? ing.measures.metric.amount
              : undefined,
          unit: ing.measures.metric.unitShort?.trim() || undefined,
        }
      : undefined;

    if (!existing) {
      map.set(ing.id, {
        id: ing.id,
        name: ing.name,
        originals: ing.original ? [ing.original] : [],
        measures: [{ us, metric }],
      });
      continue;
    }

    if ((ing.name?.length ?? 0) > (existing.name?.length ?? 0)) {
      existing.name = ing.name;
    }

    if (ing.original) existing.originals.push(ing.original);
    existing.measures.push({ us, metric });
  }

  return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name));
}

const Ingredients = ({ ingredients }: Props) => {
  const [system, setSystem] = useState<MeasureSystem>("us");

  const grouped = useMemo(() => groupById(ingredients ?? []), [ingredients]);

  return (
    <SectionCard
      title="Ingredients"
      right={
        grouped.length > 0 ? (
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">
              {grouped.length} items
            </span>

            {/* Toggle */}
            <button
              type="button"
              onClick={() => setSystem((s) => (s === "us" ? "metric" : "us"))}
              className="btn btn-secondary h-8 px-2 text-xs"
              aria-label="Toggle measurement system"
            >
              {system === "us" ? "US" : "Metric"}
            </button>
          </div>
        ) : null
      }
    >
      {grouped.length > 0 ? (
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {grouped.map((g) => {
            const uniqueOriginals = Array.from(
              new Set(g.originals.map((s) => s.trim()).filter(Boolean)),
            );

            const uniqueMeasures = Array.from(
              new Set(
                g.measures
                  .map((m) => {
                    const chosen = system === "us" ? m.us : m.metric;
                    return formatMeasure(chosen?.amount, chosen?.unit);
                  })
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

                {/* Measures: show each instance as a stacked list */}
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
