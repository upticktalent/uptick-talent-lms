import { Router } from "express";
import { createApplicant, getAllApplicants } from "../controllers/applicants..controller";
// import { submitAssessment } from "@controllers/assessmentContoller";

const router = Router()

router.post('/createApplicant', createApplicant) 
router.get('/',  getAllApplicants)
// router.post('/applicants/:applicantId/assessment/submit', submitAssessment);



export default router