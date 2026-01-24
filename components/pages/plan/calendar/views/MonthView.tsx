import React from "react";
import { Meal } from "../Calendar";
import { pad2 } from "@/lib/calendar/helpers";
import { Button } from "@/components/ui/button";

interface Props {
  activeDate: Date;
  onPickDay: (d: Date) => void;
  mealsByDate: Map<string, Meal[]>;
}

const WEEK_STARTS_ON_MONDAY = true;

function startOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

function endOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth() + 1, 0);
}

function addDays(d: Date, days: number) {
  const nd = new Date(d);
  nd.setDate(nd.getDate() + days);
  return nd;
}

function startOfWeek(d: Date) {
  const nd = new Date(d);
  const day = nd.getDay(); // 0 Sun ... 6 Sat
  const offset = WEEK_STARTS_ON_MONDAY ? (day === 0 ? -6 : 1 - day) : -day;
  return addDays(nd, offset);
}

function endOfWeek(d: Date) {
  return addDays(startOfWeek(d), 6);
}

function getMonthGridDays(activeDate: Date) {
  const first = startOfMonth(activeDate);
  const last = endOfMonth(activeDate);
  const gridStart = startOfWeek(first);
  const gridEnd = endOfWeek(last);

  const days: Date[] = [];
  for (let d = gridStart; d <= gridEnd; d = addDays(d, 1)) days.push(d);
  return days;
}

function toDateISO(d: Date) {
  const y = d.getFullYear();
  const m = pad2(d.getMonth() + 1);
  const day = pad2(d.getDate());
  return `${y}-${m}-${day}`;
}

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

const MonthView = ({ activeDate, onPickDay, mealsByDate }: Props) => {
  const days = getMonthGridDays(activeDate);
  const month = activeDate.getMonth();
  const today = new Date();

  const weekdayLabels = React.useMemo(() => {
    const base = startOfWeek(new Date(2026, 0, 5));
    return Array.from({ length: 7 }).map((_, i) => {
      const d = addDays(base, i);
      return d.toLocaleDateString(undefined, { weekday: "short" });
    });
  }, []);

  return (
    <div className="border bg-background shadow-sm p-3">
      <div className="grid grid-cols-7 gap-2 px-2 pb-2">
        {weekdayLabels.map((w) => (
          <div
            key={w}
            className="text-xs font-medium"
          >
            {w}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {days.map((d) => {
          const inMonth = d.getMonth() === month;
          const iso = toDateISO(d);
          const count = mealsByDate.get(iso)?.length ?? 0;
          const isToday = isSameDay(d, today);

          return (
            <Button
              key={iso}
              type="button"
              onClick={() => onPickDay(d)}
              className={[
                "cursor-pointer h-24 border p-2 text-left transition hover:bg-primary/25 ",
                inMonth
                  ? "bg-[oklch(95% 0.02 95)]hover:brightness-75"
                  : "border-neutral-100 bg-muted opacity-50 text-neutral-500 hover:bg-neutral-100",
                isToday && "bg-primary!",
              ].join(" ")}
            >
              <div className="flex flex-col items-center md:items-start h-full w-full">
                <div className="text-sm font-semibold">{d.getDate()}</div>
                {count > 0 ? (
                  <small className="rounded-md py-1 px-3 w-fit mt-auto md:ml-auto border border-foreground bg-primary/50 shadow-sm">
                    {count}
                  </small>
                ) : null}
              </div>
            </Button>
          );
        })}
      </div>
    </div>
  );
};

export default MonthView;
