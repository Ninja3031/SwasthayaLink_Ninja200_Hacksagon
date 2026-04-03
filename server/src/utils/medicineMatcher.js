import { BrandMap } from "../models/BrandMap.js";
import { Medicine } from "../models/Medicine.js";

export const findAlternatives = async (brandName) => {
  const mapping = await BrandMap.findOne({
    brandName: { $regex: brandName, $options: "i" }
  });

  if (!mapping) {
    return { error: "No generic mapping found" };
  }

  const alternatives = await Medicine.find({
    composition: { $regex: mapping.generic, $options: "i" }
  });

  return {
      generic: mapping.generic,
        alternatives: alternatives.map((med) => ({
        name: med.name,
        price: med.price,
        manufacturer: med.manufacturer
    })),
    note: "Consult your doctor before switching medicines"
    };
};