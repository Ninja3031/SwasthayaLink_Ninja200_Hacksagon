import { Router } from "express";
import { 
  bookAppointment, 
  getPatientAppointments, 
  getDoctorAppointments, 
  getHospitalAppointments, 
  updateAppointmentStatus 
} from "../controllers/appointment.controller.js";
import { verifyJWT, authorizeRoles } from "../middlewares/auth.middleware.js";
import { ROLES } from "../constants/roles.js";

const router = Router();

router.use(verifyJWT);

// Patient routes
router.route("/").post(authorizeRoles(ROLES.PATIENT), bookAppointment);
router.route("/user").get(authorizeRoles(ROLES.PATIENT), getPatientAppointments);

// Doctor routes
router.route("/doctor").get(authorizeRoles(ROLES.DOCTOR), getDoctorAppointments);

// Hospital routes
router.route("/hospital").get(authorizeRoles(ROLES.HOSPITAL), getHospitalAppointments);

// Shared update status (Patient, Doctor, or Hospital)
router.route("/:id/status").patch(authorizeRoles(ROLES.PATIENT, ROLES.DOCTOR, ROLES.HOSPITAL), updateAppointmentStatus);

export default router;
