import { Ingredients, SavedRecipeType } from "@/types/recipeTypes";
import mongoose, { Schema } from "mongoose";

//* User Related Schemas */
interface UserSchemaType {
  name?: string | null;
  email: string;
  image?: string | null;
  provider: "google";
  providerAccountId: string;
}
const UserSchema = new Schema<UserSchemaType>(
  {
    name: { type: String, default: null },
    email: { type: String, required: true, unique: true, index: true },
    image: { type: String, default: null },
    provider: { type: String, required: true, enum: ["google"] },
    providerAccountId: { type: String, required: true },
  },
  { timestamps: true },
);

//* SavedRecipe Related Schemas */
const MacrosSchema = new Schema(
  {
    protein: { type: Number, required: true },
    carbs: { type: Number, required: true },
    fat: { type: Number, required: true },
    calories: { type: Number, required: true },
  },
  { _id: false },
);
const IngredientMeasureSchema = new Schema(
  {
    amount: { type: Number, required: true },
    unitShort: { type: String, required: true, trim: true },
    unitLong: { type: String, required: true, trim: true },
  },
  { _id: false },
);

const IngredientSchema = new Schema(
  {
    id: { type: Number, required: true },
    name: { type: String, required: true, trim: true },
    original: { type: String, required: true, trim: true },
    amount: { type: Number, required: false },
    unit: { type: String, required: false, trim: true },

    measures: {
      us: { type: IngredientMeasureSchema, required: true },
      metric: { type: IngredientMeasureSchema, required: true },
    },
  },
  { _id: false },
);
const SavedRecipeSchema = new Schema<SavedRecipeType>(
  {
    userID: { type: String, required: true, index: true },
    recipeID: { type: Number, required: true },
    image: {
      type: String,
      required: true,
      default: "",
    },
    title: { type: String, required: true, trim: true },
    readyInMinutes: { type: Number, required: true, min: 0 },
    dishTypes: { type: [String], default: [] },
    aggregateLikes: { type: Number, required: true, min: 0, default: 0 },
    healthScore: { type: Number, required: true, min: 0, default: 0 },
    macros: { type: MacrosSchema, required: true },
    ingredients: { type: [IngredientSchema], default: [] },
    type: {
      type: String,
      enum: ["saved", "custom"],
      required: true,
      index: true,
    },
  },
  { timestamps: true },
);

//* MealPlan Related Schemas */
export interface MealRecipeSnapshot {
  recipeID: number;
  type: "saved" | "custom";
  title: string;
  image: string;
  readyInMinutes: number;
  dishTypes: string[];
  macros: {
    protein: number;
    carbs: number;
    fat: number;
    calories: number;
  };
  ingredients: Ingredients[];
  aggregateLikes?: number;
  healthScore?: number;
}

export interface MealPlanMeal {
  time24h: string;
  dateTime: Date;
  recipe: MealRecipeSnapshot;
}

export interface MealPlanDay {
  userID: string;
  dayISO: string;
  meals: MealPlanMeal[];
}

const MealRecipeSnapshotSchema = new Schema<MealRecipeSnapshot>(
  {
    recipeID: { type: Number, required: true, index: true },
    type: {
      type: String,
      required: true,
      enum: ["saved", "custom"],
      index: true,
    },

    title: { type: String, required: true, trim: true },
    image: { type: String, required: true, default: "" },

    readyInMinutes: { type: Number, required: true, min: 0 },
    dishTypes: { type: [String], default: [] },

    macros: { type: MacrosSchema, required: true },
    ingredients: { type: [IngredientSchema], default: [] },

    aggregateLikes: { type: Number, min: 0, default: 0 },
    healthScore: { type: Number, min: 0, default: 0 },
  },
  { _id: false },
);

const MealPlanMealSchema = new Schema<MealPlanMeal>(
  {
    time24h: {
      type: String,
      required: true,
      match: /^([01]\d|2[0-3]):([0-5]\d)$/,
    },
    dateTime: { type: Date, required: true, index: true },

    recipe: { type: MealRecipeSnapshotSchema, required: true },
  },
  { _id: true },
);

const MealPlanDaySchema = new Schema<MealPlanDay>(
  {
    userID: { type: String, required: true, index: true },
    dayISO: { type: String, required: true, index: true },

    meals: { type: [MealPlanMealSchema], default: [] },
  },
  { timestamps: true },
);

// * Assigning Models to Schemas */
const User = mongoose.models.User || mongoose.model("User", UserSchema);
const SavedRecipe =
  mongoose.models.SavedRecipe ||
  mongoose.model("SavedRecipe", SavedRecipeSchema);
const MealPlanDay =
  mongoose.models.MealPlanDay ||
  mongoose.model("MealPlanDay", MealPlanDaySchema);

export { User, SavedRecipe, MealPlanDay };
