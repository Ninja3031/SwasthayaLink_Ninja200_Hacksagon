import { Medicine } from "../models/Medicine.js";

export const findAlternatives = async (queryParam) => {
  if (!queryParam) return { error: "Query parameter string is absolutely required." };

  // Fuzzy regex match: Split by space to get root root compound name (e.g. 'Azithromycin' instead of 'Azithromycin 500mg')
  const rootQuery = queryParam.split(/\s+/)[0].replace(/mg|ml/i, "");
  const searchMask = new RegExp(rootQuery, "i");
  
  // Locate payload where any of the central identifiers map to the query
  const targetMedicine = await Medicine.findOne({
     $or: [
        { brand_name: searchMask },
        { generic_name: searchMask },
        { composition: searchMask }
     ]
  });

  if (!targetMedicine) {
    return { error: "No recognized pharmaceutical directory matches this constraint." };
  }

  // Cost mapping: Sort the native Jan Aushadhi generic array to find the single cheapest unit.
  let cheapestAlternative = null;
  if (targetMedicine.jan_aushadhi && targetMedicine.jan_aushadhi.length > 0) {
      cheapestAlternative = targetMedicine.jan_aushadhi.reduce((minItem, currentItem) => {
          return currentItem.price < minItem.price ? currentItem : minItem;
      }, targetMedicine.jan_aushadhi[0]);
  }

  return {
      searchedDrug: targetMedicine.brand_name,
      genericComposition: targetMedicine.composition,
      categoryLock: targetMedicine.category,
      cheapestAlternative: cheapestAlternative,
      allAlternativesList: targetMedicine.jan_aushadhi,
      note: "SwasthyaLink dynamically sorts Jan Aushadhi algorithms directly matching exact chemical structures."
    };
};