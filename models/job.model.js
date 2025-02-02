import mongoose from "mongoose";
const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    experienceLevel: {
      type: String,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    email: {
      type: String,
      required: [true, "Please provide email"],
    },
  },
  { timestamps: true }
);

const Job = mongoose.model("Job", jobSchema);

export { Job };
