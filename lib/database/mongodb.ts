/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose, { Connection } from "mongoose";

// Retrieves mongoDB uri
const MONGODB_URI = process.env.MONGODB_URI!;

// Handles abscence of mongoDB uri
if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable");
}

interface Cached {
  conn: Connection | null;
  promise: Promise<Connection> | null;
}

let cached: Cached = (global as any).mongoose;

if (!cached) {
  cached = { conn: null, promise: null };
  (global as any).mongoose = cached;
}

export async function connectDB(): Promise<Connection> {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI).then((m) => m.connection);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
