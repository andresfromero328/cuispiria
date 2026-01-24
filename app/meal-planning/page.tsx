import { Calendar, Meal } from "@/components/pages/plan/calendar/Calendar";
import React from "react";

const meals: Meal[] = [
  {
    id: "m-001",
    title: "Greek Yogurt Berry Bowl",
    description: "Creamy yogurt with berries and granola.",
    dateISO: "2026-01-19",
    time24h: "08:00",
    prepMinutes: 8,
    type: "Breakfast",
    macros: { calories: 420, protein: 28, carbs: 52, fat: 12 },
    ingredients: [
      { name: "Greek yogurt", amount: 200, unit: "g" },
      { name: "Mixed berries", amount: 120, unit: "g" },
      { name: "Granola", amount: 45, unit: "g" },
      { name: "Honey", amount: 1, unit: "tbsp" },
    ],
    instructions: [
      "Add yogurt to a bowl.",
      "Top with berries and granola.",
      "Drizzle honey and serve.",
    ],
  },
  {
    id: "m-002",
    title: "Avocado Egg Toast",
    dateISO: "2026-01-19",
    time24h: "10:30",
    prepMinutes: 15,
    type: "Breakfast",
    macros: { calories: 520, protein: 24, carbs: 42, fat: 28 },
    ingredients: [
      { name: "Bread", amount: 2, unit: "slice" },
      { name: "Greek yogurt", amount: 2, unit: "tbsp" },
      { name: "Avocado", amount: 1, unit: "piece" },
      { name: "Eggs", amount: 2, unit: "piece" },
    ],
    instructions: [
      "Toast the bread.",
      "Cook eggs to preference.",
      "Mash avocado and spread on toast.",
      "Top with eggs and serve.",
    ],
  },
  {
    id: "m-003",
    title: "Turkey Hummus Wrap",
    dateISO: "2026-01-19",
    time24h: "12:30",
    prepMinutes: 10,
    type: "Lunch",
    macros: { calories: 510, protein: 35, carbs: 48, fat: 18 },
    ingredients: [
      { name: "Tortilla", amount: 1, unit: "piece" },
      { name: "Turkey breast", amount: 120, unit: "g" },
      { name: "Hummus", amount: 3, unit: "tbsp" },
      { name: "Cucumber", amount: 80, unit: "g" },
    ],
    instructions: [
      "Spread hummus on tortilla.",
      "Add turkey and cucumber.",
      "Roll tightly and slice.",
    ],
  },
  {
    id: "m-004",
    title: "Chicken Rice Bowl",
    dateISO: "2026-01-19",
    time24h: "19:00",
    prepMinutes: 25,
    type: "Dinner",
    macros: { calories: 680, protein: 48, carbs: 70, fat: 22 },
    ingredients: [
      { name: "Chicken breast", amount: 180, unit: "g" },
      { name: "Cooked rice", amount: 1, unit: "cup" },
      { name: "Black beans", amount: 0.5, unit: "cup" },
      { name: "Avocado", amount: 0.5, unit: "piece" },
    ],
    instructions: [
      "Cook chicken until done.",
      "Warm rice and beans.",
      "Assemble bowl and top with avocado.",
    ],
  },
  {
    id: "m-005",
    title: "Apple with Peanut Butter",
    dateISO: "2026-01-19",
    time24h: "16:00",
    prepMinutes: 3,
    type: "Snack",
    macros: { calories: 260, protein: 7, carbs: 28, fat: 14 },
    ingredients: [
      { name: "Apple", amount: 1, unit: "piece" },
      { name: "Peanut butter", amount: 1.5, unit: "tbsp" },
    ],
    instructions: [
      "Slice apple.",
      "Serve with peanut butter.",
    ],
  },
  {
    id: "m-006",
    title: "Overnight Oats",
    dateISO: "2026-01-20",
    time24h: "08:00",
    prepMinutes: 7,
    type: "Breakfast",
    macros: { calories: 460, protein: 20, carbs: 68, fat: 14 },
    ingredients: [
      { name: "Rolled oats", amount: 0.5, unit: "cup" },
      { name: "Milk", amount: 0.5, unit: "cup" },
      { name: "Banana", amount: 1, unit: "piece" },
    ],
    instructions: [
      "Mix oats and milk.",
      "Refrigerate overnight.",
      "Top with banana before serving.",
    ],
  },
  {
    id: "m-007",
    title: "Tuna Salad Toast",
    dateISO: "2026-01-20",
    time24h: "12:00",
    prepMinutes: 12,
    type: "Lunch",
    macros: { calories: 540, protein: 40, carbs: 44, fat: 20 },
    ingredients: [
      { name: "Canned tuna", amount: 140, unit: "g" },
      { name: "Greek yogurt", amount: 2, unit: "tbsp" },
      { name: "Bread", amount: 2, unit: "slice" },
    ],
    instructions: [
      "Mix tuna with yogurt.",
      "Toast bread.",
      "Spread tuna on toast.",
    ],
  },
  {
    id: "m-008",
    title: "Salmon with Roasted Vegetables",
    dateISO: "2026-01-20",
    time24h: "19:30",
    prepMinutes: 35,
    type: "Dinner",
    macros: { calories: 720, protein: 46, carbs: 54, fat: 34 },
    ingredients: [
      { name: "Salmon fillet", amount: 180, unit: "g" },
      { name: "Broccoli", amount: 200, unit: "g" },
      { name: "Sweet potato", amount: 250, unit: "g" },
    ],
    instructions: [
      "Roast vegetables until tender.",
      "Bake salmon until flaky.",
      "Serve together.",
    ],
  },
  {
    id: "m-009",
    title: "Cottage Cheese and Pineapple",
    dateISO: "2026-01-20",
    time24h: "15:30",
    prepMinutes: 4,
    type: "Snack",
    macros: { calories: 220, protein: 20, carbs: 24, fat: 4 },
    ingredients: [
      { name: "Cottage cheese", amount: 200, unit: "g" },
      { name: "Pineapple", amount: 120, unit: "g" },
    ],
    instructions: [
      "Add cottage cheese to bowl.",
      "Top with pineapple.",
    ],
  },
  {
    id: "m-010",
    title: "Protein Smoothie",
    dateISO: "2026-01-21",
    time24h: "07:45",
    prepMinutes: 6,
    type: "Breakfast",
    macros: { calories: 380, protein: 35, carbs: 42, fat: 8 },
    ingredients: [
      { name: "Protein powder", amount: 1, unit: "scoop" },
      { name: "Frozen berries", amount: 1, unit: "cup" },
      { name: "Milk", amount: 1, unit: "cup" },
    ],
    instructions: [
      "Add all ingredients to blender.",
      "Blend until smooth.",
    ],
  },
  {
    id: "m-011",
    title: "Quinoa Chickpea Salad",
    dateISO: "2026-01-21",
    time24h: "12:30",
    prepMinutes: 20,
    type: "Lunch",
    macros: { calories: 610, protein: 22, carbs: 86, fat: 20 },
    ingredients: [
      { name: "Cooked quinoa", amount: 1, unit: "cup" },
      { name: "Chickpeas", amount: 0.75, unit: "cup" },
      { name: "Cucumber", amount: 120, unit: "g" },
    ],
    instructions: [
      "Combine all ingredients in a bowl.",
      "Toss and serve.",
    ],
  },
  {
    id: "m-012",
    title: "Beef Stir-Fry",
    dateISO: "2026-01-21",
    time24h: "19:15",
    prepMinutes: 30,
    type: "Dinner",
    macros: { calories: 760, protein: 52, carbs: 64, fat: 30 },
    ingredients: [
      { name: "Beef strips", amount: 180, unit: "g" },
      { name: "Bell pepper", amount: 1, unit: "piece" },
      { name: "Broccoli", amount: 180, unit: "g" },
      { name: "Soy sauce", amount: 2, unit: "tbsp" },
    ],
    instructions: [
      "Cook beef in hot pan.",
      "Add vegetables and stir-fry.",
      "Add soy sauce and toss.",
    ],
  },
  {
    id: "m-013",
    title: "Dark Chocolate and Almonds",
    dateISO: "2026-01-21",
    time24h: "21:00",
    prepMinutes: 2,
    type: "Dessert",
    macros: { calories: 240, protein: 6, carbs: 16, fat: 18 },
    ingredients: [
      { name: "Dark chocolate", amount: 25, unit: "g" },
      { name: "Almonds", amount: 20, unit: "g" },
    ],
    instructions: [
      "Plate chocolate and almonds.",
    ],
  },
  {
    id: "m-014",
    title: "Egg Fried Rice",
    dateISO: "2026-01-22",
    time24h: "12:15",
    prepMinutes: 18,
    type: "Lunch",
    macros: { calories: 640, protein: 24, carbs: 88, fat: 20 },
    ingredients: [
      { name: "Cooked rice", amount: 2, unit: "cup" },
      { name: "Eggs", amount: 2, unit: "piece" },
      { name: "Frozen peas", amount: 0.5, unit: "cup" },
    ],
    instructions: [
      "Cook eggs in pan.",
      "Add rice and peas.",
      "Stir-fry until hot.",
    ],
  },
  {
    id: "m-015",
    title: "Shrimp Tacos",
    dateISO: "2026-01-22",
    time24h: "19:00",
    prepMinutes: 28,
    type: "Dinner",
    macros: { calories: 690, protein: 44, carbs: 64, fat: 26 },
    ingredients: [
      { name: "Shrimp", amount: 220, unit: "g" },
      { name: "Tortillas", amount: 3, unit: "piece" },
      { name: "Cabbage", amount: 160, unit: "g" },
    ],
    instructions: [
      "Cook shrimp in pan.",
      "Warm tortillas.",
      "Assemble tacos with cabbage.",
    ],
  },
  {
    id: "m-016",
    title: "Trail Mix",
    dateISO: "2026-01-23",
    time24h: "15:00",
    prepMinutes: 5,
    type: "Snack",
    macros: { calories: 310, protein: 9, carbs: 24, fat: 20 },
    ingredients: [
      { name: "Mixed nuts", amount: 30, unit: "g" },
      { name: "Dried fruit", amount: 20, unit: "g" },
    ],
    instructions: [
      "Combine nuts and dried fruit.",
      "Portion into container.",
    ],
  },
];


const MealPlanningPage = () => {
  return (
    <main className="w-full max-w-7xl mx-auto flex-1 flex flex-col gap-5">
      <section className="flex flex-col gap-5 px-4 py-2">
        <header>
          <h2>Meal Planning</h2>
          <small>
            Organize your meals and keep your plans simple and clear.
          </small>
        </header>
        <Calendar meals={meals} />
      </section>
    </main>
  );
};

export default MealPlanningPage;
