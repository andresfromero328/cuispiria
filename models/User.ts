import mongoose, { Schema } from "mongoose";

type UserSchemaType = {
  name?: string | null;
  email: string;
  image?: string | null;
  provider: "google";
  providerAccountId: string;
};

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

export const User = mongoose.models.User || mongoose.model("User", UserSchema);
