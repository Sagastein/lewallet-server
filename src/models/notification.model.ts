// src/models/Notification.ts
import mongoose, { Schema, Document } from "mongoose";

interface INotification extends Document {
  account: mongoose.Types.ObjectId;
  message: string;
  type: string;
  date: Date;
}

const NotificationSchema: Schema = new Schema({
  account: { type: mongoose.Types.ObjectId, ref: "Account", required: true },
  message: { type: String, required: true },
  type: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

export default mongoose.model<INotification>(
  "Notification",
  NotificationSchema
);
