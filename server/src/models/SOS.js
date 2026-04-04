import mongoose from "mongoose";

const sosSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    location: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true }
    },
    status: {
      type: String,
      enum: ["active", "resolved"],
      default: "active",
    }
  },
  { timestamps: true }
);

export const SOS = mongoose.model("SOS", sosSchema);
