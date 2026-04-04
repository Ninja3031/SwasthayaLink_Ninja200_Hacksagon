import express from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { uploadAndProcessOCR, getPatientRecords } from "../controllers/record.controller.js";

const router = express.Router();

router.use(verifyJWT);
router.use(authorizeRoles("patient"));

// Using local intercept binding -> array extraction or single execution bounds
router.post("/upload", upload.single("recordFile"), uploadAndProcessOCR);
router.get("/", getPatientRecords);

export default router;
