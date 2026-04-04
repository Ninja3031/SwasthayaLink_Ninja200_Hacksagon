import express from "express";
import { verifyJWT, authorizeRoles } from "../middlewares/auth.middleware.js";
import { 
    checkClaimRules, 
    submitClaim, 
    getClaimById, 
    simulateClaimStatus 
} from "../controllers/claim.controller.js";

const router = express.Router();

router.use(verifyJWT);
router.use(authorizeRoles("patient")); // Only patients deploy their own claims natively

router.post("/check", checkClaimRules);
router.post("/", submitClaim);
router.get("/:id", getClaimById);
router.patch("/:id/simulate", simulateClaimStatus);

export default router;
