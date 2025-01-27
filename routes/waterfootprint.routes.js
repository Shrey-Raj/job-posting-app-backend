import {Router} from "express";
import { getWaterFootprintDetailsByProductName, getWaterFootprintDetailsAll, getInsights } from "../controllers/waterfootprint.controller.js";

const router = Router();

router.get("/", getWaterFootprintDetailsByProductName);
router.get("/all", getWaterFootprintDetailsAll);
router.get("/insights", getInsights);

export default router;
