import mongoose from "mongoose";

const medicineSchema = new mongoose.Schema({
  brand_name: { type: String, required: true },
  generic_name: { type: String },
  composition: { type: String, required: true },
  category: { type: String },
  jan_aushadhi: [
    {
       name: String,
       price: Number,
       manufacturer: { type: String, default: "Jan Aushadhi" }
    }
  ]
});

export const Medicine = mongoose.model("Medicine", medicineSchema);