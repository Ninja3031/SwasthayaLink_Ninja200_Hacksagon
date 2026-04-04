import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Hospital } from "../models/Hospital.js";
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
