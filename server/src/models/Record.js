import mongoose, { Schema } from "mongoose";

const recordSchema = new Schema(
  {
    patient: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    fileUrl: {
      type: String,
      required: true, // Internal path representing local / uploads bucket
    },
    extractedText: {
      type: String, 
      required: true,
    },
    structuredData: {
      patientName: { type: String, default: "Not Found" },
      doctor: { type: String, default: "Not Found" },
      date: { type: String, default: "Not Found" },
      medicines: [{ type: String }]
    },
    documentType: {
      type: String,
      enum: ["Prescription", "Lab Report", "Bill", "Other"],
      default: "Prescription",
    }
  },
  { timestamps: true }
);

export const Record = mongoose.model("Record", recordSchema);
