import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { Record } from "../models/Record.js";
import Tesseract from "tesseract.js";

// Helper NLP Function for extracting structural bounds deterministically
const extractStructuredIntelligence = (rawText) => {
   const structured = {
      patientName: "Not Found",
      doctor: "Not Found",
      date: "Not Found",
      medicines: []
   };

   // Format cleanly mapping line spacing
   const lines = rawText.split('\n').map(l => l.trim()).filter(l => l.length > 0);

   lines.forEach(line => {
      const lowerLine = line.toLowerCase();
      
      // 1. Doctor extraction bound
      if ((lowerLine.includes("dr.") || lowerLine.includes("doctor:") || lowerLine.startsWith("dr ")) && structured.doctor === "Not Found") {
          structured.doctor = line.replace(/doctor:?/i, '').trim();
      }

      // 2. Patient extraction bound
      if ((lowerLine.includes("patient:") || lowerLine.includes("pt:") || lowerLine.includes("pt name:")) && structured.patientName === "Not Found") {
          structured.patientName = line.replace(/(patient:|pt:|pt name:?)/i, '').trim();
      }

      // 3. Date extraction bound (e.g. 12/04/2026, 12-04-2026)
      const dateRegex = /(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4})/;
      const dateMatch = line.match(dateRegex);
      if (dateMatch && structured.date === "Not Found") {
          structured.date = dateMatch[0];
      }

      // 4. Medicine extraction limit (looking for mg, ml, tab, caps)
      if (lowerLine.match(/\b(mg|ml|mcg|gm|tab|tablet|capsule|cap|syr|syrup)\b/)) {
          structured.medicines.push(line);
      }
   });

   return structured;
};

// @route POST /api/v1/records/upload
// @desc Processes securely physical prescriptions utilizing deterministic OCR hooks
export const uploadAndProcessOCR = asyncHandler(async (req, res) => {
   
   if (!req.file) {
      throw new ApiError(400, "Image payload failed validation map. No file attached!");
   }

   // Local filesystem path parsed natively via multer configuration mapping
   const filePath = req.file.path;

   try {
       // Deep hook into Tesseract Execution Pipeline mapping
       const { data: { text } } = await Tesseract.recognize(
          filePath,
          'eng',
          { logger: m => console.log(m) } // Tracing logs manually strictly
       );

       const cleanText = text.replace(/[^a-zA-Z0-9\s:/\-.,()]/g, '');

       const parsedStructure = extractStructuredIntelligence(cleanText);

       // Natively map into DB model persistence framework
       const newRecord = await Record.create({
          patient: req.user._id,
          fileUrl: `/uploads/${req.file.filename}`, 
          extractedText: cleanText,
          structuredData: parsedStructure,
          documentType: "Prescription" 
       });

       return res.status(201).json(new ApiResponse(201, newRecord, "OCR Pipeline Extracted Safely"));
   } catch (err) {
       console.error("Tesseract Engine Failure", err);
       throw new ApiError(500, "Native transcription execution crashed entirely.");
   }
});

// @route GET /api/v1/records
// @desc Execute retrieval pipeline for users OCR data
export const getPatientRecords = asyncHandler(async (req, res) => {
   const records = await Record.find({ patient: req.user._id }).sort("-createdAt");
   return res.status(200).json(new ApiResponse(200, records, "Extracted limits natively"));
});
