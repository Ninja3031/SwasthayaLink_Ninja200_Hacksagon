import mongoose, { Schema } from "mongoose";

const ngoSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    ngoName: {
      type: String,
      required: true,
    },
    registrationId: {
      type: String,
      required: true,
      unique: true,
    },
    focusArea: {
      type: String,
      default: "Healthcare Funding",
    },
    totalFundsDisbursed: {
      type: Number,
      default: 0,
    },
    verified: {
      type: Boolean,
      default: false,
    }
  },
  { timestamps: true }
);

export const NGO = mongoose.model("NGO", ngoSchema);
