import express from "express";
import { findAlternatives } from "../utils/medicineMatcher.js";

const router = express.Router();

router.get("/test", (req, res) => {
  res.json({ message: "Route working" });
});

router.get("/jan-alternative/:name", async (req, res) => {
  try {
    const result = await findAlternatives(req.params.name);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;