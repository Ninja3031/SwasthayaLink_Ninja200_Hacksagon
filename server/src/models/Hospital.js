import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { ROLES } from "../constants/roles.js";

const hospitalSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: ROLES.HOSPITAL,
    },
    registrationNumber: {
      type: String,
    },
    facilityType: {
      type: String,
    },
    refreshToken: {
      type: String,
    }
  },
  { timestamps: true }
);

hospitalSchema.pre("save", async function () {
  if (this.isModified("password")) {
     this.password = await bcrypt.hash(this.password, 10);
  }
});

hospitalSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

hospitalSchema.methods.generateAccessToken = function () {
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

export const Hospital = mongoose.model("Hospital", hospitalSchema);
