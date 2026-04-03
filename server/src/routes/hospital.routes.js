import { Router } from "express";
import { getHospitals } from "../controllers/hospital.controller.js";
import { verifyJWT, authorizeRoles } from "../middlewares/auth.middleware.js";
import { ROLES } from "../constants/roles.js";

const router = Router();

// Public/Patient route to get hospitals
router.route("/").get(getHospitals);

// Example protected route for Hospital Admin only
// router.route("/stats").get(verifyJWT, authorizeRoles(ROLES.HOSPITAL), getHospitalStats);

export default router;
