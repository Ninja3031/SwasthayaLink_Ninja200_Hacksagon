import mongoose, { Schema } from "mongoose";

const doctorSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    hospital: {
      type: Schema.Types.ObjectId,
      ref: "Hospital",
      required: true,
    },
    specialization: {
      type: String,
      required: true,
    },
    qualification: {
      type: String,
    },
    experienceYears: {
      type: Number,
      default: 0
    },
    availabilityStatus: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

export const Doctor = mongoose.model("Doctor", doctorSchema);
