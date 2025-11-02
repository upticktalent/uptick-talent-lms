"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApplicationSchema = exports.MobileToolEnum = exports.BackendToolEnum = exports.FrontendToolEnum = exports.ApplicationStatusEnum = exports.ReferralSourceEnum = exports.TrackEnum = void 0;
const zod_1 = require("zod");
exports.TrackEnum = zod_1.z.enum([
    "FRONTEND",
    "BACKEND",
    "FULLSTACK_DEVELOPMENT",
    "MOBILE_DEVELOPMENT",
    "DATA_SCIENCE",
    "MACHINE_LEARNING",
    "DATA_ANALYSIS",
    "DATA_ENGINEERING",
    "UI_DESIGN",
    "UX_DESIGN",
    "GRAPHICS_DESIGN",
    "UX_RESEARCH",
    "PRODUCT_MARKETING_MANAGEMENT",
    "OPERATIONS",
    "SALES",
    "BUSINESS_DEVELOPMENT",
    "PROJECT_PRODUCT_MANAGEMENT",
]);
exports.ReferralSourceEnum = zod_1.z.enum([
    "TWITTER",
    "LINKEDIN",
    "INSTAGRAM",
    "FACEBOOK",
    "FRIEND",
    "OTHER",
]);
exports.ApplicationStatusEnum = zod_1.z.enum([
    "PENDING",
    "REVIEWED",
    "SHORTLISTED",
    "ASSESSMENT_SENT",
    "ASSESSMENT_SUBMITTED",
    "INTERVIEW_SCHEDULED",
    "INTERVIEW_PASSED",
    "REJECTED",
    "ACCEPTED",
]);
exports.FrontendToolEnum = zod_1.z.enum(["REACT", "VUE", "ANGULAR", "SVELTE", "OTHER"]);
exports.BackendToolEnum = zod_1.z.enum(["NODE", "EXPRESS", "DJANGO", "FASTAPI", "LARAVEL", "OTHER"]);
exports.MobileToolEnum = zod_1.z.enum(["FLUTTER", "REACT_NATIVE", "KOTLIN", "SWIFT", "OTHER"]);
// Helper: convert empty string to null
const emptyToNull = (val) => (val === "" ? null : val);
exports.createApplicationSchema = zod_1.z.object({
    firstName: zod_1.z.string().min(3).trim(),
    lastName: zod_1.z.string().min(3).trim(),
    email: zod_1.z.string().email(),
    phoneNumber: zod_1.z
        .string()
        .min(7, "Phone number must be at least 7 digits")
        .regex(/^[0-9+\-()\s]+$/, "Invalid phone number format"),
    city: zod_1.z.string().min(2, "City name must be at least 2 characters long").trim(),
    track: exports.TrackEnum,
    // Tool arrays — default to empty
    frontendTools: zod_1.z.array(exports.FrontendToolEnum).default([]),
    backendTools: zod_1.z.array(exports.BackendToolEnum).default([]),
    mobileTools: zod_1.z.array(exports.MobileToolEnum).default([]),
    // Only show "Other" if "OTHER" is selected
    frontendToolsOther: zod_1.z.array(zod_1.z.string()).default([]),
    backendToolsOther: zod_1.z.array(zod_1.z.string()).default([]),
    mobileToolsOther: zod_1.z.array(zod_1.z.string()).default([]),
    referralSource: exports.ReferralSourceEnum,
    referralSourceOther: zod_1.z.string().nullable().optional(),
    // Status is set by backend
    status: exports.ApplicationStatusEnum.default("PENDING"),
});
