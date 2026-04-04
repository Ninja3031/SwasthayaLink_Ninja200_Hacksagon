import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { ROLES } from "../constants/roles.js";

const doctorSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: ROLES.DOCTOR,
    },
    hospitalName: {
      type: String,
      required: true,
    },
    experience: {
      type: Number,
      required: true,
      default: 0
    },
    speciality: {
      type: String,
      required: true,
    },
    availabilityStatus: {
      type: Boolean,
      default: true
    },
    consultationFee: {
      type: Number,
      default: 500
    },
    availableSlots: {
      type: [String],
      default: ["09:00 AM", "10:00 AM", "11:00 AM", "02:00 PM", "04:00 PM"]
    },
    refreshToken: {
      type: String,
    }
  },
  { timestamps: true }
);

doctorSchema.pre("save", async function () {
  if (this.isModified("password")) {
     this.password = await bcrypt.hash(this.password, 10);
  }
});

doctorSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

doctorSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      role: this.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY || "1d",
    }
  );
};

export const Doctor = mongoose.model("Doctor", doctorSchema);
