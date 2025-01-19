// src/models/Category.ts
import mongoose, { Schema, Document } from "mongoose";

interface ICategory extends Document {
  name: string;
  icon: string;
  color: string;
  subCategories: Array<{
    name: string;
    icon: string;
  }>;
}

const CategorySchema: Schema = new Schema({
  name: { type: String, required: true },
  icon: { type: String, required: true },
  color: { type: String, required: true },
  subCategories: [
    {
      name: { type: String, required: true },
      icon: { type: String, required: true },
    },
  ],
});

export default mongoose.model<ICategory>("Category", CategorySchema);
