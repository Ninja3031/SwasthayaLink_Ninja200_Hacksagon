import mongoose, { Schema } from "mongoose";
import { PREDEFINED_HOSPITALS } from "../constants/hospitals.js";

const appointmentSchema = new Schema(
  {
    patient: {
      type: Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    doctor: {
      type: Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },
    doctorDetailsSnapshot: {
      name: String,
      speciality: String,
      hospital: String
    },
    hospital: {
      type: String,
      enum: PREDEFINED_HOSPITALS,
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
