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
  updateReminderStatus,
  placeOrder,
  logSymptoms,
  getSymptomsHistory,
  updateSymptom,
  deleteSymptom,
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
router.route("/reminders/:reminderId/status").put(updateReminderStatus);

// Orders
router.route("/orders").post(placeOrder);

// Symptoms
router.route("/symptoms").get(getSymptomsHistory).post(logSymptoms);
router.route("/symptoms/:id").put(updateSymptom).delete(deleteSymptom);

// Messages
router.route("/messages/:contactId").get(getMessages);
router.route("/messages/send").post(sendMessage);

// SOS
router.route("/sos/trigger").post(triggerSOS);

export default router;
