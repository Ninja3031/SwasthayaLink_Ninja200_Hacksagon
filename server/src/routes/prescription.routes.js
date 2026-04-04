import express from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { createPrescription } from "../controllers/prescription.controller.js";

const router = express.Router();

router.use(verifyJWT);

// Create Prescription securely mapped strictly for doctors natively
router.route("/").post(createPrescription);

export default router;
