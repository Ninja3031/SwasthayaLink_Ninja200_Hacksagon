import express from "express";
import { verifyJWT, authorizeRoles } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { uploadLabResult, getPatientLabResults, getDoctorLabResults } from "../controllers/lab-result.controller.js";
import { ROLES } from "../constants/roles.js";

const router = express.Router();

router.use(verifyJWT);

// Doctor strict routing
router.route("/upload").post(authorizeRoles(ROLES.DOCTOR, ROLES.HOSPITAL), upload.single("reportFile"), uploadLabResult);
router.route("/doctor").get(authorizeRoles(ROLES.DOCTOR, ROLES.HOSPITAL), getDoctorLabResults);

// Patient strict routing
router.route("/patient/:patientId").get(authorizeRoles(ROLES.PATIENT), getPatientLabResults);

export default router;
