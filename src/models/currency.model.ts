import mongoose, { Schema, Document } from "mongoose";

interface ICurrency extends Document {
  code: string;
  name: string;
}

const CurrencySchema: Schema = new Schema({
  code: { type: String, required: true },
  name: { type: String, required: true },
});

export default mongoose.model<ICurrency>("Currency", CurrencySchema);
