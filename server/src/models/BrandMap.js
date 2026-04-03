import mongoose from "mongoose";

const brandMapSchema = new mongoose.Schema({
  brandName: String,
  generic: String
});

export const BrandMap = mongoose.model("BrandMap", brandMapSchema);