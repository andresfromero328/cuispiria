"use client";

import React, { useEffect, useMemo, useState, useTransition } from "react";
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
import { SavedRecipeType } from "@/types/recipeTypes";
import Image from "next/image";
import { Calendar } from "@/components/ui/calendar";
import { Clock, CookingPot, Plus } from "lucide-react";

interface Props {
  recipe?: SavedRecipeType;
  defaultDayISO: Date;
  onAdd: (
    recipe: SavedRecipeType | undefined,
    dateISO: Date,
    time24h: string,
  ) => Promise<void> | void;
}

const AddMealPopOver = ({ defaultDayISO, onAdd, recipe }: Props) => {
  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(defaultDayISO);
  const [time, setTime] = useState("08:00");
  const [isPending, startTransition] = useTransition();

  useEffect(() => setSelectedDate(defaultDayISO), [defaultDayISO]);

  const canSubmit = useMemo(() => {
    if (!recipe) return false;
    if (!selectedDate) return false;
    return /^([01]\d|2[0-3]):([0-5]\d)$/.test(time);
  }, [recipe, selectedDate, time]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="h-9 rounded-lg px-3 text-sm cursor-pointer">
          <Plus size={16} className="mr-2 opacity-80" />
          Add Meal
        </Button>
      </DialogTrigger>

      {/* IMPORTANT: override layout locally (no shadcn changes) */}
      <DialogContent className="p-0 w-[96vw] max-w-lg max-h-[90vh] overflow-y-auto flex flex-col">
        <form
          className="flex h-full flex-col"
          onSubmit={(e) => {
            e.preventDefault();
            if (!canSubmit) return;

            startTransition(async () => {
              await onAdd(recipe, selectedDate, time);
              setOpen(false);
            });
          }}
        >
          {/* Header */}
          <div className="shrink-0 border-b bg-background/40 p-5 backdrop-blur">
            <DialogHeader>
              <DialogTitle className="text-left">Add meal to plan</DialogTitle>
              <DialogDescription className="text-left">
                Pick a day and time. We’ll add it to your meal plan.
              </DialogDescription>
            </DialogHeader>
          </div>

          {/* Body (scrollable if needed) */}
          <div className="min-h-0 flex-1 overflow-y-auto p-5">
            {/* Recipe preview */}
            <div className="flex items-start gap-3 rounded-xl border bg-background/60 p-3 shadow-sm">
              <div className="relative h-14 w-20 overflow-hidden rounded-lg bg-muted shrink-0">
                {recipe?.image ? (
                  <Image
                    src={recipe.image}
                    alt={recipe.title}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 grid place-items-center bg-linear-to-br from-muted to-background">
                    <CookingPot className="opacity-70" size={18} />
                  </div>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-muted-foreground">
                  Meal - {recipe?.dishTypes && recipe?.dishTypes[0]}
                </p>
                <p className="truncate text-sm font-semibold">
                  {recipe?.title ?? "No recipe selected"}
                </p>
              </div>
            </div>

            {/* Day then Time (stacked) */}
            <div className="mt-4 space-y-4">
              <div className="rounded-xl border p-3">
                <p className="mb-2 text-xs font-semibold text-muted-foreground">
                  Day
                </p>

                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
                  className="w-full"
                  startMonth={defaultDayISO}
                  fixedWeeks
                />
              </div>

              <div className="rounded-xl border p-3">
                <p className="mb-2 text-xs font-semibold text-muted-foreground">
                  Time
                </p>

                <div className="flex items-center gap-2 rounded-lg border bg-background px-3 py-2">
                  <Clock size={16} className="opacity-70" />
                  <input
                    type="time"
                    value={time}
                    step={30 * 60}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full bg-transparent text-sm outline-none"
                  />
                </div>

                <p className="mt-2 text-xs text-muted-foreground">
                  Tip: use 30-minute increments.
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="shrink-0 border-t bg-background/40 p-4 backdrop-blur">
            <DialogFooter className="gap-2 sm:gap-2">
              <DialogClose asChild>
                <Button
                  type="button"
                  variant="outline"
                  className="h-9 flex-1 rounded-lg cursor-pointer"
                >
                  Cancel
                </Button>
              </DialogClose>

              <Button
                type="submit"
                className="h-9 flex-1 rounded-lg cursor-pointer"
                disabled={!canSubmit || isPending}
              >
                {isPending ? "Adding..." : "Add"}
              </Button>
            </DialogFooter>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddMealPopOver;
