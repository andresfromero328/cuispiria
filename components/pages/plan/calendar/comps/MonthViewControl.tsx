import { Button } from "@/components/ui/button";
import React from "react";

type CalendarView = "month" | "week" | "day";

interface Props {
  value: CalendarView;
  onChange: (v: CalendarView) => void;
}

const MonthViewControl = ({ value, onChange }: Props) => {
  const items: CalendarView[] = ["month", "week", "day"];
  return (
    <div className="inline-flex gap-1">
      {items.map((it) => {
        const active = value === it;
        return (
          <Button
            key={it}
            onClick={() => onChange(it)}
            className={["btn bg-calendar-btn", active && "bg-primary"].join(
              " "
            )}
          >
            {it}
          </Button>
        );
      })}
    </div>
  );
};

export default MonthViewControl;
