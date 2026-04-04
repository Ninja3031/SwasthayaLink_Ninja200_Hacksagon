import mongoose from "mongoose";

const reminderSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    medicineName: {
      type: String,
      required: true,
    },
    times: [
      {
        type: String, // e.g., "08:00 AM", "20:00"
        required: true,
      }
    ],
    frequency: {
      type: String,
      default: "Once daily",
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
    },
    logs: [
      {
        date: { type: String }, // e.g. "YYYY-MM-DD"
        time: { type: String }, // e.g. "08:00 AM"
        status: { type: String, enum: ["pending", "taken", "missed"], default: "pending" }
      }
    ],
    isActive: {
      type: Boolean,
      default: true,
    }
  },
  { timestamps: true }
);

export const Reminder = mongoose.model("Reminder", reminderSchema);
