import React, { useEffect, useState } from "react";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toDateISO } from "@/lib/calendar/helpers";
interface Props {
  weekDays: Date[];
  defaultDayISO: string;
  onAdd: (dateISO: string, time24h: string) => void;
}

const WeekAddMealPopOver = ({ weekDays, defaultDayISO, onAdd }: Props) => {
  const [open, setOpen] = useState(false);
  const [dayISO, setDayISO] = useState(defaultDayISO);
  const [time, setTime] = useState("08:00");

  // Keep default selection aligned when week changes
  useEffect(() => {
    setDayISO(defaultDayISO);
  }, [defaultDayISO]);

  return (
    <div className="relative">
      <Dialog open={open} onOpenChange={setOpen}>
        <form>
          <DialogTrigger asChild>
            <Button className="btn btn-primary w-full md:w-fit">
              Add Meal
            </Button>
          </DialogTrigger>
          <DialogContent className="h-4/5 w-4/5 md:max-w-106 md:h-auto">
            <DialogHeader>
              <DialogTitle className="text-left">Add Meal</DialogTitle>
              <DialogDescription className="text-left">
                Select the day and time for your new meal.
              </DialogDescription>
            </DialogHeader>

            <div className="flex flex-col gap-4 justify-center">
              <div className="flex flex-col gap-2">
                <p className="font-semibold text-muted-foreground">Day:</p>
                <div className="grid grid-cols-4 gap-2">
                  {weekDays.map((d) => {
                    const iso = toDateISO(d);
                    const active = iso === dayISO;
                    return (
                      <button
                        key={iso}
                        type="button"
                        onClick={() => setDayISO(iso)}
                        className={[
                          "btn flex-col items-start bg-muted",
                          active ? "brightness-95" : "hover-anim",
                        ].join(" ")}
                      >
                        <div className="text-xs font-semibold">
                          {d.toLocaleDateString(undefined, {
                            weekday: "short",
                          })}
                        </div>
                        <div className="text-[11px] opacity-80">
                          {d.getMonth() + 1}/{d.getDate()}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="mb-3">
                <p className="font-semibold text-muted-foreground">Time:</p>
                <input
                  type="time"
                  value={time}
                  step={30 * 60}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-100"
                />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button
                  variant="ghost"
                  className="flex-1 btn btn-secondary"
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </Button>
              </DialogClose>
              <Button
                type="submit"
                className="btn btn-primary flex-1 "
                onClick={() => {
                  onAdd(dayISO, time);
                  setOpen(false);
                }}
              >
                Add
              </Button>
            </DialogFooter>
          </DialogContent>
        </form>
      </Dialog>
    </div>
  );
};

export default WeekAddMealPopOver;
