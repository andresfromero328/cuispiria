import mongoose, { Schema } from "mongoose";

interface UserSchemaType {
  name?: string | null;
  email: string;
  image?: string | null;
  provider: "google";
  providerAccountId: string;
}

interface SavedRecipeType {
  userID: string;
  recipeID: number;
  image?: string | null;
  title: string;
  readyInMinutes: number;
  dishTypes?: string[];
  aggregateLikes: number;
  type: "saved" | "custom";
  macros: {
    protein: number;
    carbs: number;
    fat: number;
    calories: number;
  };
  createdAt?: Date;
  updatedAt?: Date;
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

const MacrosSchema = new Schema(
  {
    protein: { type: Number, required: true },
    carbs: { type: Number, required: true },
    fat: { type: Number, required: true },
    calories: { type: Number, required: true },
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

    macros: { type: MacrosSchema, required: true },

    type: {
      type: String,
      enum: ["saved", "custom"],
      required: true,
      index: true,
    },
  },
  { timestamps: true },
);

const User = mongoose.models.User || mongoose.model("User", UserSchema);
const SavedRecipe =
  mongoose.models.SavedRecipe ||
  mongoose.model("SavedRecipe", SavedRecipeSchema);

export { User, SavedRecipe };
