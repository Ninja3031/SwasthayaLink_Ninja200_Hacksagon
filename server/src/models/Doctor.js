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
    },
    consultationFee: {
      type: Number,
      default: 500
    },
    availableSlots: {
      type: [String],
      default: ["09:00 AM", "10:00 AM", "11:00 AM", "02:00 PM", "04:00 PM"]
    }
  },
  { timestamps: true }
);

export const Doctor = mongoose.model("Doctor", doctorSchema);
