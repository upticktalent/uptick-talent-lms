import { z } from "zod";

export const TrackEnum = z.enum([
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

export const ReferralSourceEnum = z.enum([
  "TWITTER",
  "LINKEDIN",
  "INSTAGRAM",
  "FACEBOOK",
  "FRIEND",
  "OTHER",
]);

export const ApplicationStatusEnum = z.enum([
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

export const FrontendToolEnum = z.enum(["REACT", "VUE", "ANGULAR", "SVELTE", "OTHER"]);
export const BackendToolEnum = z.enum(["NODE", "EXPRESS", "DJANGO", "FASTAPI", "LARAVEL", "OTHER"]);
export const MobileToolEnum = z.enum(["FLUTTER", "REACT_NATIVE", "KOTLIN", "SWIFT", "OTHER"]);

// Helper: convert empty string to null
const emptyToNull = (val: any) => (val === "" ? null : val);

export const createApplicationSchema = z.object({
  firstname: z.string().min(3).trim(),
  lastname: z.string().min(3).trim(),
  email: z.string().email(),
  phoneNumber: z
    .string()
    .min(7, "Phone number must be at least 7 digits")
    .regex(/^[0-9+\-()\s]+$/, "Invalid phone number format"),

  city: z.string().min(2, "City name must be at least 2 characters long").trim(),

  track: TrackEnum,

  // Tool arrays — default to empty
  frontendTools: z.array(FrontendToolEnum).default([]),
  backendTools: z.array(BackendToolEnum).default([]),
  mobileTools: z.array(MobileToolEnum).default([]),

  // Only show "Other" if "OTHER" is selected
  frontendToolsOther: z.array(z.string()).default([]),
  backendToolsOther: z.array(z.string()).default([]),
  mobileToolsOther: z.array(z.string()).default([]),

  referralSource: ReferralSourceEnum,
  referralSourceOther: z.array(z.string()).default([]),
  

  // Status is set by backend
  status: ApplicationStatusEnum.default("PENDING"),
});

