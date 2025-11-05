import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import { createApplicationSchema } from "../utils/applicants";
import { sendApplicationEmail } from "../utils/email";
import { success } from "zod";

const prisma = new PrismaClient();

export const createApplicant = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    console.log("RAW BODY:", req.body);

    const parsed = createApplicationSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: parsed.error.issues.map((i) => ({
          field: i.path.join("."),
          msg: i.message,
        })),
      });
    }

    const {
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
      referralSourceOther,
      status,
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
        referralSourceOther:
          referralSource === "OTHER" ? referralSourceOther : null,
        status,
      },
      include: { assessments: true },
    });

    const emailSent = await sendApplicationEmail(
      email,
      `${firstName} ${lastName}`,
    );
    console.log(emailSent ? "Email Sent!" : "Email failed");

    return res.status(201).json({
      success: true,
      message: "Applicant created!",
      data: newApplicant,
    });
  } catch (error: any) {
    if (error.code === "P2002") {
      return res.status(409).json({
        success: false,
        message: "Email or phone already exists",
      });
    }
    next(error);
  }
};

export const getAllApplicants = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const applicants = await prisma.application.findMany({
      where: { status: "PENDING" },
      take: 50,
      skip: 0,
      orderBy: { createdAt: "asc" },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email:true,
        track:true,
        phoneNumber:true,
        createdAt: true,
      }
    });
    
    return res.status(201) .json({
      success: true,
      allApplicants: applicants,
      count:  applicants.length
    })
    
  } catch (error:any) {
    next(error)
  }
};
