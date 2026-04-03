import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { Record } from "../models/Record.js";
import { Prescription } from "../models/Prescription.js";
import { Reminder } from "../models/Reminder.js";
import { Symptom } from "../models/Symptom.js";
import { Message } from "../models/Message.js";

// --- RECORDS ---
export const uploadMedicalRecord = asyncHandler(async (req, res) => {
  const { title, recordType, notes } = req.body;
  if (!title) throw new ApiError(400, "Title is required");

  if (!req.file) throw new ApiError(400, "Document file is required");

  const record = await Record.create({
    patient: req.user._id,
    title,
    originalName: req.file.originalname,
    fileUrl: `/uploads/${req.file.filename}`,
    recordType: recordType || "general",
    notes
  });

  return res.status(201).json(new ApiResponse(201, record, "Record uploaded successfully"));
});

export const getMedicalRecords = asyncHandler(async (req, res) => {
  const records = await Record.find({ patient: req.user._id }).sort("-createdAt");
  return res.status(200).json(new ApiResponse(200, records, "Records fetched"));
});

// --- PRESCRIPTIONS ---
export const getPrescriptions = asyncHandler(async (req, res) => {
  const prescriptions = await Prescription.find({ patient: req.user._id }).populate("doctor", "specialization user").sort("-createdAt");
  return res.status(200).json(new ApiResponse(200, prescriptions, "Prescriptions fetched"));
});

// --- REMINDERS ---
export const setReminder = asyncHandler(async (req, res) => {
  const { medicineName, times, frequency } = req.body;
  if (!medicineName || !times?.length) throw new ApiError(400, "Medicine name and times are required");

  const reminder = await Reminder.create({
    patient: req.user._id,
    medicineName,
    times,
    frequency
  });

  return res.status(201).json(new ApiResponse(201, reminder, "Reminder set"));
});

export const getReminders = asyncHandler(async (req, res) => {
  const reminders = await Reminder.find({ patient: req.user._id, isActive: true }).sort("-createdAt");
  return res.status(200).json(new ApiResponse(200, reminders, "Reminders fetched"));
});

export const toggleReminder = asyncHandler(async (req, res) => {
  const { reminderId } = req.params;
  const reminder = await Reminder.findById(reminderId);
  if (!reminder) throw new ApiError(404, "Reminder not found");

  reminder.isActive = !reminder.isActive;
  await reminder.save();

  return res.status(200).json(new ApiResponse(200, reminder, "Reminder toggled"));
});

// --- SYMPTOMS ---
export const logSymptoms = asyncHandler(async (req, res) => {
  const { symptoms, notes } = req.body;
  if (!symptoms?.length) throw new ApiError(400, "Provide at least one symptom");

  const symptomLog = await Symptom.create({
    patient: req.user._id,
    symptoms,
    notes
  });

  return res.status(201).json(new ApiResponse(201, symptomLog, "Symptoms logged"));
});

export const getSymptomsHistory = asyncHandler(async (req, res) => {
  const history = await Symptom.find({ patient: req.user._id }).sort("-createdAt");
  return res.status(200).json(new ApiResponse(200, history, "Symptom history fetched"));
});

// --- MESSAGES ---
export const sendMessage = asyncHandler(async (req, res) => {
  const { receiverId, content } = req.body;
  if (!receiverId || !content) throw new ApiError(400, "Receiver and content required");

  const message = await Message.create({
    sender: req.user._id,
    receiver: receiverId,
    content
  });

  return res.status(201).json(new ApiResponse(201, message, "Message sent"));
});

export const getMessages = asyncHandler(async (req, res) => {
  const { contactId } = req.params;
  
  const messages = await Message.find({
    $or: [
      { sender: req.user._id, receiver: contactId },
      { sender: contactId, receiver: req.user._id }
    ]
  }).sort("createdAt");

  return res.status(200).json(new ApiResponse(200, messages, "Chat fetched"));
});

// --- SOS ---
export const triggerSOS = asyncHandler(async (req, res) => {
  // Mock function to alert nearest hospital and contacts
  return res.status(200).json(new ApiResponse(200, { emergencyDispatched: true }, "Emergency SOS Dispatched Successfully!"));
});
