import { Job } from "../models/job.model.js"; 
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createJob = asyncHandler(async (req, res) => {
  const { title, description, experienceLevel, endDate } = req.body;

  if (!title || !description || !experienceLevel || !endDate) {
    throw new ApiError(400, "All fields are required");
  }

  const job = await Job.create({
    title,
    description,
    experienceLevel,
    endDate,
  });

  return res.status(201).json(
    new ApiResponse(
      200,
      { job },
      "Job created successfully!"
    )
  );
});

const getAllJobs = asyncHandler(async (req, res) => {
  const jobs = await Job.find(); 
  return res.status(200).json(
    new ApiResponse(
      200,
      { jobs },
      "Jobs retrieved successfully!"
    )
  );
});

export { createJob, getAllJobs }; 
