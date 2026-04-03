import mongoose, { Schema } from "mongoose";

const admissionSchema = new Schema(
  {
    patient: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    hospital: {
      type: Schema.Types.ObjectId,
      ref: "Hospital",
      required: true,
    },
    bed: {
      type: Schema.Types.ObjectId,
      ref: "Bed",
      required: true,
    },
    admissionDate: {
      type: Date,
      default: Date.now,
    },
    dischargeDate: {
      type: Date,
    },
    status: {
      type: String,
      enum: ["admitted", "discharged", "transferred"],
      default: "admitted",
    },
    diagnosis: {
      type: String,
    }
  },
  { timestamps: true }
);

export const Admission = mongoose.model("Admission", admissionSchema);
