import { Router } from "express";
import { getHospitals, getHospitalDoctors, getHospitalAppointments } from "../controllers/hospital.controller.js";
import { verifyJWT, authorizeRoles } from "../middlewares/auth.middleware.js";
import { ROLES } from "../constants/roles.js";

const router = Router();

// Public/Patient route to get hospitals
router.route("/").get(getHospitals);

// Hospital Protected Routes mapping arrays securely bounded
router.route("/:hospitalName/doctors").get(verifyJWT, authorizeRoles(ROLES.HOSPITAL), getHospitalDoctors);
router.route("/:hospitalName/appointments").get(verifyJWT, authorizeRoles(ROLES.HOSPITAL), getHospitalAppointments);

export default router;
