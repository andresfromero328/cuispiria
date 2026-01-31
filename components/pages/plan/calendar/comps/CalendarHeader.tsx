import { addDays, endOfWeek, startOfWeek } from "@/lib/calendar/helpers";
import MonthViewControl from "./MonthViewControl";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
// import WeekAddMealPopOver from "./WeekAddMealPopOver";

type CalendarView = "month" | "week" | "day";

interface Props {
  view: CalendarView;
  activeDate: Date;
  onChangeActiveDate: React.Dispatch<React.SetStateAction<Date>>;
  onChangeView: (v: CalendarView) => void;
  onAddMeal: (dateISO: Date, time24h: string) => void;
}

function formatMonthYear(d: Date) {
  return d.toLocaleDateString(undefined, { month: "long", year: "numeric" });
}

function formatWeekRange(d: Date) {
  const s = startOfWeek(d);
  const e = endOfWeek(d);
  const left = s.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
  const right = e.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  return `${left} – ${right}`;
}

function formatDayTitle(d: Date) {
  return d.toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

const CalendarHeader = ({
  view,
  activeDate,
  onChangeActiveDate,
  onChangeView,
  // onAddMeal,
}: Props) => {
  const title =
    view === "month"
      ? formatMonthYear(activeDate)
      : view === "week"
        ? formatWeekRange(activeDate)
        : formatDayTitle(activeDate);

  function goPrev() {
    onChangeActiveDate((d) => {
      if (view === "month")
        return new Date(d.getFullYear(), d.getMonth() - 1, 1);
      if (view === "week") return addDays(d, -7);
      return addDays(d, -1);
    });
  }

  function goNext() {
    onChangeActiveDate((d) => {
      if (view === "month")
        return new Date(d.getFullYear(), d.getMonth() + 1, 1);
      if (view === "week") return addDays(d, 7);
      return addDays(d, 1);
    });
  }

  function goToday() {
    onChangeActiveDate(new Date());
  }

  return (
    <div className="flex flex-col md:flex-row gap-2">
      <div className="flex-1 flex flex-col md:flex-row gap-2 items-center justify-between border bg-background shadow-sm px-4 py-2">
        <div className="min-w-0 flex-1">
          <h2 className="truncate">{title}</h2>
        </div>

        <div className="flex-1 inline-flex items-center gap-2">
          <Button className="btn bg-calendar-btn" onClick={goPrev}>
            <ArrowLeft size={18} />
          </Button>
          <Button className="btn bg-calendar-btn" onClick={goToday}>
            <small>Today</small>
          </Button>
          <Button className="btn bg-calendar-btn" onClick={goNext}>
            <ArrowRight size={18} />
          </Button>
        </div>

        <MonthViewControl value={view} onChange={onChangeView} />
      </div>
      {/* <div className="border bg-background shadow-sm px-4 py-2">
        <WeekAddMealPopOver
          defaultDayISO={activeDate}
          onAdd={(dateISO, time24h) => onAddMeal(dateISO, time24h)}
        />
      </div> */}
    </div>
  );
};

export default CalendarHeader;
