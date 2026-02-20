"use client";

import { Meal } from "@/actions/getMealPlanAction";
import { Clock, Dot, Flame, MoveRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

function n(v: number) {
  return new Intl.NumberFormat().format(Math.round(v));
}

function weekdayLabel(dateISO: string) {
  const d = new Date(dateISO + "T00:00:00");
  return d.toLocaleDateString(undefined, { weekday: "short" });
}

function sumDay(meals: Meal[], dateISO: string) {
  // ✅ Use dayISO (YYYY-MM-DD) not dateTime (full ISO timestamp)
  const dayMeals = meals.filter((m) => m.dayISO === dateISO);

  const totals = dayMeals.reduce(
    (acc, m) => {
      acc.calories += m.recipe.macros.calories ?? 0;
      acc.protein += m.recipe.macros.protein ?? 0;
      acc.carbs += m.recipe.macros.carbs ?? 0;
      acc.fat += m.recipe.macros.fat ?? 0;
      return acc;
    },
    { calories: 0, protein: 0, carbs: 0, fat: 0 },
  );

  return {
    dateISO,
    label: weekdayLabel(dateISO),
    ...totals,
    mealsCount: dayMeals.length,
  };
}

function MacroRow({
  label,
  value,
  unit,
}: {
  label: string;
  value: string;
  unit: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <small>{label}</small>
      <small className="font-medium tabular-nums">
        {value}
        {value !== "—" && <small className="text-xs"> {unit}</small>}
      </small>
    </div>
  );
}

export function WeeklyMealOverview({
  weekDates,
  meals,
}: {
  weekDates: string[];
  meals: Meal[];
}) {
  const days = useMemo(
    () => weekDates.map((d) => sumDay(meals, d)),
    [weekDates, meals],
  );

  const isWeekEmpty = days.every((d) => d.mealsCount === 0);

  const [selectedDayISO, setSelectedDayISO] = useState<string>(
    () => weekDates[0] ?? "",
  );

  // ✅ If weekDates changes (new week fetched), keep selection valid
  useEffect(() => {
    if (!selectedDayISO) {
      setSelectedDayISO(weekDates[0] ?? "");
      return;
    }
    if (weekDates.length && !weekDates.includes(selectedDayISO)) {
      setSelectedDayISO(weekDates[0] ?? "");
    }
  }, [weekDates, selectedDayISO]);

  const selectedMeals = useMemo(
    () => meals.filter((m) => m.dayISO === selectedDayISO),
    [meals, selectedDayISO],
  );

  if (isWeekEmpty) {
    return (
      <section className="px-4 py-2">
        <header>
          <h2>Weekly Overview </h2>
          <small>Daily macro totals from all meals across the week.</small>
        </header>

        <p className="mt-4">
          No meals planned this week yet. Here are general guidelines to get
          started.
        </p>
      </section>
    );
  }

  return (
    <section className="px-4 py-2">
      <header>
        <h2>Weekly Overview </h2>
        <small>Daily macro totals from all meals across the week.</small>
      </header>

      {/* Day cards */}
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {days.map((d) => {
          const empty = d.mealsCount === 0;
          const isActive = d.dateISO === selectedDayISO;

          return (
            <button
              key={d.dateISO}
              type="button"
              onClick={() => setSelectedDayISO(d.dateISO)}
              className={[
                "ui-border-soft rounded-xl p-4 text-left transition-colors",
                "hover:bg-foreground/5 cursor-pointer hover-anim",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground/20",
                isActive ? "bg-foreground/5" : "",
              ].join(" ")}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-baseline gap-2">
                  <small className="font-semibold">{d.label}</small>
                  <small className="tabular-nums">{d.dateISO}</small>
                </div>
                <small>{empty ? "No meals" : `${d.mealsCount} meals`}</small>
              </div>

              <div className="mt-3 space-y-2">
                <MacroRow
                  label="Calories"
                  value={empty ? "—" : n(d.calories)}
                  unit="kcal"
                />
                <MacroRow
                  label="Protein"
                  value={empty ? "—" : n(d.protein)}
                  unit="g"
                />
                <MacroRow
                  label="Carbs"
                  value={empty ? "—" : n(d.carbs)}
                  unit="g"
                />
                <MacroRow label="Fat" value={empty ? "—" : n(d.fat)} unit="g" />
              </div>

              <div className="mt-3 flex items-center gap-2 text-xs">
                <small>{empty ? "Add meals" : "View meals"}</small>
                <MoveRight size={14} className="text-muted-foreground" />
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected day detail */}
      <div className="mt-4 ui-border-soft rounded-xl p-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-sm font-semibold">
              Meals for <small className="tabular-nums">{selectedDayISO}</small>
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              {selectedMeals.length
                ? "All meals planned for this day."
                : "No meals planned for this day yet."}
            </p>
          </div>

          {selectedMeals.length === 0 && (
            <button className="btn btn-secondary shrink-0">Add meals</button>
          )}
        </div>

        {selectedMeals.length > 0 && (
          <div className="mt-3 divide-y divide-foreground/50">
            {selectedMeals.map((m) => (
              <div
                key={m.id}
                className="py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
              >
                {/* Meal info */}
                <div className="min-w-0 flex flex-col gap-2">
                  {/* Title row */}
                  <div className="flex items-center gap-2 min-w-0">
                    <small className="text-xs rounded-full ui-border-soft px-2 py-0.5 shrink-0">
                      {m.recipe.type}
                    </small>
                    <p className="text-sm font-medium truncate">
                      {m.recipe.title}
                    </p>
                  </div>

                  {/* Meta row */}
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-muted-foreground">
                    <small className="text-xs">{m.time24h}</small>

                    <Dot className="size-4" />

                    <div className="flex items-center gap-1">
                      <Flame size={16} className="text-red-500" />
                      <small className="text-xs">
                        {m.recipe.macros.calories} kcal
                      </small>
                    </div>

                    <Dot className="size-4" />

                    <div className="flex items-center gap-1">
                      <Clock size={16} />
                      <small className="text-xs">
                        {m.recipe.readyInMinutes} min
                      </small>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 sm:shrink-0">
                  <Link
                    href={
                      m.recipe.type === "saved"
                        ? `/recipe-search/${m.recipe.recipeID}`
                        : `/library/${m.recipe.recipeID}`
                    }
                    className="btn btn-ghost w-full sm:w-auto"
                  >
                    View
                  </Link>
                  <button className="btn btn-secondary w-full sm:w-auto">
                    Replace
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
