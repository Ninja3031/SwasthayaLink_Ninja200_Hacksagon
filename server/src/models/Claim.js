import mongoose, { Schema } from "mongoose";

const claimSchema = new Schema(
  {
    patient: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    disease: {
      type: String,
      required: true,
    },
    hospital: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    documents: [{
      type: String,
      enum: ["prescription", "lab_report", "bill", "id_proof"],
    }],
    status: {
      type: String,
      enum: ["SUBMITTED", "UNDER_REVIEW", "APPROVED", "SETTLED", "REJECTED"],
      default: "SUBMITTED",
    },
    score: {
      type: Number,
      required: true,
      default: 0
    },
    approvalChance: {
      type: String,
      enum: ["HIGH", "MEDIUM", "LOW"],
      default: "LOW"
    }
  },
  { timestamps: true }
);

export const Claim = mongoose.model("Claim", claimSchema);
