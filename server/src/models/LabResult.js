import mongoose from "mongoose";

const labResultSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    reportTitle: {
      type: String,
      required: true,
    },
    reportFile: {
      type: String,
      required: true,
    },
    notes: {
      type: String,
    }
  },
  { timestamps: true }
);

export const LabResult = mongoose.model("LabResult", labResultSchema);
