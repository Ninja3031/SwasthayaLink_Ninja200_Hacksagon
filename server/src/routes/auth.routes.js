import { Router } from "express";
import { 
   signupPatient, signinPatient, 
   signupDoctor, signinDoctor, 
   signupHospital, signinHospital, 
   logoutUser 
} from "../controllers/auth.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/patient/signup").post(signupPatient);
router.route("/patient/signin").post(signinPatient);

router.route("/doctor/signup").post(signupDoctor);
router.route("/doctor/signin").post(signinDoctor);

router.route("/hospital/signup").post(signupHospital);
router.route("/hospital/signin").post(signinHospital);

// Secured routes
router.route("/logout").post(verifyJWT, logoutUser);

export default router;
