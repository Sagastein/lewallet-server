import mongoose from "mongoose";

const MONGODB_URL = process.env.MONGODB_URL || "";
if (!MONGODB_URL) throw new Error("MONGODB_URL is not set in .env file");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGODB_URL);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

export default connectDB;
