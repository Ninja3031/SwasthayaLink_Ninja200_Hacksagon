import mongoose, { Schema } from "mongoose";

const appointmentSchema = new Schema(
  {
    patient: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    doctor: {
      type: Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },
    hospital: {
      type: Schema.Types.ObjectId,
      ref: "Hospital",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    timeSlot: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["Consultation", "Follow-up", "Emergency"],
      required: true,
      default: "Consultation"
    },
    specialty: {
      type: String
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "completed", "cancelled"],
      default: "pending",
    },
    notes: {
      type: String,
    },
    reason: {
      type: String,
      required: true,
      default: "General Checkup"
    },
    selectedSymptoms: [
      {
        symptomTitle: String,
        description: String,
        severity: String,
        dateTime: Date
      }
    ]
  },
  { timestamps: true }
);

export const Appointment = mongoose.model("Appointment", appointmentSchema);
