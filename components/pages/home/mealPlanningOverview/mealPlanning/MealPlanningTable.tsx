import { Clock, Flame } from "lucide-react";
import React from "react";

const MealPlanningTable = () => {
  return (
    <>
      {/* Header (desktop only) */}
      <div className="hidden sm:grid grid-cols-[84px_1fr_120px_160px] gap-3 px-4 py-2 text-xs text-muted-foreground">
        <span>Time</span>
        <span>Meal</span>
        <span className="text-right">Prep</span>
        <span className="text-right">Actions</span>
      </div>

      {/* Rows */}
      <div className="divide-y divide-foreground/50">
        {[1, 2, 3, 4].map((index) => (
          <div
            key={index}
            className="grid grid-cols-[84px_1fr] sm:grid-cols-[84px_1fr_120px_160px] gap-3 px-2 py-3 items-center"
          >
            {/* Time */}
            <div className="text-sm font-medium tabular-nums">[time]</div>

            {/* Meal summary */}
            <div className="min-w-0 flex flex-col gap-1">
              {/* Title row */}
              <div className="flex items-center gap-2 min-w-0">
                <small className="text-xs rounded-full ui-border-soft px-2 py-0.5 text-muted-foreground shrink-0">
                  [type]
                </small>
                <p className="truncate">[title]</p>
              </div>

              {/* Secondary row */}
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Flame size={14} className="text-red-500" />
                  <span>250 kcal</span>
                </div>

                {/* ✅ Prep time on mobile */}
                <div className="flex items-center gap-1 sm:hidden">
                  <Clock size={14} />
                  <span>30 min</span>
                </div>
              </div>
            </div>

            {/* Prep (desktop) */}
            <div className="hidden sm:block text-sm text-right text-muted-foreground">
              30 min
            </div>

            {/* Actions (desktop) */}
            <div className="hidden sm:flex justify-end gap-2">
              <button className="btn btn-ghost">View</button>
              <button className="btn btn-secondary">Replace</button>
            </div>

            {/* Actions (mobile) */}
            <div className="sm:hidden col-span-2 flex gap-2 pt-1">
              <button className="btn btn-ghost w-full">View</button>
              <button className="btn btn-secondary w-full">Replace</button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default MealPlanningTable;
