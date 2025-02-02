import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password, } = req.body;

  const existedUser = await User.findOne({
    email,
  });

  if (existedUser) {
    throw new ApiError(409, "User with email or username already exists", []);
  }

  const user = await User.create({
    username,
    email,
    password,
    
  });

  const accessToken = await user.generateAccessToken();

  const { password: removedPassword, ...userWithoutPassword } = user.toObject();

  console.log("New user saved successfully!"); 

  return res.status(201).json(
    new ApiResponse(
      200,
      {
        user: userWithoutPassword,
        token: accessToken,
      },
      "User registered successfully!"
    )
  );
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email) {
    throw new ApiError(400, "Username or email is required");
  }

  const user = await User.findOne({
    email,
  });

  if (!user) {
    throw new ApiError(404, "User does not exist");
  }

  // Compare the incoming password with hashed password
  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials");
  }

  const accessToken = await user.generateAccessToken();

  const { password: removedPassword, ...userWithoutPassword } = user.toObject();

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { token: accessToken, user: userWithoutPassword },
        "User logged in successfully"
      )
    );
});


export { registerUser, loginUser };
