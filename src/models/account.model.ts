import mongoose, { Schema, Document } from "mongoose";

export interface IAccount extends Document {
  name: string;
  type: string;
  initialAmount: number;
  currency: string;
  excludeFromStatistics: boolean;
}

const AccountSchema: Schema = new Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  initialAmount: { type: Number, required: true },
  currency: { type: String, required: true },
  excludeFromStatistics: { type: Boolean, required: false, default: false },
});

export default mongoose.model<IAccount>("Account", AccountSchema);
