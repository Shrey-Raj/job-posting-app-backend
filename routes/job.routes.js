import { Router } from "express";
import { createJob, getAllJobs, updateJob, deleteJob, sendJobEmail } from "../controllers/job.controller.js";

const router = Router();

router.post("/create", createJob);
router.get("/getalljobs", getAllJobs);
router.post("/sendjobemail", sendJobEmail);
router.put("/update/:id", updateJob);
router.delete("/delete/:id", deleteJob);

export default router;
