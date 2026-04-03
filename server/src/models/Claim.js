import mongoose, { Schema } from "mongoose";

const claimSchema = new Schema(
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
    insurance: {
      type: Schema.Types.ObjectId,
      ref: "Insurance",
      required: true,
    },
    claimAmount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["submitted", "under_review", "approved", "rejected"],
      default: "submitted",
    },
    documents: [
      {
        url: String,
        name: String,
      }
    ],
    remarks: {
      type: String,
    }
  },
  { timestamps: true }
);

export const Claim = mongoose.model("Claim", claimSchema);
