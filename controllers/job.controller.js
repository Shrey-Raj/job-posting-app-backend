import { Job } from "../models/job.model.js"; 
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import nodemailer from 'nodemailer'

const createJob = asyncHandler(async (req, res) => {
  const { title, description, experienceLevel, endDate , email } = req.body;

  if (!title || !description || !experienceLevel || !endDate || !email) {
    throw new ApiError(400, "All fields are required");
  }

  const job = await Job.create({
    title,
    description,
    experienceLevel,
    endDate,
    email
  });

  return res.status(201).json(
    new ApiResponse(
      200,
      { _id:job._id, job },
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

  if (!userList || userList.length === 0) {
    throw new ApiError(400, "No users to send the email to.");
  }

  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const emailContent = `
    <h2>Job Opportunity</h2>
    <p><strong>Title:</strong> ${title}</p>
    <p><strong>Description:</strong> ${description}</p>
    <p><strong>Experience:</strong> ${experienceLevel}</p>
    <p><strong>End Date:</strong> ${new Date(endDate).toLocaleDateString()}</p>
  `;

  // Send emails to all users
  const sendEmailPromises = userList.map(async (user) => {
    try {
      const info = await transporter.sendMail({
        from: process.env.EMAIL,
        to: user.email,
        subject: `New Job: ${title}`,
        html: emailContent,
      });
      console.log(`Email sent successfully to: ${user.email}`); 
      return { email: user.email, status: 'success', info }; 
    } catch (error) {
      console.error(`Failed to send email to: ${user.email}`, error.message);
      return { email: user.email, status: 'failed', error: error.message }; 
    }
  });
  
  const results = await Promise.allSettled(sendEmailPromises);
  
  const sentEmails = [];
  const failedEmails = [];
  
  results.forEach((result) => {
    if (result.status === 'fulfilled') {
      const { email, status, info } = result.value;
      if (status === 'success') {
        sentEmails.push({ email, info });
      } else {
        failedEmails.push({ email, error: result.value.error });
      }
    } else {
      failedEmails.push({ email: 'unknown', error: result.reason.message });
    }
  });
  
  console.log('Summary:');
  console.log('Sent Emails:', sentEmails);
  console.log('Failed Emails:', failedEmails);

  return {
    success: true,
    message: "Emails sent successfully to all users.",
  };
});


export { createJob, getAllJobs, updateJob, deleteJob, sendJobEmail }; 
