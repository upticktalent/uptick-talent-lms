import { z } from "zod";
export declare const TrackEnum: z.ZodEnum<{
    FRONTEND: "FRONTEND";
    BACKEND: "BACKEND";
    FULLSTACK_DEVELOPMENT: "FULLSTACK_DEVELOPMENT";
    MOBILE_DEVELOPMENT: "MOBILE_DEVELOPMENT";
    DATA_SCIENCE: "DATA_SCIENCE";
    MACHINE_LEARNING: "MACHINE_LEARNING";
    DATA_ANALYSIS: "DATA_ANALYSIS";
    DATA_ENGINEERING: "DATA_ENGINEERING";
    UI_DESIGN: "UI_DESIGN";
    UX_DESIGN: "UX_DESIGN";
    GRAPHICS_DESIGN: "GRAPHICS_DESIGN";
    UX_RESEARCH: "UX_RESEARCH";
    PRODUCT_MARKETING_MANAGEMENT: "PRODUCT_MARKETING_MANAGEMENT";
    OPERATIONS: "OPERATIONS";
    SALES: "SALES";
    BUSINESS_DEVELOPMENT: "BUSINESS_DEVELOPMENT";
    PROJECT_PRODUCT_MANAGEMENT: "PROJECT_PRODUCT_MANAGEMENT";
}>;
export declare const ReferralSourceEnum: z.ZodEnum<{
    TWITTER: "TWITTER";
    LINKEDIN: "LINKEDIN";
    INSTAGRAM: "INSTAGRAM";
    FACEBOOK: "FACEBOOK";
    FRIEND: "FRIEND";
    OTHER: "OTHER";
}>;
export declare const ApplicationStatusEnum: z.ZodEnum<{
    PENDING: "PENDING";
    REVIEWED: "REVIEWED";
    SHORTLISTED: "SHORTLISTED";
    ASSESSMENT_SENT: "ASSESSMENT_SENT";
    ASSESSMENT_SUBMITTED: "ASSESSMENT_SUBMITTED";
    INTERVIEW_SCHEDULED: "INTERVIEW_SCHEDULED";
    INTERVIEW_PASSED: "INTERVIEW_PASSED";
    REJECTED: "REJECTED";
    ACCEPTED: "ACCEPTED";
}>;
export declare const FrontendToolEnum: z.ZodEnum<{
    OTHER: "OTHER";
    REACT: "REACT";
    VUE: "VUE";
    ANGULAR: "ANGULAR";
    SVELTE: "SVELTE";
}>;
export declare const BackendToolEnum: z.ZodEnum<{
    OTHER: "OTHER";
    NODE: "NODE";
    EXPRESS: "EXPRESS";
    DJANGO: "DJANGO";
    FASTAPI: "FASTAPI";
    LARAVEL: "LARAVEL";
}>;
export declare const MobileToolEnum: z.ZodEnum<{
    OTHER: "OTHER";
    FLUTTER: "FLUTTER";
    REACT_NATIVE: "REACT_NATIVE";
    KOTLIN: "KOTLIN";
    SWIFT: "SWIFT";
}>;
export declare const createApplicationSchema: z.ZodObject<{
    firstName: z.ZodString;
    lastName: z.ZodString;
    email: z.ZodString;
    phoneNumber: z.ZodString;
    city: z.ZodString;
    track: z.ZodEnum<{
        FRONTEND: "FRONTEND";
        BACKEND: "BACKEND";
        FULLSTACK_DEVELOPMENT: "FULLSTACK_DEVELOPMENT";
        MOBILE_DEVELOPMENT: "MOBILE_DEVELOPMENT";
        DATA_SCIENCE: "DATA_SCIENCE";
        MACHINE_LEARNING: "MACHINE_LEARNING";
        DATA_ANALYSIS: "DATA_ANALYSIS";
        DATA_ENGINEERING: "DATA_ENGINEERING";
        UI_DESIGN: "UI_DESIGN";
        UX_DESIGN: "UX_DESIGN";
        GRAPHICS_DESIGN: "GRAPHICS_DESIGN";
        UX_RESEARCH: "UX_RESEARCH";
        PRODUCT_MARKETING_MANAGEMENT: "PRODUCT_MARKETING_MANAGEMENT";
        OPERATIONS: "OPERATIONS";
        SALES: "SALES";
        BUSINESS_DEVELOPMENT: "BUSINESS_DEVELOPMENT";
        PROJECT_PRODUCT_MANAGEMENT: "PROJECT_PRODUCT_MANAGEMENT";
    }>;
    frontendTools: z.ZodDefault<z.ZodArray<z.ZodEnum<{
        OTHER: "OTHER";
        REACT: "REACT";
        VUE: "VUE";
        ANGULAR: "ANGULAR";
        SVELTE: "SVELTE";
    }>>>;
    backendTools: z.ZodDefault<z.ZodArray<z.ZodEnum<{
        OTHER: "OTHER";
        NODE: "NODE";
        EXPRESS: "EXPRESS";
        DJANGO: "DJANGO";
        FASTAPI: "FASTAPI";
        LARAVEL: "LARAVEL";
    }>>>;
    mobileTools: z.ZodDefault<z.ZodArray<z.ZodEnum<{
        OTHER: "OTHER";
        FLUTTER: "FLUTTER";
        REACT_NATIVE: "REACT_NATIVE";
        KOTLIN: "KOTLIN";
        SWIFT: "SWIFT";
    }>>>;
    frontendToolsOther: z.ZodDefault<z.ZodArray<z.ZodString>>;
    backendToolsOther: z.ZodDefault<z.ZodArray<z.ZodString>>;
    mobileToolsOther: z.ZodDefault<z.ZodArray<z.ZodString>>;
    referralSource: z.ZodEnum<{
        TWITTER: "TWITTER";
        LINKEDIN: "LINKEDIN";
        INSTAGRAM: "INSTAGRAM";
        FACEBOOK: "FACEBOOK";
        FRIEND: "FRIEND";
        OTHER: "OTHER";
    }>;
    referralSourceOther: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    status: z.ZodDefault<z.ZodEnum<{
        PENDING: "PENDING";
        REVIEWED: "REVIEWED";
        SHORTLISTED: "SHORTLISTED";
        ASSESSMENT_SENT: "ASSESSMENT_SENT";
        ASSESSMENT_SUBMITTED: "ASSESSMENT_SUBMITTED";
        INTERVIEW_SCHEDULED: "INTERVIEW_SCHEDULED";
        INTERVIEW_PASSED: "INTERVIEW_PASSED";
        REJECTED: "REJECTED";
        ACCEPTED: "ACCEPTED";
    }>>;
}, z.core.$strip>;
