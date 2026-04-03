import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import medicineRoutes from "./routes/medicine.routes.js";

const app = express();

app.use(cors({
  origin: process.env.CORS_ORIGIN || "*",
  credentials: true
}));

import cookieParser from "cookie-parser";

app.use(helmet());
app.use(morgan("dev"));
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());

// Route imports
import authRoutes from './routes/auth.routes.js';
import hospitalRoutes from './routes/hospital.routes.js';
import doctorRoutes from './routes/doctor.routes.js';
import appointmentRoutes from './routes/appointment.routes.js';
import patientRoutes from './routes/patient.routes.js';

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/hospitals", hospitalRoutes);
app.use("/api/v1/doctors", doctorRoutes);
app.use("/api/v1/appointments", appointmentRoutes);
app.use("/api/medicines", medicineRoutes);
app.use("/api/v1/patient", patientRoutes);

// Root route
app.get("/api/v1/healthcheck", (req, res) => {
  res.status(200).json({ status: "ok", message: "SwasthyaLink API is running" });
});

// Import and use Error Middleware
import { errorHandler } from "./middlewares/error.middleware.js";
app.use(errorHandler);

export { app };
