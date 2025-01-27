import { Router } from "express";
import { createJob, getAllJobs } from "../controllers/job.controller.js";

const router = Router();

router.post("/create", createJob);
router.get("/getalljobs", getAllJobs);

export default router;
