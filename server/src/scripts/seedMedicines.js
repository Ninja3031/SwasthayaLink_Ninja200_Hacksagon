import mongoose from "mongoose";
import dotenv from "dotenv";
import { Medicine } from "../models/Medicine.js";

dotenv.config();

const dataset = [
  {
    "brand_name": "Crocin 650",
    "generic_name": "Paracetamol",
    "composition": "paracetamol 650 mg",
    "category": "Analgesic",
    "jan_aushadhi": [
      {
        "name": "Paracetamol Tablets IP 650 mg",
        "price": 10,
        "manufacturer": "Jan Aushadhi"
      }
    ]
  },
  {
    "brand_name": "Calpol 500",
    "generic_name": "Paracetamol",
    "composition": "paracetamol 500 mg",
    "category": "Analgesic",
    "jan_aushadhi": [
      {
        "name": "Paracetamol Tablets IP 500 mg",
        "price": 8,
        "manufacturer": "Jan Aushadhi"
      }
    ]
  },
  {
    "brand_name": "Dolo 650",
    "generic_name": "Paracetamol",
    "composition": "paracetamol 650 mg",
    "category": "Analgesic",
    "jan_aushadhi": [
      {
        "name": "Paracetamol Tablets IP 650 mg",
        "price": 10,
        "manufacturer": "Jan Aushadhi"
      }
    ]
  },
  {
    "brand_name": "Combiflam",
    "generic_name": "Ibuprofen + Paracetamol",
    "composition": "ibuprofen 400 mg + paracetamol 325 mg",
    "category": "Analgesic",
    "jan_aushadhi": [
      {
        "name": "Ibuprofen + Paracetamol Tablets",
        "price": 15,
        "manufacturer": "Jan Aushadhi"
      }
    ]
  },
  {
    "brand_name": "Brufen 400",
    "generic_name": "Ibuprofen",
    "composition": "ibuprofen 400 mg",
    "category": "Analgesic",
    "jan_aushadhi": [
      {
        "name": "Ibuprofen Tablets IP 400 mg",
        "price": 12,
        "manufacturer": "Jan Aushadhi"
      }
    ]
  },

  {
    "brand_name": "Augmentin 625",
    "generic_name": "Amoxicillin + Clavulanic Acid",
    "composition": "amoxicillin 500 mg + clavulanic acid 125 mg",
    "category": "Antibiotic",
    "jan_aushadhi": [
      {
        "name": "Amoxicillin + Clavulanate Tablets",
        "price": 35,
        "manufacturer": "Jan Aushadhi"
      }
    ]
  },
  {
    "brand_name": "Amoxil",
    "generic_name": "Amoxicillin",
    "composition": "amoxicillin 500 mg",
    "category": "Antibiotic",
    "jan_aushadhi": [
      {
        "name": "Amoxicillin Capsules IP 500 mg",
        "price": 20,
        "manufacturer": "Jan Aushadhi"
      }
    ]
  },
  {
    "brand_name": "Azithral 500",
    "generic_name": "Azithromycin",
    "composition": "azithromycin 500 mg",
    "category": "Antibiotic",
    "jan_aushadhi": [
      {
        "name": "Azithromycin Tablets IP 500 mg",
        "price": 25,
        "manufacturer": "Jan Aushadhi"
      }
    ]
  },
  {
    "brand_name": "Ciplox 500",
    "generic_name": "Ciprofloxacin",
    "composition": "ciprofloxacin 500 mg",
    "category": "Antibiotic",
    "jan_aushadhi": [
      {
        "name": "Ciprofloxacin Tablets IP 500 mg",
        "price": 18,
        "manufacturer": "Jan Aushadhi"
      }
    ]
  },

  {
    "brand_name": "Omez",
    "generic_name": "Omeprazole",
    "composition": "omeprazole 20 mg",
    "category": "Gastric",
    "jan_aushadhi": [
      {
        "name": "Omeprazole Capsules IP 20 mg",
        "price": 12,
        "manufacturer": "Jan Aushadhi"
      }
    ]
  },
  {
    "brand_name": "Pantocid 40",
    "generic_name": "Pantoprazole",
    "composition": "pantoprazole 40 mg",
    "category": "Gastric",
    "jan_aushadhi": [
      {
        "name": "Pantoprazole Tablets IP 40 mg",
        "price": 15,
        "manufacturer": "Jan Aushadhi"
      }
    ]
  },

  {
    "brand_name": "Glycomet 500",
    "generic_name": "Metformin",
    "composition": "metformin 500 mg",
    "category": "Diabetes",
    "jan_aushadhi": [
      {
        "name": "Metformin Tablets IP 500 mg",
        "price": 10,
        "manufacturer": "Jan Aushadhi"
      }
    ]
  },
  {
    "brand_name": "Amaryl 1",
    "generic_name": "Glimepiride",
    "composition": "glimepiride 1 mg",
    "category": "Diabetes",
    "jan_aushadhi": [
      {
        "name": "Glimepiride Tablets 1 mg",
        "price": 12,
        "manufacturer": "Jan Aushadhi"
      }
    ]
  },

  {
    "brand_name": "Amlong 5",
    "generic_name": "Amlodipine",
    "composition": "amlodipine 5 mg",
    "category": "Hypertension",
    "jan_aushadhi": [
      {
        "name": "Amlodipine Tablets IP 5 mg",
        "price": 8,
        "manufacturer": "Jan Aushadhi"
      }
    ]
  },
  {
    "brand_name": "Telma 40",
    "generic_name": "Telmisartan",
    "composition": "telmisartan 40 mg",
    "category": "Hypertension",
    "jan_aushadhi": [
      {
        "name": "Telmisartan Tablets 40 mg",
        "price": 15,
        "manufacturer": "Jan Aushadhi"
      }
    ]
  },

  {
    "brand_name": "Lipitor 10",
    "generic_name": "Atorvastatin",
    "composition": "atorvastatin 10 mg",
    "category": "Cholesterol",
    "jan_aushadhi": [
      {
        "name": "Atorvastatin Tablets 10 mg",
        "price": 12,
        "manufacturer": "Jan Aushadhi"
      }
    ]
  },

  {
    "brand_name": "Cetcip",
    "generic_name": "Cetirizine",
    "composition": "cetirizine 10 mg",
    "category": "Allergy",
    "jan_aushadhi": [
      {
        "name": "Cetirizine Tablets IP 10 mg",
        "price": 5,
        "manufacturer": "Jan Aushadhi"
      }
    ]
  },
  {
    "brand_name": "Allegra 120",
    "generic_name": "Fexofenadine",
    "composition": "fexofenadine 120 mg",
    "category": "Allergy",
    "jan_aushadhi": [
      {
        "name": "Fexofenadine Tablets 120 mg",
        "price": 20,
        "manufacturer": "Jan Aushadhi"
      }
    ]
  },

  {
    "brand_name": "Shelcal",
    "generic_name": "Calcium + Vitamin D3",
    "composition": "calcium carbonate + vitamin d3",
    "category": "Supplement",
    "jan_aushadhi": [
      {
        "name": "Calcium + Vitamin D3 Tablets",
        "price": 25,
        "manufacturer": "Jan Aushadhi"
      }
    ]
  },
  {
    "brand_name": "Becosules",
    "generic_name": "Vitamin B Complex",
    "composition": "vitamin b complex",
    "category": "Supplement",
    "jan_aushadhi": [
      {
        "name": "Vitamin B Complex Capsules",
        "price": 15,
        "manufacturer": "Jan Aushadhi"
      }
    ]
  }
];

const seedDatabase = async () => {
   try {
      console.log("Locating database node cluster...");
      await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/swasthayaLink_Ninja200");
      
      console.log("Dropping old medicine directories (BrandMap deprecation handling)...");
      await mongoose.connection.collection('brandmaps').drop().catch(e=>console.log("No deprecated BrandMap table found."));
      await Medicine.deleteMany({});
      
      console.log(`Injecting ${dataset.length} native medicine clusters natively...`);
      await Medicine.insertMany(dataset);

      console.log("Successfully provisioned central dataset limits!");
      process.exit(0);
   } catch(e) {
      console.error(e);
      process.exit(1);
   }
};

seedDatabase();
