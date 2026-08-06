import mongoose, { Schema, models, model } from "mongoose";

export type ContactSubject =
  | "general"
  | "order"
  | "feedback"
  | "partnership"
  | "other";

export interface IContact {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  phone?: string;
  subject: ContactSubject | string;
  message: string;
  status: "new" | "read" | "replied";
  createdAt: Date;
  updatedAt: Date;
}

const ContactSchema = new Schema<IContact>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
      default: "",
    },
    subject: {
      type: String,
      enum: ["general", "order", "feedback", "partnership", "other"],
      default: "general",
    },
    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 5000,
    },
    status: {
      type: String,
      enum: ["new", "read", "replied"],
      default: "new",
    },
  },
  { timestamps: true }
);

export const Contact =
  models.Contact || model<IContact>("Contact", ContactSchema);
