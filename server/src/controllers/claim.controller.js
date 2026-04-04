import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { Claim } from "../models/Claim.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper generic to aggressively read intelligence rules
const getRules = () => {
    const rulesPath = path.join(__dirname, '..', 'utils', 'rules.json');
    const rawData = fs.readFileSync(rulesPath);
    return JSON.parse(rawData);
};

// @route POST /api/v1/claims/check
// @desc Execute intelligence algorithm generating dynamic coverage statistics
export const checkClaimRules = asyncHandler(async (req, res) => {
  const { disease, amount, documents } = req.body;
  if (!disease || !amount || !Array.isArray(documents)) {
     throw new ApiError(400, "Validation hook missing required elements");
  }

  const guidelines = getRules();
  const rule = guidelines[disease];

  if (!rule) {
    throw new ApiError(404, "Disease mapping not supported dynamically.");
  }

  let claimScore = 100;
  let missingDocs = [];

  // 1. Intelligence Map Limit
  let coverageStatus = "covered";
  if (amount > rule.maxAmount) {
     coverageStatus = "exceeds limit";
     claimScore -= 30;
  }

  // 2. Document Map Limit
  rule.requiredDocs.forEach(doc => {
     if (!documents.includes(doc)) {
         missingDocs.push(doc);
         claimScore -= 20;
     }
  });

  // Zero floor wrapper securely
  if(claimScore < 0) claimScore = 0;

  let approvalChance = "LOW";
  if(claimScore >= 80) approvalChance = "HIGH";
  else if(claimScore >= 50) approvalChance = "MEDIUM";

  const intelPayload = {
      disease,
      requestedAmount: amount,
      maxLimit: rule.maxAmount,
      coverageStatus,
      missingDocs,
      claimScore,
      approvalChance
  };

  return res.status(200).json(new ApiResponse(200, intelPayload, "Claim intelligence processed beautifully"));
});

// @route POST /api/v1/claims
// @desc Submit a full claim mapped to DB
export const submitClaim = asyncHandler(async (req, res) => {
  const { disease, hospital, amount, documents, score, approvalChance } = req.body;
  
  if(!disease || !hospital || !amount) {
     throw new ApiError(400, "Missing core structural data manually to map claim");
  }

  const explicitDocArray = Array.isArray(documents) ? documents : [];

  const claim = await Claim.create({
      patient: req.user._id,
      disease,
      hospital,
      amount,
      documents: explicitDocArray,
      score: score || 0,
      approvalChance: approvalChance || "LOW",
      status: "SUBMITTED"
  });

  return res.status(201).json(new ApiResponse(201, claim, "Claim natively stored in MongoDB system"));
});

// @route GET /api/v1/claims/:id
// @desc Get Tracker Timeline UI metadata
export const getClaimById = asyncHandler(async (req, res) => {
   const claim = await Claim.findOne({ _id: req.params.id, patient: req.user._id });
   if(!claim) throw new ApiError(404, "Requested claim metadata unlocatable or unverified.");

   return res.status(200).json(new ApiResponse(200, claim, "Claim timeline located"));
});

// @route PATCH /api/v1/claims/:id/simulate
// @desc Demo logic for hackathon to jump timeline bounds explicitly
export const simulateClaimStatus = asyncHandler(async (req, res) => {
    const { targetStatus } = req.body;
    const claim = await Claim.findOneAndUpdate(
       { _id: req.params.id, patient: req.user._id },
       { status: targetStatus },
       { new: true }
    );
    if(!claim) throw new ApiError(404, "Claim unlocatable securely");

    return res.status(200).json(new ApiResponse(200, claim, "Artificial timeline status manipulated"));
});
