
import { Router } from "express";
import { submitAssessment } from "../controllers/assessmentContoller";

const router = Router();
router.post("/submit/:applicantId", submitAssessment);

export default router;