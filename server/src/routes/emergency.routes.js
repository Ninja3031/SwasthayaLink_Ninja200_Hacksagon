import express from "express";
import { verifyJWT, authorizeRoles } from "../middlewares/auth.middleware.js";
import { triggerSOS, getActiveSOS } from "../controllers/emergency.controller.js";
import { ROLES } from "../constants/roles.js";

const router = express.Router();

router.use(verifyJWT);

// Patient Trigger
router.route("/sos").post(authorizeRoles(ROLES.PATIENT), triggerSOS);

// Hospital Viewer
router.route("/alerts").get(authorizeRoles(ROLES.HOSPITAL, ROLES.DOCTOR), getActiveSOS);

export default router;
