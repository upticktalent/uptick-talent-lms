import { Router } from "express";
import { createApplicant, getAllApplicants } from "../controllers/applicants..controller";

const router = Router()
router.post('/createApplicant', createApplicant) 
router.get('/',  getAllApplicants)



export default router