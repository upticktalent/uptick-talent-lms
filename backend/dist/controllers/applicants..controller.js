"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApplicant = void 0;
const client_1 = require("@prisma/client");
const applicants_1 = require("../utils/applicants");
const prisma = new client_1.PrismaClient();
const createApplicant = async (req, res, next) => {
    try {
        const parsed = applicants_1.createApplicationSchema.safeParse(req.body);
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
    }
    catch (error) {
        if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
            if (error.code === "P2002") {
                const target = error.meta?.target;
                const fieldErrors = target.map((field) => {
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
                });
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
exports.createApplicant = createApplicant;
