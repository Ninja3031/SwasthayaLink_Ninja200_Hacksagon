import mongoose from "mongoose";

const symptomSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    symptomTitle: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    severity: {
      type: String,
      enum: ["Mild", "Moderate", "Severe"],
      required: true,
    },
    dateTime: {
      type: Date,
      required: true,
    }
  },
  { timestamps: true }
);

export const Symptom = mongoose.model("Symptom", symptomSchema);
