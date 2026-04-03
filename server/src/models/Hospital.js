import mongoose, { Schema } from "mongoose";

const hospitalSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    registrationNumber: {
      type: String,
      required: true,
      unique: true,
    },
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
    },
    facilityType: {
      type: String,
      enum: ["Clinic", "General Hospital", "Specialty Hospital"],
      default: "General Hospital"
    },
    verified: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

export const Hospital = mongoose.model("Hospital", hospitalSchema);
