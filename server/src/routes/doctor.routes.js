import { Router } from "express";
import { updateAvailability, addDoctor } from "../controllers/doctor.controller.js";
import { verifyJWT, authorizeRoles } from "../middlewares/auth.middleware.js";
import { ROLES } from "../constants/roles.js";

const router = Router();

router.use(verifyJWT);

// Doctor only route
router.route("/availability").patch(authorizeRoles(ROLES.DOCTOR), updateAvailability);

// Hospital Admin only route
router.route("/").post(authorizeRoles(ROLES.HOSPITAL), addDoctor);

export default router;
