import { RequestHandler } from "express";
import { responseObject } from "@utils";
import { HttpStatusCode } from "@config";
import { PrismaClient, ApplicationStatus} from "@prisma/client";
import { Logger } from "../constants/logger";
import { sendAssessmentReceivedEmail } from "../utils/Emails/AssessmentReceivedEmail";
import { log } from "console";

const prisma = new PrismaClient();

export const submitAssessment: RequestHandler = async (req, res) => {
  try {
    const { applicantId } = req.params;
    const { githubUrl, liveDemoUrl, email } = req.body as {
      githubUrl: string;
      liveDemoUrl?: string;
      email: string;
    };

    // Validation
    if (!githubUrl?.trim()) {
      return responseObject({
        res,
        statusCode: HttpStatusCode.BAD_REQUEST,
        message: "GitHub repository link is required",
      });
    }

    const applicant = await prisma.applicant.findUnique({
      where: {id:applicantId},
      include: { assessment: true },
    });    

    if (applicant && applicant.email.trim().toLowerCase() !== email.trim().toLowerCase()){
      return responseObject({
        res,
        statusCode: HttpStatusCode.FORBIDDEN,
        message: "Email does not match applicant record",
      });
    }

    if (!applicant) {
      return responseObject({
        res,
        statusCode: HttpStatusCode.NOT_FOUND,
        message: "Applicant not found",
      });
    }

    if (!applicant.assessment) {
      return responseObject({
        res,
        statusCode: HttpStatusCode.BAD_REQUEST,
        message: "No assessment was sent to this applicant",
      });
    }

    if (applicant.assessment.submittedAt) {
      return responseObject({
        res,
        statusCode: HttpStatusCode.BAD_REQUEST,
        message: "You have already submitted your assessment",
      });
    }

    // Save submission
    await prisma.assessment.update({
      where: { applicantId },
      data: {
        submissionLink: githubUrl.trim(),
        fileUrl: liveDemoUrl?.trim() || null,
        submittedAt: new Date(),
      },
    });

    // Update applicant status
    await prisma.applicant.update({
      where: { id: applicantId },
      data: {
        applicationStatus: ApplicationStatus.ASSESSMENT_SUBMITTED,
      },
    });

    // Send confirmation email
    await sendAssessmentReceivedEmail({
      to: applicant.email,
      name: applicant.firstName,
      githubUrl: githubUrl.trim(),
      liveDemoUrl: liveDemoUrl?.trim(),
    });

    return responseObject({
      res,
      statusCode: HttpStatusCode.OK,
      message: "Assessment submitted successfully! We’ll review it soon.",
      payload: {
        submittedAt: new Date().toISOString(),
        githubUrl,
        liveDemoUrl,
      },
    });
  } catch (error: any) {
    Logger.error("Assessment submission error:", error);
    return responseObject({
      res,
      statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
      message: "Failed to submit assessment",
    });
  }
};
