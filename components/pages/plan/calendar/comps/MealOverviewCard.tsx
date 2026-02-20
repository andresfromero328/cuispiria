import React from "react";
import type { Meal } from "../Calendar";
import Image from "next/image";

interface Props {
  meal: Meal;
  density?: "default" | "compact";
  onEdit?: () => void;
  onRemove?: () => void;
  showImage?: boolean;
  layout?: "stack" | "row";
}

function formatDateHuman(dayISO?: string) {
  if (!dayISO) return "—";
  const [y, m, d] = dayISO.split("-").map(Number);
  if (!y || !m || !d) return "—";
  const dt = new Date(y, m - 1, d);
  return dt.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatTimeHuman(time24h?: string) {
  if (!time24h) return "—";
  const [hh, mm] = time24h.split(":").map(Number);
  if (hh == null || mm == null) return "—";
  const dt = new Date();
  dt.setHours(hh, mm, 0, 0);
  return dt.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatPrep(prepMinutes?: number) {
  if (!Number.isFinite(prepMinutes) || (prepMinutes ?? 0) <= 0) return "—";
  const p = prepMinutes!;
  if (p < 60) return `${p} min`;
  const h = Math.floor(p / 60);
  const m = p % 60;
  return m ? `${h} hr ${m} min` : `${h} hr`;
}

function MacroPill({
  label,
  value,
  unit,
}: {
  label: string;
  value: number;
  unit: string;
}) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[11px] text-neutral-500 dark:text-neutral-400">
        {label}
      </span>
      <span className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
        {Math.round(value)}
        <span className="ml-1 text-xs font-medium text-neutral-500 dark:text-neutral-400">
          {unit}
        </span>
      </span>
    </div>
  );
}

const MealOverviewCard = ({
  meal,
  density = "default",
  onEdit,
  onRemove,
  showImage = true,
  layout = "stack",
}: Props) => {
  const compact = density === "compact";
  const row = layout === "row";

  const r = meal.recipe; // ✅ snapshot
  const title = r?.title ?? "Untitled meal";
  const image = r?.image ?? "";
  const prep = r?.readyInMinutes ?? 0;
  const type = r?.type ?? "saved";
  const dish = r?.dishTypes?.[0] ?? "Unknown";
  const macros = r?.macros ?? { calories: 0, protein: 0, carbs: 0, fat: 0 };

  return (
    <article className="group w-full overflow-hidden rounded-md bg-[oklch(95%_0.02_95)] border border-foreground shadow-sm hover:shadow-md flex flex-col gap-2">
      <div
        className={[
          compact
            ? "flex flex-col w-full min-w-0"
            : row
              ? "flex flex-col md:flex-row w-full min-w-0"
              : "flex flex-col w-full min-w-0",
        ].join(" ")}
      >
        {showImage ? (
          <div
            className={[
              "relative overflow-hidden bg-neutral-100",
              compact
                ? "h-28 w-full"
                : row
                  ? "h-44 w-full md:h-auto md:w-64"
                  : "h-44 w-full",
            ].join(" ")}
          >
            {image ? (
              <Image
                src={image}
                alt={title}
                width={800}
                height={600}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <span className="text-sm font-medium text-neutral-400">
                  [image]
                </span>
              </div>
            )}
          </div>
        ) : null}

        <div
          className={[
            "flex flex-col gap-2 min-w-0 flex-1",
            compact ? "p-3" : "p-4",
          ].join(" ")}
        >
          <h3
            className={
              compact
                ? "text-sm font-semibold line-clamp-2"
                : "text-base font-semibold line-clamp-2"
            }
          >
            {title}
          </h3>

          <div className="min-w-0 flex flex-wrap gap-x-3 gap-y-1 text-xs text-neutral-500 dark:text-neutral-400">
            <span className="truncate">{formatDateHuman(meal.dayISO)}</span>
            <span className="truncate">{formatTimeHuman(meal.time24h)}</span>
            <span className="truncate">{formatPrep(prep)}</span>
            <span className="truncate">{type}</span>
            <span className="truncate">{dish}</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <MacroPill label="Calories" value={macros.calories} unit="kcal" />
            <MacroPill label="Protein" value={macros.protein} unit="g" />
            <MacroPill label="Carbs" value={macros.carbs} unit="g" />
            <MacroPill label="Fat" value={macros.fat} unit="g" />
          </div>

          <div className="mt-3 flex gap-2 opacity-0 transition group-hover:opacity-100">
            <button
              type="button"
              onClick={onEdit}
              className="btn rounded-lg px-3 py-1.5 text-sm hover:bg-neutral-100 dark:hover:bg-neutral-900/40"
            >
              <small>Edit</small>
            </button>
            <button
              type="button"
              onClick={onRemove}
              className="btn rounded-lg px-3 py-1.5 text-sm hover:bg-neutral-100 dark:hover:bg-neutral-900/40"
            >
              Remove
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};

export default MealOverviewCard;
