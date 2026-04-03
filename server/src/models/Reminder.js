import mongoose from "mongoose";

const reminderSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
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
      default: "Daily",
    },
    isActive: {
      type: Boolean,
      default: true,
    }
  },
  { timestamps: true }
);

export const Reminder = mongoose.model("Reminder", reminderSchema);
