import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Hospital } from "../models/Hospital.js";
import { Doctor } from "../models/Doctor.js";
import { Appointment } from "../models/Appointment.js";
import { ApiResponse } from "../utils/apiResponse.js";

// @route GET /api/v1/hospitals
// @desc Get all hospitals (Patient Portal)
export const getHospitals = asyncHandler(async (req, res) => {
   const hospitals = await Hospital.find().lean();

   // Transform to make it cleaner for frontend mapping
   const result = hospitals.map(h => ({
      _id: h._id,
      name: h.name,
      email: h.email
   }));

   return res.status(200).json(new ApiResponse(200, result, "Hospitals fetched successfully"));
});

// @route GET /api/v1/hospitals/:hospitalName/doctors
export const getHospitalDoctors = asyncHandler(async (req, res) => {
   const { hospitalName } = req.params;
   const stringResolvedHospital = decodeURIComponent(hospitalName);
   
   // Apply fuzzy fallback to cleanly resolve strictly bounded new arrays AND legacy unmapped profiles mapping older string queries.
   const safeRegex = new RegExp(stringResolvedHospital.split(" ")[0], "i");
   
   const doctors = await Doctor.find({
     $or: [
       { hospital: stringResolvedHospital },
       { hospitalName: { $regex: safeRegex } }
     ]
   }).select("-password -refreshToken");
   
   return res.status(200).json(new ApiResponse(200, doctors, "Physicians bound securely mapped with legacy compatibility"));
});

// @route GET /api/v1/hospitals/:hospitalName/appointments
export const getHospitalAppointments = asyncHandler(async (req, res) => {
   const { hospitalName } = req.params;
   const stringResolvedHospital = decodeURIComponent(hospitalName);
   const safeRegex = new RegExp(stringResolvedHospital.split(" ")[0], "i");
   
   // Apply fuzzy fallback to firmly grab all appointments mapped tightly.
   const appointments = await Appointment.find({
     $or: [
       { hospital: stringResolvedHospital },
       { "doctorDetailsSnapshot.hospitalName": { $regex: safeRegex } }
     ]
   })
      .populate("patient doctor")
      .sort({ date: -1 });

   return res.status(200).json(new ApiResponse(200, appointments, "Active hospital bounds mapped successfully"));
});
