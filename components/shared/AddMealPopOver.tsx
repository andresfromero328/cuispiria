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
import {
  Clock,
  CookingPot,
  Plus,
  Search,
  Bookmark,
  UtensilsCrossed,
  X,
} from "lucide-react";

type LibraryData = { saved: SavedRecipeType[]; custom: SavedRecipeType[] };

interface Props {
  recipe?: SavedRecipeType;
  library?: LibraryData;
  defaultDayISO: Date;
  onAdd: (
    recipe: SavedRecipeType | undefined,
    dateISO: Date,
    time24h: string,
  ) => Promise<void> | void;
}

const AddMealPopOver = ({ defaultDayISO, onAdd, recipe, library }: Props) => {
  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(defaultDayISO);
  const [time, setTime] = useState("08:00");
  const [isPending, startTransition] = useTransition();

  const [selectedRecipe, setSelectedRecipe] = useState<
    SavedRecipeType | undefined
  >(recipe);
  const [tab, setTab] = useState<"saved" | "custom">("saved");
  const [query, setQuery] = useState("");

  useEffect(() => setSelectedDate(defaultDayISO), [defaultDayISO]);
  useEffect(() => setSelectedRecipe(recipe), [recipe]);

  const canSubmit = useMemo(() => {
    if (!selectedRecipe) return false;
    if (!selectedDate) return false;
    return /^([01]\d|2[0-3]):([0-5]\d)$/.test(time);
  }, [selectedRecipe, selectedDate, time]);

  const list = useMemo(() => {
    const src =
      tab === "saved" ? (library?.saved ?? []) : (library?.custom ?? []);
    const q = query.trim().toLowerCase();
    if (!q) return src;
    return src.filter((r) => r.title.toLowerCase().includes(q));
  }, [library, tab, query]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="h-9 rounded-lg px-3 text-sm cursor-pointer">
          <Plus size={16} className="mr-2 opacity-80" />
          Add Meal
        </Button>
      </DialogTrigger>

      <DialogContent className="p-0 w-[96vw] max-w-lg max-h-[90vh] overflow-hidden flex flex-col">
        <form
          className="flex h-full flex-col"
          onSubmit={(e) => {
            e.preventDefault();
            if (!canSubmit) return;

            startTransition(async () => {
              await onAdd(selectedRecipe, selectedDate, time);
              setOpen(false);
            });
          }}
        >
          {/* Header */}
          <div className="shrink-0 border-b bg-background/40 p-5 backdrop-blur">
            <DialogHeader>
              <DialogTitle className="text-left">Add meal to plan</DialogTitle>
              <DialogDescription className="text-left">
                {selectedRecipe
                  ? "Pick a day and time."
                  : "Choose a recipe, then pick a day and time."}
              </DialogDescription>
            </DialogHeader>
          </div>

          {/* Body */}
          <div className="min-h-0 flex-1 overflow-y-auto p-5 space-y-4">
            {/* Recipe preview OR picker */}
            {selectedRecipe ? (
              <div className="flex items-start gap-3 rounded-xl border bg-background/60 p-3 shadow-sm">
                <div className="relative h-14 w-20 overflow-hidden rounded-lg bg-muted shrink-0">
                  {selectedRecipe.image ? (
                    <Image
                      src={selectedRecipe.image}
                      alt={selectedRecipe.title}
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
                    Meal
                    {selectedRecipe.dishTypes?.[0]
                      ? ` • ${selectedRecipe.dishTypes[0]}`
                      : ""}
                  </p>
                  <p className="truncate text-sm font-semibold">
                    {selectedRecipe.title}
                  </p>
                </div>

                {library && (
                  <button
                    type="button"
                    onClick={() => setSelectedRecipe(undefined)}
                    className="rounded-lg border bg-background px-2 py-2 text-xs shadow-sm hover:bg-muted"
                    aria-label="Change recipe"
                    title="Change recipe"
                  >
                    <X size={14} className="opacity-70" />
                  </button>
                )}
              </div>
            ) : (
              <div className="rounded-xl border bg-background/60 p-3 shadow-sm space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold">Choose a recipe</p>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setTab("saved")}
                      className={[
                        "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs shadow-sm",
                        tab === "saved"
                          ? "bg-background"
                          : "bg-background/50 opacity-80 hover:opacity-100",
                      ].join(" ")}
                    >
                      <Bookmark size={14} className="opacity-80" />
                      Saved
                    </button>

                    <button
                      type="button"
                      onClick={() => setTab("custom")}
                      className={[
                        "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs shadow-sm",
                        tab === "custom"
                          ? "bg-background"
                          : "bg-background/50 opacity-80 hover:opacity-100",
                      ].join(" ")}
                    >
                      <UtensilsCrossed size={14} className="opacity-80" />
                      Custom
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2 rounded-lg border bg-background px-3 py-2">
                  <Search size={16} className="opacity-70" />
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search your recipes…"
                    className="w-full bg-transparent text-sm outline-none"
                  />
                </div>

                {!library ? (
                  <p className="text-sm text-muted-foreground">
                    Pass <code>library</code> to enable selection.
                  </p>
                ) : list.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No matches.</p>
                ) : (
                  <div className="max-h-65 overflow-y-auto rounded-lg border bg-background">
                    {list.map((r) => (
                      <button
                        key={`${r.type}-${r.recipeID}`}
                        type="button"
                        onClick={() => setSelectedRecipe(r)}
                        className="w-full text-left flex items-center gap-3 px-3 py-2 hover:bg-muted"
                      >
                        <div className="relative h-10 w-14 overflow-hidden rounded-md bg-muted shrink-0">
                          {r.image ? (
                            <Image
                              src={r.image}
                              alt={r.title}
                              fill
                              sizes="56px"
                              className="object-cover"
                            />
                          ) : (
                            <div className="absolute inset-0 grid place-items-center bg-linear-to-br from-muted to-background">
                              <CookingPot className="opacity-70" size={16} />
                            </div>
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold">
                            {r.title}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {r.readyInMinutes} min
                            {r.dishTypes?.[0] ? ` • ${r.dishTypes[0]}` : ""}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Day */}
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

            {/* Time */}
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
