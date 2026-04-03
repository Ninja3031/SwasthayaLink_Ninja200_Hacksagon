import mongoose from "mongoose";

const symptomSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    symptoms: [
      {
        name: { type: String, required: true },
        severity: { type: Number, min: 1, max: 10, required: true },
      }
    ],
    notes: String,
    linkedAppointment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
    }
  },
  { timestamps: true }
);

export const Symptom = mongoose.model("Symptom", symptomSchema);
