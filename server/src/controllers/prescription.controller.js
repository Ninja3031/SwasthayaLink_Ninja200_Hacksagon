import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { Prescription } from "../models/Prescription.js";
import { Appointment } from "../models/Appointment.js";

// @route POST /api/v1/prescriptions
// @desc Create a prescription securely matching Doctor <-> Patient appointment bounds
export const createPrescription = asyncHandler(async (req, res) => {
  const { appointmentId, medicines, notes } = req.body;

  if (req.user.role !== "doctor") {
    throw new ApiError(403, "Forbidden Access: Restricted strictly mapping authorized Physicians!");
  }

  if (!appointmentId || !medicines || !medicines.length) {
    throw new ApiError(400, "Incomplete Payload Mapping. Appointment ID and Medicines array heavily required natively.");
  }

  // Verify the appointment exists and strongly belongs to mapping
  const appointmentTrace = await Appointment.findById(appointmentId);
  if (!appointmentTrace) {
    throw new ApiError(404, "Target bounded Appointment lookup securely failed.");
  }

  // Doctor must only prescribe to someone natively treated within this appt
  if (appointmentTrace.doctor.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Access Violation. Strictly mapped securely only for registered bounds.");
  }

  const prescription = await Prescription.create({
     doctor: req.user._id,
     patient: appointmentTrace.patient,
     hospital: appointmentTrace.hospital, // Can be undefined implicitly based on optional constraint
     appointment: appointmentId,
     medicines,
     notes
  });

  return res.status(201).json(new ApiResponse(201, prescription, "Prescription Executed Securely Natively!"));
});
