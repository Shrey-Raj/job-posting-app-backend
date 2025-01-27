import { Router } from "express";
import { sendVerificationEmail , verifyEmail} from "../controllers/verification.controller.js";

const router = Router();

router.post("/sendVerificationEmail", sendVerificationEmail);
router.get("/verifyemail/:token", verifyEmail);

export default router;