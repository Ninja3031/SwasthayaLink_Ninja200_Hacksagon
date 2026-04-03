import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

const app = express();

app.use(cors({
  origin: process.env.CORS_ORIGIN || "*",
  credentials: true
}));

app.use(helmet());
app.use(morgan("dev"));
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

// Route imports
import authRoutes from './routes/auth.routes.js';
app.use("/api/v1/auth", authRoutes);

// Root route
app.get("/api/v1/healthcheck", (req, res) => {
  res.status(200).json({ status: "ok", message: "SwasthyaLink API is running" });
});

// Import and use Error Middleware
import { errorHandler } from "./middlewares/error.middleware.js";
app.use(errorHandler);

export { app };
