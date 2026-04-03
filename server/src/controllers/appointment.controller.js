import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Appointment } from "../models/Appointment.js";
import { Doctor } from "../models/Doctor.js";
import { Hospital } from "../models/Hospital.js";
import { ApiResponse } from "../utils/apiResponse.js";

// @route POST /api/v1/appointments
// @desc Book an appointment (Patient Portal)
export const bookAppointment = asyncHandler(async (req, res) => {
  const { doctorId, hospitalId, date, timeSlot, notes } = req.body;
  
  const appointment = await Appointment.create({
    patient: req.user._id,
    doctor: doctorId,
    hospital: hospitalId,
    date,
    timeSlot,
    notes
  });

  return res.status(201).json(new ApiResponse(201, appointment, "Appointment booked successfully"));
});

// @route GET /api/v1/appointments/user
// @desc Get current patient's appointments
export const getPatientAppointments = asyncHandler(async (req, res) => {
  const appointments = await Appointment.find({ patient: req.user._id })
    .populate("doctor hospital")
    .sort({ date: -1 });

  return res.status(200).json(new ApiResponse(200, appointments, "Patient appointments fetched"));
});

// @route GET /api/v1/appointments/doctor
// @desc Get current doctor's appointments
export const getDoctorAppointments = asyncHandler(async (req, res) => {
  const doctor = await Doctor.findOne({ user: req.user._id });
  if (!doctor) throw new ApiError(404, "Doctor profile not found");

  const appointments = await Appointment.find({ doctor: doctor._id })
    .populate("patient hospital")
    .sort({ date: -1 });

  return res.status(200).json(new ApiResponse(200, appointments, "Doctor appointments fetched"));
});

// @route GET /api/v1/appointments/hospital
// @desc Get current hospital's appointments
export const getHospitalAppointments = asyncHandler(async (req, res) => {
  const hospital = await Hospital.findOne({ user: req.user._id });
  if (!hospital) throw new ApiError(404, "Hospital profile not found");

  const appointments = await Appointment.find({ hospital: hospital._id })
    .populate("patient doctor")
    .sort({ date: -1 });

  return res.status(200).json(new ApiResponse(200, appointments, "Hospital appointments fetched"));
});

// @route PATCH /api/v1/appointments/:id/status
// @desc Update appointment status (Doctor/Hospital portal)
export const updateAppointmentStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const appointment = await Appointment.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true }
  );

  if (!appointment) throw new ApiError(404, "Appointment not found");

  return res.status(200).json(new ApiResponse(200, appointment, "Appointment status updated"));
});
