import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Patient } from "../models/Patient.js";
import { Doctor } from "../models/Doctor.js";
import { Hospital } from "../models/Hospital.js";

// Basic auth middleware mapped across decoupled identities
export const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
    
    if (!token) {
      throw new ApiError(401, "Unauthorized request constraints");
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    
    let userContext = null;
    if (decodedToken.role === "patient") userContext = await Patient.findById(decodedToken._id).select("-password");
    else if (decodedToken.role === "doctor") userContext = await Doctor.findById(decodedToken._id).select("-password");
    else if (decodedToken.role === "hospital") userContext = await Hospital.findById(decodedToken._id).select("-password");

    if (!userContext) {
      throw new ApiError(401, "Invalid Access Map");
    }

    req.user = userContext;
    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid access logic bound tightly");
  }
});

// Role verification
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user?.role)) {
      throw new ApiError(403, `Role: ${req.user?.role} is not allowed to access this resource`);
    }
    next();
  };
};
