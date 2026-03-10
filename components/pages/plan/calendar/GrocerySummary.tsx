"use client";

import React, { useMemo, useState } from "react";
import { CalendarView, Meal } from "./Calendar";
import { addDays, startOfWeek, toDateISO } from "@/lib/calendar/helpers";
import {
  normalizeName,
  normalizeUnit,
  groceriesByDay,
  formatAmount,
  formatRange,
  formatDateHuman,
} from "@/lib/grocery/helpers";

interface Props {
  view: CalendarView;
  activeDate: Date;
  meals: Meal[];
  maxItemsPerDay?: number;
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
                        className="btn btn-ghost text-xs md:hidden"
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
                      className="btn btn-ghost hidden md:inline-flex text-xs"
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
