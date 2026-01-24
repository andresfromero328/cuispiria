import React from "react";
import { Meal } from "../Calendar";
import MealOverviewCard from "../comps/MealOverviewCard";

interface Props {
  activeDate: Date;
  meals: Meal[];
  onEditMeal: (mealId: string) => void;
  onRemoveMeal: (mealId: string) => void;
}

function compareTime24h(a: string, b: string) {
  return a.localeCompare(b);
}

function timeBucketLabel(time24h: string) {
  const [hh] = time24h.split(":").map(Number);
  const h = hh ?? 0;
  if (h >= 5 && h < 11) return "Morning";
  if (h >= 11 && h < 17) return "Afternoon";
  if (h >= 17 && h < 22) return "Evening";
  return "Late";
}

const DayView = ({
  meals,
  onEditMeal,
  onRemoveMeal,
}: Props) => {
  const list = [...meals].sort((a, b) => compareTime24h(a.time24h, b.time24h));

  const groups = list.reduce<Record<string, Meal[]>>((acc, m) => {
    const label = timeBucketLabel(m.time24h);
    (acc[label] ||= []).push(m);
    return acc;
  }, {});
  const groupOrder = ["Morning", "Afternoon", "Evening", "Late"].filter(
    (k) => groups[k]?.length
  );

  return (
    <div className="border bg-background p-3 shadow-sm">
      {list.length === 0 ? (
        <div className="flex flex-col gap-2 rounded-2xl border border-dashed border-foreground-300 p-6">
          <p>
          Nothing planned yet.
          </p>
          <small>
            Add a meal with a time to get started.
          </small>
        </div>
      ) : (
        <div className="space-y-7">
          {groupOrder.map((label) => (
            <div key={label}>
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide">
                {label}
              </h3>

              <div className="space-y-3">
                {groups[label].map((m) => (
                  <div key={m.id} className="relative">
                    <div className="absolute left-3 top-0 hidden h-full w-px md:block" />
                    <div className="absolute left-2.25 top-8 hidden h-3 w-3 rounded-full border" />

                    <div className="md:pl-8">
                      <MealOverviewCard
                        meal={m}
                        onEdit={() => onEditMeal(m.id)}
                        onRemove={() => onRemoveMeal(m.id)}
                        layout="row"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DayView;
