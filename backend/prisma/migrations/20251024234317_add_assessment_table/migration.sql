/*
  Warnings:

  - You are about to drop the column `fullstackToolsOther` on the `Applicant` table. All the data in the column will be lost.
  - You are about to drop the column `stack` on the `Applicant` table. All the data in the column will be lost.
  - The `frontendTools` column on the `Applicant` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `frontendToolsOther` column on the `Applicant` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `backendTools` column on the `Applicant` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `backendToolsOther` column on the `Applicant` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `fullstackTools` column on the `Applicant` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `mobileTools` column on the `Applicant` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `mobileToolsOther` column on the `Applicant` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `applicationId` on the `Interview` table. All the data in the column will be lost.
  - You are about to drop the `adminProfile` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `mentorProfile` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `studentProfile` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[applicantId]` on the table `Interview` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `referralSource` on the `Applicant` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `applicantId` to the `Interview` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ReferralSource" AS ENUM ('TWITTER', 'LINKEDIN', 'INSTAGRAM', 'FACEBOOK', 'FRIEND', 'OTHER');

-- CreateEnum
CREATE TYPE "FrontendTool" AS ENUM ('REACT', 'VUE', 'ANGULAR', 'SVELTE', 'OTHER');

-- CreateEnum
CREATE TYPE "BackendTool" AS ENUM ('NODE', 'EXPRESS', 'DJANGO', 'FASTAPI', 'LARAVEL', 'OTHER');

-- CreateEnum
CREATE TYPE "MobileTool" AS ENUM ('FLUTTER', 'REACT_NATIVE', 'KOTLIN', 'SWIFT', 'OTHER');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "Track" ADD VALUE 'DATA_SCIENCE';
ALTER TYPE "Track" ADD VALUE 'MACHINE_LEARNING';
ALTER TYPE "Track" ADD VALUE 'DATA_ANALYSIS';
ALTER TYPE "Track" ADD VALUE 'DATA_ENGINEERING';
ALTER TYPE "Track" ADD VALUE 'UI_DESIGN';
ALTER TYPE "Track" ADD VALUE 'UX_DESIGN';
ALTER TYPE "Track" ADD VALUE 'GRAPHICS_DESIGN';
ALTER TYPE "Track" ADD VALUE 'UX_RESEARCH';
ALTER TYPE "Track" ADD VALUE 'PRODUCT_MARKETING_MANAGEMENT';
ALTER TYPE "Track" ADD VALUE 'OPERATIONS';
ALTER TYPE "Track" ADD VALUE 'SALES';
ALTER TYPE "Track" ADD VALUE 'BUSINESS_DEVELOPMENT';
ALTER TYPE "Track" ADD VALUE 'PROJECT_PRODUCT_MANAGEMENT';

-- DropForeignKey
ALTER TABLE "public"."Interview" DROP CONSTRAINT "Interview_applicationId_fkey";

-- DropForeignKey
ALTER TABLE "public"."adminProfile" DROP CONSTRAINT "adminProfile_adminId_fkey";

-- DropForeignKey
ALTER TABLE "public"."mentorProfile" DROP CONSTRAINT "mentorProfile_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."studentProfile" DROP CONSTRAINT "studentProfile_userId_fkey";

-- DropIndex
DROP INDEX "public"."Interview_applicationId_key";

-- AlterTable
ALTER TABLE "Applicant" DROP COLUMN "fullstackToolsOther",
DROP COLUMN "stack",
ADD COLUMN     "applicationStatus" "ApplicationStatus" NOT NULL DEFAULT 'PENDING',
DROP COLUMN "frontendTools",
ADD COLUMN     "frontendTools" "FrontendTool",
DROP COLUMN "frontendToolsOther",
ADD COLUMN     "frontendToolsOther" TEXT[] DEFAULT ARRAY[]::TEXT[],
DROP COLUMN "backendTools",
ADD COLUMN     "backendTools" "BackendTool",
DROP COLUMN "backendToolsOther",
ADD COLUMN     "backendToolsOther" TEXT[] DEFAULT ARRAY[]::TEXT[],
DROP COLUMN "fullstackTools",
ADD COLUMN     "fullstackTools" TEXT[] DEFAULT ARRAY[]::TEXT[],
DROP COLUMN "mobileTools",
ADD COLUMN     "mobileTools" "MobileTool",
DROP COLUMN "mobileToolsOther",
ADD COLUMN     "mobileToolsOther" TEXT[] DEFAULT ARRAY[]::TEXT[],
DROP COLUMN "referralSource",
ADD COLUMN     "referralSource" "ReferralSource" NOT NULL,
ALTER COLUMN "referralSourceOther" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Interview" DROP COLUMN "applicationId",
ADD COLUMN     "applicantId" TEXT NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'SHORTLISTED';

-- DropTable
DROP TABLE "public"."adminProfile";

-- DropTable
DROP TABLE "public"."mentorProfile";

-- DropTable
DROP TABLE "public"."studentProfile";

-- CreateTable
CREATE TABLE "Assessment" (
    "id" TEXT NOT NULL,
    "applicantId" TEXT NOT NULL,
    "assessmentLink" TEXT,
    "submissionLink" TEXT,
    "sentAt" TIMESTAMP(3),
    "submittedAt" TIMESTAMP(3),
    "reviewedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Assessment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdminProfile" (
    "id" TEXT NOT NULL,
    "adminId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'ADMIN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AdminProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudentProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StudentProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MentorProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "MentorProfile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Assessment_applicantId_key" ON "Assessment"("applicantId");

-- CreateIndex
CREATE UNIQUE INDEX "AdminProfile_adminId_key" ON "AdminProfile"("adminId");

-- CreateIndex
CREATE UNIQUE INDEX "AdminProfile_email_key" ON "AdminProfile"("email");

-- CreateIndex
CREATE UNIQUE INDEX "StudentProfile_userId_key" ON "StudentProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "StudentProfile_email_key" ON "StudentProfile"("email");

-- CreateIndex
CREATE UNIQUE INDEX "MentorProfile_userId_key" ON "MentorProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Interview_applicantId_key" ON "Interview"("applicantId");

-- AddForeignKey
ALTER TABLE "Assessment" ADD CONSTRAINT "Assessment_applicantId_fkey" FOREIGN KEY ("applicantId") REFERENCES "Applicant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Interview" ADD CONSTRAINT "Interview_applicantId_fkey" FOREIGN KEY ("applicantId") REFERENCES "Applicant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdminProfile" ADD CONSTRAINT "AdminProfile_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentProfile" ADD CONSTRAINT "StudentProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MentorProfile" ADD CONSTRAINT "MentorProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
