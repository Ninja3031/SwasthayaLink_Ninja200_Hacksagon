import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import { brandToGeneric, janAushadhiMedicines } from "../data/medicines.js";
import { BrandMap } from "../models/BrandMap.js";
import { Medicine } from "../models/Medicine.js";

// 🔥 Resolve correct path to root .env
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
  path: path.resolve(__dirname, "../../../.env")
});

const seedData = async () => {
  try {
    // 🔍 Debug log (remove later)
    console.log("Loaded MONGO_URI:", process.env.MONGO_URI);

    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is undefined. Check your .env file path.");
    }

    await mongoose.connect(process.env.MONGO_URI);

    console.log("✅ MongoDB Connected");

    // 🧹 Clear old data
    await BrandMap.deleteMany();
    await Medicine.deleteMany();

    console.log("🗑️ Old data cleared");

    // 📥 Insert new data
    await BrandMap.insertMany(brandToGeneric);
    await Medicine.insertMany(janAushadhiMedicines);

    console.log("✅ Data Seeded Successfully");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding data:", error.message);
    process.exit(1);
  }
};

seedData();