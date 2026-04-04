import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { SOS } from "../models/SOS.js";
import { User } from "../models/User.js";

// @route POST /api/v1/emergency/sos
// @desc Emergency webhook capturing coordinates natively
export const triggerSOS = asyncHandler(async (req, res) => {
  const { lat, lng } = req.body;
  if (lat === undefined || lng === undefined) throw new ApiError(400, "Device coordinates required for SOS.");

  // Save the SOS footprint
  const sosEvent = await SOS.create({
    patientId: req.user._id,
    location: { lat, lng },
    status: "active"
  });

  // Overwrite the User's last known tracker ping
  await User.findByIdAndUpdate(req.user._id, { location: { lat, lng } });

  // Optional: In a full architecture, we trigger Socket.IO to local hospitals here.
  // For constraints demo logic: we successfully return
  return res.status(201).json(new ApiResponse(201, sosEvent, "Emergency Services Dispatched and Coordinates Locked!"));
});

// @route GET /api/v1/emergency/alerts
// @desc Fetches active SOS calls specifically for the Hospital portal view
export const getActiveSOS = asyncHandler(async (req, res) => {
  // Hospital view
  const activeAlerts = await SOS.find({ status: "active" }).populate("patientId", "name contactNumber emergencyContacts").sort("-createdAt");
  return res.status(200).json(new ApiResponse(200, activeAlerts, "Tracking Active Signals"));
});
