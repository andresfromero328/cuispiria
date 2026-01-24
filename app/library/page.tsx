import React from "react";

import LibraryList from "@/components/pages/library/LibraryList";

type RecipeSource = "saved" | "custom";

export type RecipePreview = {
  id: string;
  source: RecipeSource;

  title: string;
  imageUrl?: string | null;

  prepMinutes: number;
  mealType: "Breakfast" | "Lunch" | "Dinner" | "Snack";

  healthScore: number; // 0-100
  rating?: number; // only for saved recipes (custom won't have it)
};

const MOCK_RECIPES: RecipePreview[] = [
  {
    id: "r1",
    source: "saved",
    title: "Greek Yogurt Berry Parfait",
    imageUrl: null,
    prepMinutes: 8,
    mealType: "Breakfast",
    healthScore: 86,
    rating: 4.6,
  },
  {
    id: "r2",
    source: "custom",
    title: "Andres' Overnight Oats (Greek Yogurt Base)",
    imageUrl: null,
    prepMinutes: 10,
    mealType: "Breakfast",
    healthScore: 91,
    // rating intentionally omitted
  },
  {
    id: "r3",
    source: "saved",
    title: "Air Fryer Salmon Bowl",
    imageUrl: null,
    prepMinutes: 22,
    mealType: "Dinner",
    healthScore: 78,
    rating: 4.4,
  },
  {
    id: "r4",
    source: "custom",
    title: "Quick Chicken Avocado Wrap",
    imageUrl: null,
    prepMinutes: 12,
    mealType: "Lunch",
    healthScore: 73,
  },
  {
    id: "r5",
    source: "saved",
    title: "High-Protein Turkey Chili",
    imageUrl: null,
    prepMinutes: 40,
    mealType: "Dinner",
    healthScore: 82,
    rating: 4.7,
  },
  {
    id: "r6",
    source: "custom",
    title: "5-Minute Cottage Cheese Snack Plate",
    imageUrl: null,
    prepMinutes: 5,
    mealType: "Snack",
    healthScore: 69,
  },
];

const LibraryPage = () => {
  return (
    <main className="w-full max-w-7xl mx-auto flex-1 flex flex-col gap-5">
      <section className="flex flex-col gap-5 px-4 py-2">
        <header>
          <h2>Library</h2>
          <small>Explore and manage your collection of recipes.</small>
        </header>
      </section>
      <LibraryList recipes={MOCK_RECIPES} />
    </main>
  );
};

export default LibraryPage;
