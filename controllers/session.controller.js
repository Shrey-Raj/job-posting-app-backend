import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

const secretKey = process.env.ACCESS_TOKEN_SECRET;

const verifyToken = asyncHandler(async (req, res) => {
  try {
    const { token } = req.body;

    const decodedToken = jwt.verify(token, secretKey);

    const user = await User.findById(decodedToken?._id).select("-password");

    return res
      .status(201)
      .json(new ApiResponse(200, user, "Token verified successfully!"));
  } catch (error) {
    throw new ApiError(401, "Invalid token");
  }
});

export { verifyToken };
