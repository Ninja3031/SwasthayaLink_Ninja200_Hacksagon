import mongoose, { Schema } from "mongoose";

const insuranceSchema = new Schema(
  {
    patient: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    providerName: {
      type: String,
      required: true,
    },
    policyNumber: {
      type: String,
      required: true,
      unique: true,
    },
    coverageAmount: {
      type: Number,
      required: true,
    },
    validUntil: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "expired", "suspended"],
      default: "active"
    }
  },
  { timestamps: true }
);

export const Insurance = mongoose.model("Insurance", insuranceSchema);
