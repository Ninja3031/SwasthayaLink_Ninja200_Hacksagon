import mongoose from "mongoose";

const medicineSchema = new mongoose.Schema({
  name: String,
  composition: String,
  price: Number,
  manufacturer: {
    type: String,
    default: "Jan Aushadhi"
  }
});

export const Medicine = mongoose.model("Medicine", medicineSchema);