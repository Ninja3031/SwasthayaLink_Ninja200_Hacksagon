import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/User.js";
import { Hospital } from "../models/Hospital.js";
import { Doctor } from "../models/Doctor.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { ROLES } from "../constants/roles.js";

const generateAccessTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    return { accessToken };
  } catch (error) {
    throw new ApiError(500, "Something went wrong while generating token");
  }
};

export const registerUser = asyncHandler(async (req, res) => {
  console.log("Incoming Register Request:", req.body);
  const { name, email, password, role, contactNumber } = req.body;

  if ([name, email, password].some((field) => !field || field.trim() === "")) {
    throw new ApiError(400, "Name, email, and password are required");
  }

  const existedUser = await User.findOne({ email });
  if (existedUser) {
    throw new ApiError(409, "User with email already exists");
  }

  const userRole = Object.values(ROLES).includes(role) ? role : ROLES.PATIENT;

  const user = await User.create({
    name,
    email,
    password,
    role: userRole,
    contactNumber
  });

  // Role-specific initializations
  if (userRole === ROLES.HOSPITAL) {
    await Hospital.create({
      user: user._id,
      registrationNumber: `HOSP-${Date.now()}`,
      facilityType: "General Hospital"
    });
  }

  if (userRole === ROLES.DOCTOR) {
    // A doctor must be linked to a hospital. If none exists, generate a safe fallback clinic
    let firstHospital = await Hospital.findOne();
    
    if (!firstHospital) {
       firstHospital = await Hospital.create({
         user: user._id, // fallback binding
         registrationNumber: `HOSP-AUTO-${Date.now()}`,
         facilityType: "Fallback Clinic"
       });
    }

    await Doctor.create({
      user: user._id,
      hospital: firstHospital._id,
      specialization: "General Physician"
    });
  }

  const createdUser = await User.findById(user._id).select("-password -refreshToken");

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  return res.status(201).json(
    new ApiResponse(201, createdUser, "User registered successfully")
  );
});

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Email and password is required");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(404, "User does not exist");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials");
  }

  const { accessToken } = await generateAccessTokens(user._id);

  const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  };

  return res.status(200)
    .cookie("accessToken", accessToken, options)
    .json(new ApiResponse(200, { user: loggedInUser, accessToken }, "User logged In Successfully"));
});

export const logoutUser = asyncHandler(async (req, res) => {
  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  };

  return res.status(200)
    .clearCookie("accessToken", options)
    .json(new ApiResponse(200, {}, "User logged out"));
});
