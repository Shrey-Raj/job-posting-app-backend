import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import nodemailer from "nodemailer";
import crypto from "crypto";
import {asyncHandler} from "../utils/asyncHandler.js";

// In-memory store for tokens (use Redis or similar in production)
const emailVerificationTokens = new Map();

// Nodemailer configuration
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export const sendVerificationEmail = asyncHandler(async (req, res) => {
  const { email } = req.body;

  // Check if the user exists
  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (user.emailverified) {
    throw new ApiError(400, "Email is already verified");
  }

  // Generate a unique token
  const token = crypto.randomBytes(32).toString("hex");

  // Set token and expiration in the database
  user.verificationToken = token;
  user.verificationTokenExpires = Date.now() + 3600000; // 1 hour
  await user.save();

  // Verification URL
  const verificationUrl = `${process.env.SERVER_BASE_URL}/api/v1/verification/verifyemail/${token}`;

  // Send the verification email
  await transporter.sendMail({
    from: process.env.EMAIL,
    to: email,
    subject: "Email Verification",
    html: `<p>Click the link below to verify your email:</p>
           <a href="${verificationUrl}">VERIFY EMAIL</a>`,
  });

  return res.status(200).json(
    new ApiResponse(200, null, "Verification email sent! Please check your inbox.")
  );
});


export const verifyEmail = asyncHandler(async (req, res) => {
  const { token } = req.params;

  // Find user with the token and check expiration
  const user = await User.findOne({
    verificationToken: token,
    verificationTokenExpires: { $gt: Date.now() }, // Ensure token has not expired
  });

  if (!user) {
    throw new ApiError(400, "Invalid or expired token");
  }

  // Mark email as verified
  user.emailverified = true;
  user.verificationToken = null; // Clear the token
  user.verificationTokenExpires = null; // Clear expiration
  await user.save();

  return res.status(200).json(
    new ApiResponse(200, null, "Email verified successfully!")
  );
});

