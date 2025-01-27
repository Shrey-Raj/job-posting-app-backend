import { Router } from "express";
import {
  completeMultipartUpload,
  generatePreSignedUrlForMultipart,
  generateSinglePreSignedUrl,
  startMultipartUpload,
} from "../controllers/uploads.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/single-upload", verifyJWT, generateSinglePreSignedUrl);
router.post("/start-multipart-upload", verifyJWT, startMultipartUpload);
router.post(
  "/generate-presigned-url",
  verifyJWT,
  generatePreSignedUrlForMultipart
);
router.post("/complete-multipart-upload", verifyJWT, completeMultipartUpload);

export default router;
