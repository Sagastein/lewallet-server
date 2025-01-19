import mongoose, { Schema, Document } from "mongoose";

interface IRecord extends Document {
  type: string;
  amount: number;
  category: string;
  date: Date;
  account: mongoose.Types.ObjectId;
}

const RecordSchema: Schema = new Schema({
  type: { type: String, required: true },
  amount: { type: Number, required: true },
  category: { type: String, required: true },
  date: { type: Date, required: true },
  account: { type: mongoose.Types.ObjectId, ref: "Account", required: true },
});

export default mongoose.model<IRecord>("Record", RecordSchema);
