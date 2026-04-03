import express from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import {
  uploadMedicalRecord,
  getMedicalRecords,
  getPrescriptions,
  setReminder,
  getReminders,
  toggleReminder,
  logSymptoms,
  getSymptomsHistory,
  sendMessage,
  getMessages,
  triggerSOS
} from "../controllers/patient.controller.js";

const router = express.Router();

router.use(verifyJWT);

// Records
router.route("/records").get(getMedicalRecords);
router.route("/records/upload").post(upload.single("document"), uploadMedicalRecord);

// Prescriptions
router.route("/prescriptions").get(getPrescriptions);

// Reminders
router.route("/reminders").get(getReminders).post(setReminder);
router.route("/reminders/:reminderId/toggle").patch(toggleReminder);

// Symptoms
router.route("/symptoms").get(getSymptomsHistory).post(logSymptoms);

// Messages
router.route("/messages/:contactId").get(getMessages);
router.route("/messages/send").post(sendMessage);

// SOS
router.route("/sos/trigger").post(triggerSOS);

export default router;
