import mongoose, { Schema } from "mongoose";

const bedSchema = new Schema(
  {
    hospital: {
      type: Schema.Types.ObjectId,
      ref: "Hospital",
      required: true,
    },
    bedNumber: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["General", "ICU", "Emergency", "Maternity"],
      default: "General",
    },
    status: {
      type: String,
      enum: ["available", "occupied", "maintenance"],
      default: "available",
    },
    dailyCharges: {
      type: Number,
      required: true,
    }
  },
  { timestamps: true }
);

export const Bed = mongoose.model("Bed", bedSchema);
