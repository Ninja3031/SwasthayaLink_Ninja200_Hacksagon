import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import medicineRoutes from "./routes/medicine.routes.js";
import path from "path";

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

// Serve static files from the 'public' directory
app.use(express.static("public"));

// Route imports
import authRoutes from './routes/auth.routes.js';
import hospitalRoutes from './routes/hospital.routes.js';
import doctorRoutes from './routes/doctor.routes.js';
import appointmentRoutes from './routes/appointment.routes.js';
import patientRoutes from './routes/patient.routes.js';
import labResultRoutes from './routes/lab-results.routes.js';
import emergencyRoutes from './routes/emergency.routes.js';
import messageRoutes from './routes/messages.routes.js';
import claimRoutes from './routes/claim.routes.js';
import recordRoutes from './routes/record.routes.js';
import prescriptionRoutes from './routes/prescription.routes.js';

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/hospitals", hospitalRoutes);
app.use("/api/v1/doctors", doctorRoutes);
app.use("/api/v1/appointments", appointmentRoutes);
app.use("/api/v1/lab-results", labResultRoutes);
app.use("/api/v1/emergency", emergencyRoutes);
app.use("/api/v1/messages", messageRoutes);
app.use("/api/v1/claims", claimRoutes);
app.use("/api/v1/records", recordRoutes);
app.use("/api/v1/prescriptions", prescriptionRoutes);
app.use("/api/medicines", medicineRoutes);
app.use("/api/v1/patient", patientRoutes);

// Root route
app.get("/api/v1/healthcheck", (req, res) => {
  res.status(200).json({ status: "ok", message: "SwasthyaLink API is running" });
});

// Import and use Error Middleware
import { errorHandler } from "./middlewares/error.middleware.js";
app.use(errorHandler);

// Serve frontend in production
if (process.env.NODE_ENV === "production") {
  const __dirname = path.resolve();
  app.use(express.static(path.join(__dirname, "../client/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../client", "dist", "index.html"));
  });
}

export { app };
