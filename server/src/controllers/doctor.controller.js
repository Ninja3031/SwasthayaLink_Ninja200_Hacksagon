import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Doctor } from "../models/Doctor.js";
import { Hospital } from "../models/Hospital.js";
import { ApiResponse } from "../utils/apiResponse.js";

// @route PATCH /api/v1/doctors/availability
// @desc Update doctor availability (Doctor Portal)
export const updateAvailability = asyncHandler(async (req, res) => {
  const { availabilityStatus } = req.body;
  const doctor = req.user;

  if (!doctor) throw new ApiError(404, "Doctor profile not found");

  doctor.availabilityStatus = availabilityStatus;
  await doctor.save();

  return res.status(200).json(new ApiResponse(200, doctor, "Availability updated"));
});

// @route GET /api/v1/doctors
// @desc Get all registered doctors (Public/Patient viewing)
export const getDoctors = asyncHandler(async (req, res) => {
  const doctors = await Doctor.find({});
  return res.status(200).json(new ApiResponse(200, doctors, "Doctors fetched successfully"));
});

// @route GET /api/v1/doctors/:id/availability
// @desc Get available slots for a specific doctor
export const getDoctorAvailability = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const doctor = await Doctor.findById(id);
  if (!doctor) throw new ApiError(404, "Doctor not found");

  // In a real app, you would filter out booked slots based on the Date requested! 
  // For MVP, we return the master availableSlots array.
  return res.status(200).json(new ApiResponse(200, doctor.availableSlots || [], "Doctor slots fetched"));
});

// @route POST /api/v1/doctors
// @desc Add a doctor mapped from existing user (Hospital Admin Portal)
export const addDoctor = asyncHandler(async (req, res) => {
    return res.status(201).json(new ApiResponse(201, {}, "Doctor added (Stub)"));
});

// @route PATCH /api/v1/doctors/slots
// @desc Manage dynamic string time slots
export const updateDoctorSlots = asyncHandler(async (req, res) => {
    const { slots } = req.body; // Array of strings (e.g. ["10:00 AM", "12:00 PM"])
    if (!Array.isArray(slots)) throw new ApiError(400, "Slots array constraints failed entirely.");

    const doctor = req.user;
    if (!doctor) throw new ApiError(404, "Target Doctor logic failed.");

    doctor.availableSlots = slots;
    await doctor.save();
    return res.status(200).json(new ApiResponse(200, doctor, "Structural Availability Slots patched natively."));
});

// @route GET /api/v1/doctors/patients
// @desc Isolate and retrieve structured identities for 'My Patients' Module
import { Appointment } from "../models/Appointment.js";

export const getTreatedPatients = asyncHandler(async (req, res) => {
   const doctor = req.user;
   if (!doctor) throw new ApiError(404, "Invalid routing limits.");

   // Aggregate uniquely confirmed users natively associated tracking historically
   const validAppointments = await Appointment.find({
       doctor: doctor._id,
       status: { $in: ["confirmed", "completed"] }
   }).populate("patient", "name email role __v phone").lean();

   const patientMap = {};
   validAppointments.forEach(appt => {
       if (appt.patient && !patientMap[appt.patient._id]) {
           patientMap[appt.patient._id] = appt.patient;
       }
   });

   const isolatedPatients = Object.values(patientMap);
   return res.status(200).json(new ApiResponse(200, isolatedPatients, "Treated Patients Map rendered robustly."));
});
