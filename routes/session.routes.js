import { Router } from "express";
import { verifyToken } from "../controllers/session.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/verifyToken", verifyToken);

export default router;
