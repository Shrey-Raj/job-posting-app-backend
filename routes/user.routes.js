import { Router } from "express";
import { loginUser, registerUser } from "../controllers/user.controller.js";
import { avoidInProduction } from "../middlewares/auth.middleware.js";

const router = Router();

// router.post("/register", avoidInProduction, registerUser);
router.post("/register", registerUser);
router.post("/login", loginUser);

export default router;