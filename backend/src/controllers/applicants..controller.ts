import { Request, Response, NextFunction } from "express";
import { ApplicationStatus, PrismaClient } from "@prisma/client";
import { createApplicationSchema } from "../utils/applicants";
import { sendApplicationEmail } from "../utils/Emails/ApplicationEmail";
import { responseObject } from "../utils";
import { HttpStatusCode } from "../config";
import { Logger } from "../config/logger";

const prisma = new PrismaClient();

export const createApplicant = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    Logger.log("RAW BODY:", req.body);

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
      state,
      country,
      dateOfBirth,
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

    const newApplicant = await prisma.applicant.create({
      data: {
        firstName,
        lastName,
        email,
        phoneNumber,
        city,
        track,
        state,
        country,
        dateOfBirth,
        frontendTools,
        backendTools,
        obileTools,
        frontendToolsOther,
        backendToolsOther,
        mobileToolsOther,
        referralSource,
        referralSourceOther,
      },
      include: { assessment: true },
    });

    const emailSent = await sendApplicationEmail(
      email,
      `${firstName} ${lastName}`,
    );
    Logger.log(emailSent ? "Email Sent!" : "Email failed");

    return responseObject({
      res,
      status: true,
      statusCode: HttpStatusCode.CREATED,
      message: "Applicant created!",
      payload: newApplicant,
    });

  } catch (error: any) {
    if (error.code === "P2002") {
      return responseObject({
        res,
        status: false,
        statusCode: HttpStatusCode.CONFLICT,
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
    const applicants = await prisma.applicant.findMany({
      where: { applicationStatus: ApplicationStatus.PENDING },
      take: 50,
      skip: 0,
      orderBy: { createdAt: "asc" },
      select: {
        id: true,
        firstname: true,
        lastname: true,
        email: true,
        track: true,
        phoneNumber: true,
        createdAt: true,
      },
    });
    

    return responseObject({
      res,
      statusCode: HttpStatusCode.OK,
      status: true,
      payload: {
        data: applicants,
        count: applicants.length,
      },
      message: "All Applicants",
    });

   
  } catch (error: any) {
    next(error);
  }
};
