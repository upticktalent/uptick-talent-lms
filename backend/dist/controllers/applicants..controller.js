"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllApplicants = exports.createApplicant = void 0;
const client_1 = require("@prisma/client");
const applicants_1 = require("../utils/applicants");
const email_1 = require("../utils/email");
const utils_1 = require("../utils");
const config_1 = require("../config");
const logger_1 = require("../config/logger");
const prisma = new client_1.PrismaClient();
const createApplicant = async (req, res, next) => {
    try {
        logger_1.Logger.log("RAW BODY:", req.body);
        const parsed = applicants_1.createApplicationSchema.safeParse(req.body);
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
        const { firstName, lastName, email, phoneNumber, city, state, country, dateOfBirth, track, frontendTools, backendTools, mobileTools, frontendToolsOther, backendToolsOther, mobileToolsOther, referralSource, referralSourceOther, status, } = parsed.data;
        const newApplicant = await prisma.applicant.create({
            data: {
                firstname: firstName,
                lastname: lastName,
                email,
                phoneNumber,
                city,
                track,
                frontendTools: frontendTools?.[0] ?? null,
                backendTools: backendTools?.[0] ?? null,
                mobileTools: mobileTools?.[0] ?? null,
                frontendToolsOther,
                backendToolsOther,
                mobileToolsOther,
                referralSource,
                referralSourceOther: referralSourceOther?.[0] ?? null,
                applicationStatus: status,
            },
            include: { assessment: true },
        });
        const emailSent = await (0, email_1.sendApplicationEmail)(email, `${firstName} ${lastName}`);
        logger_1.Logger.log(emailSent ? "Email Sent!" : "Email failed");
        return (0, utils_1.responseObject)({
            res,
            status: true,
            statusCode: config_1.HttpStatusCode.CREATED,
            message: "Applicant created!",
            payload: newApplicant,
        });
    }
    catch (error) {
        if (error.code === "P2002") {
            return (0, utils_1.responseObject)({
                res,
                status: false,
                statusCode: config_1.HttpStatusCode.CONFLICT,
                message: "Email or phone already exists",
            });
        }
        next(error);
    }
};
exports.createApplicant = createApplicant;
const getAllApplicants = async (req, res, next) => {
    try {
        const applicants = await prisma.applicant.findMany({
            where: { applicationStatus: "PENDING" },
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
        return (0, utils_1.responseObject)({
            res,
            statusCode: config_1.HttpStatusCode.OK,
            status: true,
            payload: {
                data: applicants,
                count: applicants.length,
            },
            message: "All Applicants",
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getAllApplicants = getAllApplicants;
