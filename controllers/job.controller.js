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

const updateJob = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, description, experienceLevel, endDate } = req.body;

  if (!title || !description || !experienceLevel || !endDate) {
    throw new ApiError(400, "All fields are required");
  }

  const job = await Job.findByIdAndUpdate(id, {
    title,
    description,
    experienceLevel,
    endDate,
  }, { new: true });

  if (!job) {
    throw new ApiError(404, "Job not found");
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      { job },
      "Job updated successfully!"
    )
  );
});

const deleteJob = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const job = await Job.findByIdAndDelete(id);

  if (!job) {
    throw new ApiError(404, "Job not found");
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      { job },
      "Job deleted successfully!"
    )
  );
});

const sendJobEmail = asyncHandler(async (req,res) => {
  const { title, description, endDate , experienceLevel} = req.body.jobDetails;

  const userList = req.body.userList; 

  // Ensure the user list is not empty
  if (!userList || userList.length === 0) {
    throw new ApiError(400, "No users to send the email to.");
  }

  // Create email content
  const emailContent = `
    <h2>Job Opportunity</h2>
    <p><strong>Title:</strong> ${title}</p>
    <p><strong>Description:</strong> ${description}</p>
    <p><strong>Experience:</strong> ${experienceLevel}</p>
    <p><strong>End Date:</strong> ${new Date(endDate).toLocaleDateString()}</p>
  `;

  // Send emails to all users
  const sendEmailPromises = userList.map(async (user) => {
    return transporter.sendMail({
      from: process.env.EMAIL,
      to: user.email,
      subject: `New Job: ${title}`,
      html: emailContent,
    });
  });

  // Await all email sending promises
  await Promise.all(sendEmailPromises);

  return {
    success: true,
    message: "Emails sent successfully to all users.",
  };
});


export { createJob, getAllJobs, updateJob, deleteJob, sendJobEmail }; 
