import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { Message } from "../models/Message.js";
import { Appointment } from "../models/Appointment.js";
import { Doctor } from "../models/Doctor.js";

// @route POST /api/v1/messages/send
// @desc Securely deliver message checking Appointment map
export const sendMessage = asyncHandler(async (req, res) => {
  const { receiverId, content } = req.body;
  if (!receiverId || !content) throw new ApiError(400, "Receiver ID and transmission text required.");

  // Logic: Only communicate if an appointment exists validating Patient <-> Doctor
  // Find doctor mapped to receiverId (if receiver is a role 'doctor')
  let validationQuery = {};
  
  if (req.user.role === 'patient') {
     const targetDoctor = await Doctor.findById(receiverId);
     if (!targetDoctor) throw new ApiError(404, "Invalid recipient profile.");
     validationQuery = { patient: req.user._id, doctor: targetDoctor._id };
  } else if (req.user.role === 'doctor') {
     validationQuery = { patient: receiverId, doctor: req.user._id };
  } else {
     throw new ApiError(403, "Messaging is restricted strictly to Doctor-Patient boundaries.");
  }

  // Appointment Verification
  const validAppointmentExists = await Appointment.findOne(validationQuery).lean();
  
  if (!validAppointmentExists) {
     throw new ApiError(403, "Unauthorized Messaging: Communication locked. You must have a recognized appointment registered natively.");
  }

  const message = await Message.create({
    sender: req.user._id,
    receiver: receiverId,
    content,
    appointmentId: validAppointmentExists._id
  });

  return res.status(201).json(new ApiResponse(201, message, "Message Encrypted and Secured"));
});

// @route GET /api/v1/messages/conversations
// @desc Fetches native chat arrays linked
export const getConversationsList = asyncHandler(async (req, res) => {
  let contactsHash = {};

  if (req.user.role === 'patient') {
     const uniqueAppts = await Appointment.find({
         patient: req.user._id,
         status: { $in: ['pending', 'confirmed', 'completed'] }
     }).populate("doctor", "name speciality role");

     uniqueAppts.forEach(appt => {
        if (appt.doctor && !contactsHash[appt.doctor._id]) {
            contactsHash[appt.doctor._id] = {
               contact: appt.doctor,
               lastMessage: "Secure bounds loaded.",
               timestamp: appt.createdAt
            };
        }
     });
  } else if (req.user.role === 'doctor') {
     const uniqueAppts = await Appointment.find({
         doctor: req.user._id,
         status: { $in: ['pending', 'confirmed', 'completed'] }
     }).populate("patient", "name role");

     uniqueAppts.forEach(appt => {
        if (appt.patient && !contactsHash[appt.patient._id]) {
            contactsHash[appt.patient._id] = {
               contact: appt.patient,
               lastMessage: "Authorized target acquired.",
               timestamp: appt.createdAt
            };
        }
     });
  }

  const parsedConversations = Object.values(contactsHash);
  return res.status(200).json(new ApiResponse(200, parsedConversations, "Inbox Rendered via Appointments"));
});

// @route GET /api/v1/messages/:userId
// @desc Load native 1-on-1 socket trace
export const getMessagesHistory = asyncHandler(async (req, res) => {
  const { userId } = req.params; // Target contact

  const messages = await Message.find({
    $or: [
      { sender: req.user._id, receiver: req.params.userId },
      { sender: req.params.userId, receiver: req.user._id }
    ]
  }).sort("createdAt");

  return res.status(200).json(new ApiResponse(200, messages, "Thread Fetched"));
});
