import { Request, Response, NextFunction } from "express";
import { PrismaClient, Prisma } from "@prisma/client";
import { createApplicationSchema } from "../utils/applicants";

const prisma = new PrismaClient();

export const createApplicant = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const parsed = createApplicationSchema.safeParse(req.body);
    if (!parsed.success) {
      const errors = parsed.error.issues.map((issue) => ({
        field: issue.path.join("."),
        msg: issue.message,
      }));
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors,
      });
    }

    const data = parsed.data;
    const newApplicant = await prisma.application.create({ data });
    return res.status(201).json({
      success: true,
      message: "Applicant created successfully",
      data: newApplicant,
    });
  } catch (error: any) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        const target = error.meta?.target as string[];

        const fieldErrors: { field: string; message: string }[] = target.map(
          (field) => {
            let message = "";

            switch (field) {
              case "email":
                message = "This email is already registered";
                break;
              case "phoneNumber":
                message = "This phone number is already in use";
                break;
              default:
                message = `Duplicate value for ${field}`;
            }

            return { field, message };
          }
        );

        return res.status(409).json({
          success: false,
          message: "Duplicate field error",
          errors: fieldErrors,
        });
      }
    }
    next(error);
  }
};
