import mongoose from "mongoose";

const recordSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
    },
    title: {
      type: String,
      required: true,
    },
    fileUrl: {
      type: String,
      required: true,
    },
    originalName: String,
    recordType: {
      type: String,
      enum: ["prescription", "lab_report", "scan", "general"],
      default: "general",
    },
    notes: String,
  },
  { timestamps: true }
);

export const Record = mongoose.model("Record", recordSchema);
