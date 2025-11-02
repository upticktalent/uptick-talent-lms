import { Request, Response, NextFunction } from "express";
import { PrismaClient, Prisma } from "@prisma/client";
import { createApplicationSchema } from "../utils/applicants";

const prisma = new PrismaClient();

export const createApplicant = async (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log("RAW BODY:", req.body); 

    const parsed = createApplicationSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: parsed.error.issues.map(i => ({ field: i.path.join("."), msg: i.message }))
      });
    }

    const {
      firstName, lastName, email, phoneNumber, city, track,
      frontendTools, backendTools, mobileTools,
      frontendToolsOther, backendToolsOther, mobileToolsOther,
      referralSource, referralSourceOther, status
    } = parsed.data;

    const newApplicant = await prisma.application.create({
      data: {
        firstName,
        lastName,
        email,
        phoneNumber,
        city,
        track,
        frontendTools,
        backendTools,
        mobileTools,
        frontendToolsOther,
        backendToolsOther,
        mobileToolsOther,
        referralSource,
        referralSourceOther: referralSource === "OTHER" ? referralSourceOther : null,
        status,
      },
      include: { assessments: true }
    });

    return res.status(201).json({
      success: true,
      message: "Applicant created!",
      data: newApplicant
    });

  } catch (error: any) {
    if (error.code === "P2002") {
      return res.status(409).json({
        success: false,
        message: "Email or phone already exists"
      });
    }
    next(error);
  }
};