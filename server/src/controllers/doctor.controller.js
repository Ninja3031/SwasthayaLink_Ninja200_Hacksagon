import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Doctor } from "../models/Doctor.js";
import { User } from "../models/User.js";
import { Hospital } from "../models/Hospital.js";
import { ApiResponse } from "../utils/apiResponse.js";

// @route PATCH /api/v1/doctors/availability
// @desc Update doctor availability (Doctor Portal)
export const updateAvailability = asyncHandler(async (req, res) => {
  const { availabilityStatus } = req.body;
  const doctor = await Doctor.findOne({ user: req.user._id });

  if (!doctor) throw new ApiError(404, "Doctor profile not found");

  doctor.availabilityStatus = availabilityStatus;
  await doctor.save();

  return res.status(200).json(new ApiResponse(200, doctor, "Availability updated"));
});

// @route GET /api/v1/doctors
// @desc Get all registered doctors (Public/Patient viewing)
export const getDoctors = asyncHandler(async (req, res) => {
  // Populate user data to get name and email
  const doctors = await Doctor.find({}).populate("user", "name email contactNumber").populate("hospital", "registrationNumber");
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
    // Basic stub for adding a doctor to a hospital. 
    // Usually we would register a user as role='doctor' and attach here.
    return res.status(201).json(new ApiResponse(201, {}, "Doctor added (Stub)"));
});
