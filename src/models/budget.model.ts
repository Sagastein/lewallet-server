// src/models/Budget.ts
import { BudgetFor } from "@/Constants/data";
import mongoose, { Schema, Document } from "mongoose";

interface IBudget extends Document {
  name: string;
  amount: number;
  type: string;
  budgetFor: string;
  startDate: Date;
  endDate: Date;
  accounts?: mongoose.Types.ObjectId[];
}

const BudgetSchema: Schema = new Schema({
  name: { type: String, required: true },
  amount: { type: Number, required: true },
  type: { type: String, required: true },
  budgetFor: { type: String, required: true, enum: Object.values(BudgetFor) },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  accounts: [{ type: mongoose.Types.ObjectId, ref: "Account" }],
});

export default mongoose.model<IBudget>("Budget", BudgetSchema);
