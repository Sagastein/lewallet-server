// src/models/Record.ts
import mongoose, { Schema, Document } from "mongoose";

interface IRecord extends Document {
  type: string;
  amount: number;
  category?: string;
  date: Date;
  account: mongoose.Types.ObjectId;
  fromAccount?: mongoose.Types.ObjectId;
  toAccount?: mongoose.Types.ObjectId;
  payee?: string;
  payer?: string;
  paymentType?: string;
  paymentStatus?: string;
  note?: string;
  location?: string;
  label?: string;
}

const RecordSchema: Schema = new Schema({
  type: { type: String, required: true },
  amount: { type: Number, required: true },
  category: { type: String },
  date: { type: Date, required: true },
  account: { type: mongoose.Types.ObjectId, ref: "Account", required: true },
  fromAccount: { type: mongoose.Types.ObjectId, ref: "Account" },
  toAccount: { type: mongoose.Types.ObjectId, ref: "Account" },
  payee: { type: String },
  payer: { type: String },
  paymentType: { type: String },
  paymentStatus: { type: String },
  note: { type: String },
  location: { type: String },
  label: { type: String },
});

export default mongoose.model<IRecord>("Record", RecordSchema);
