import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Patient } from "../models/Patient.js";
import { Hospital } from "../models/Hospital.js";
import { Doctor } from "../models/Doctor.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { ROLES } from "../constants/roles.js";

const generateAccessTokens = async (userId, Model) => {
   try {
      const user = await Model.findById(userId);
      const accessToken = user.generateAccessToken();
      return { accessToken };
   } catch (error) {
      throw new ApiError(500, "Something went wrong while generating token");
   }
};

const sendTokenResponse = async (user, Model, res, message) => {
   const { accessToken } = await generateAccessTokens(user._id, Model);
   const loggedInUser = await Model.findById(user._id).select("-password -refreshToken");

   const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
   };

   return res.status(200)
      .cookie("accessToken", accessToken, options)
      .json(new ApiResponse(200, { user: loggedInUser, accessToken }, message));
};

// ========================
// PATIENT AUTH
// ========================

export const signupPatient = asyncHandler(async (req, res) => {
   const { name, email, password, phone, abhaId } = req.body;
   if ([name, email, password, phone].some(f => !f || f.trim() === "")) throw new ApiError(400, "Mandatory physical forms empty");

   if (await Patient.findOne({ email })) throw new ApiError(409, "User active locally mapping database trace.");

   const patient = await Patient.create({ name, email, password, phone, abhaId, role: ROLES.PATIENT });
   return sendTokenResponse(patient, Patient, res, "Patient logged tightly");
});

export const signinPatient = asyncHandler(async (req, res) => {
   const { email, password } = req.body;
   if (!email || !password) throw new ApiError(400, "Forms missing");

   const patient = await Patient.findOne({ email });
   if (!patient) throw new ApiError(404, "Invalid mapping explicitly");

   if (!(await patient.isPasswordCorrect(password))) throw new ApiError(401, "Invalid trace password context");
   return sendTokenResponse(patient, Patient, res, "Patient unlocked natively");
});


// ========================
// DOCTOR AUTH
// ========================

export const signupDoctor = asyncHandler(async (req, res) => {
   const { name, email, password, phone, hospital, speciality, experience } = req.body;
   if ([name, email, password, hospital, speciality].some(f => !f || f.trim() === "")) throw new ApiError(400, "Mandatory execution gaps.");

   if (await Doctor.findOne({ email })) throw new ApiError(409, "Identity overlap constraints failed");

   const doc = await Doctor.create({ name, email, password, phone, hospital, speciality, experience, role: ROLES.DOCTOR });
   return sendTokenResponse(doc, Doctor, res, "Physician unlocked successfully.");
});

export const signinDoctor = asyncHandler(async (req, res) => {
   const { email, password } = req.body;
   const doc = await Doctor.findOne({ email });
   if (!doc || !(await doc.isPasswordCorrect(password))) throw new ApiError(401, "Execution constraints rejected");
   return sendTokenResponse(doc, Doctor, res, "Doctor actively authenticated");
});


// ========================
// HOSPITAL AUTH
// ========================

export const signupHospital = asyncHandler(async (req, res) => {
   const { name, email, password } = req.body;
   if ([name, email, password].some(f => !f || f.trim() === "")) throw new ApiError(400, "Facility traces missing");

   if (await Hospital.findOne({ email })) throw new ApiError(409, "Overlap logic prevented.");

   const hosp = await Hospital.create({ name, email, password, role: ROLES.HOSPITAL });
   return sendTokenResponse(hosp, Hospital, res, "Facility bounds instantiated");
});

export const signinHospital = asyncHandler(async (req, res) => {
   const { email, password, name } = req.body;
   const hosp = await Hospital.findOne({ email, name });
   if (!hosp || !(await hosp.isPasswordCorrect(password))) throw new ApiError(401, "Execution invalid locally. Verify explicitly mapped name bounds.");
   return sendTokenResponse(hosp, Hospital, res, "Hospital instantiated globally");
});

export const logoutUser = asyncHandler(async (req, res) => {
   const options = { httpOnly: true, secure: process.env.NODE_ENV === "production" };
   return res.status(200).clearCookie("accessToken", options).json(new ApiResponse(200, {}, "Logged out successfully"));
});
