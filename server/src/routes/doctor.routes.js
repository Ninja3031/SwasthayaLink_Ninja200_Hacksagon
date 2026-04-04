import { Router } from "express";
import { updateAvailability, addDoctor, getDoctors, getDoctorAvailability, updateDoctorSlots, getTreatedPatients } from "../controllers/doctor.controller.js";
import { verifyJWT, authorizeRoles } from "../middlewares/auth.middleware.js";
import { ROLES } from "../constants/roles.js";

const router = Router();

router.use(verifyJWT);

// Available to Patients and Everyone logged in
router.route("/").get(getDoctors);
router.route("/:id/availability").get(getDoctorAvailability);

// Doctor only route
router.route("/availability").patch(authorizeRoles(ROLES.DOCTOR), updateAvailability);
router.route("/slots").patch(authorizeRoles(ROLES.DOCTOR), updateDoctorSlots);
router.route("/patients").get(authorizeRoles(ROLES.DOCTOR), getTreatedPatients);

// Hospital Admin only route
router.route("/").post(authorizeRoles(ROLES.HOSPITAL), addDoctor);

export default router;
