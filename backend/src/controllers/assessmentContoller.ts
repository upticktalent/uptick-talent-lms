import { RequestHandler } from "express";
import { responseObject } from "@utils";
import { HttpStatusCode } from "@config";
import { PrismaClient, ApplicationStatus, Track } from "@prisma/client";
import { Logger } from "../constants/logger";
import { sendAssessmentReceivedEmail } from "../utils/Emails/AssessmentReceivedEmail";
import { AuthRequest } from "src/middleware/auth";

const prisma = new PrismaClient();

// POST /api/v1/admin/track-assessments
// Body: { track: "FRONTEND", title, instructions, submissionLink?, dueDate? }
export const saveTrackAssessment: RequestHandler = async (req, res) => {
  try {
    const { track, title, instructions, submissionLink, dueDate } = req.body;
    const authReq = req as AuthRequest;
    const adminId = authReq.user.id;

    if (!track || !title || !instructions) {
      return responseObject({
        res,
        statusCode: HttpStatusCode.BAD_REQUEST,
        message: "Track, title, and instructions are required",
      });
    }

    const assessment = await prisma.trackAssessment.upsert({
      where: { track },
      update: {
        title,
        instructions,
        submissionLink: submissionLink || null,
        dueDate: dueDate ? new Date(dueDate) : null,
        updatedAt: new Date(),
      },
      create: {
        track,
        title,
        instructions,
        submissionLink: submissionLink || null,
        dueDate: dueDate ? new Date(dueDate) : null,
        createdById: adminId,
      },
    });

    return responseObject({
      res,
      statusCode: HttpStatusCode.OK,
      message: `Assessment for ${track} saved successfully`,
      payload: { assessment },
    });
  } catch (error: any) {
    Logger.error("Save track assessment error:", error);
    return responseObject({
      res,
      statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
      message: "Failed to save track assessment",
    });
  }
};

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
      where: { id: applicantId },
      include: { assessment: true },
    });

    if (
      applicant &&
      applicant.email.trim().toLowerCase() !== email.trim().toLowerCase()
    ) {
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

export const getTrackAssessment: RequestHandler = async (req, res) => {
  try {
    const { track } = req.params;

    if (!track || !Object.values(Track).includes(track as Track)) {
      return responseObject({
        res,
        statusCode: HttpStatusCode.NOT_FOUND,
        message: "Invalid or unsupported track",
      });
    }

    const assessment = await prisma.trackAssessment.findUnique({
      where: { track: track as Track },
      include: {
        createdBy: {
          select: { firstName: true, lastName: true, email: true },
        },
      },
    });

    if (!assessment || !assessment.isActive) {
      return responseObject({
        res,
        statusCode: HttpStatusCode.NOT_FOUND,
        message: "No active assessment found for this track",
      });
    }

    return responseObject({
      res,
      statusCode: HttpStatusCode.OK,
      payload: { assessment },
      message: "Assessment successfuly fetched",
    });
  } catch (error) {
    console.error("Get track assessment error:", error);
    return responseObject({
      res,
      statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
      message: "Failed to fetch assessment",
    });
  }
};
