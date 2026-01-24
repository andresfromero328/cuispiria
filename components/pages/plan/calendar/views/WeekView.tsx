import React from "react";

import {
  addDays,
  isSameDay,
  startOfWeek,
  toDateISO,
} from "@/lib/calendar/helpers";
import MealOverviewCard from "../comps/MealOverviewCard";
import { Meal } from "../Calendar";

interface Props {
  activeDate: Date;
  onPickDay: (d: Date) => void;
  mealsByDate: Map<string, Meal[]>;
  onEditMeal: (mealId: string) => void;
  onRemoveMeal: (mealId: string) => void;
}

const WeekView = ({
  activeDate,
  onPickDay,
  mealsByDate,
  onEditMeal,
  onRemoveMeal,
}: Props) => {
  const start = startOfWeek(activeDate);
  const days = Array.from({ length: 7 }).map((_, i) => addDays(start, i));
  const today = new Date();

  return (
    <div className="border bg-background p-3 shadow-sm">
  <div className="grid grid-cols-1 gap-3 md:grid-cols-7">
    {days.map((d, index) => {
      const iso = toDateISO(d);
      const list = mealsByDate.get(iso) ?? [];
      const isToday = isSameDay(d, today);

      return (
        <div key={iso} className="min-w-0 flex flex-col">
          {/* 🔹 Mobile divider */}
          {index !== 0 && (
            <div className="md:hidden my-3 h-px bg-[oklch(72%_0.035_95)] opacity-95" />
          )}

          <button
            type="button"
            onClick={() => onPickDay(d)}
            className={[
              "cursor-pointer mb-2 w-full rounded-sm border px-3 py-2 text-left transition",
              "bg-muted hover:bg-primary/25",
              isToday ? "bg-primary!" : "",
            ].join(" ")}
          >
            <div className="flex items-center justify-between">
              <small className="font-semibold">
                {d.toLocaleDateString(undefined, { weekday: "short" })}
              </small>
              <small className="font-semibold">
                {d.getMonth() + 1}/{d.getDate()}
              </small>
            </div>
          </button>

          <div className="min-w-0 flex flex-col gap-2">
            {list.length ? (
              <>
                {list.slice(0, 2).map((m) => (
                  <MealOverviewCard
                    key={m.id}
                    meal={m}
                    density="compact"
                    onEdit={() => onEditMeal(m.id)}
                    onRemove={() => onRemoveMeal(m.id)}
                    showImage={false}
                  />
                ))}
                {list.length > 2 && (
                  <div className="text-xs text-neutral-500">
                    +{list.length - 2} more
                  </div>
                )}
              </>
            ) : (
              <small className="rounded-md border border-dashed py-2 px-4">
                No meals yet
              </small>
            )}
          </div>
        </div>
      );
    })}
  </div>
</div>

  );
};

export default WeekView;
