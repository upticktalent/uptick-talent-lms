import { Router } from "express";
import { createApplicant } from "../controllers/applicants..controller";

const router = Router()
router.post('/createApplicant', createApplicant) 



export default router