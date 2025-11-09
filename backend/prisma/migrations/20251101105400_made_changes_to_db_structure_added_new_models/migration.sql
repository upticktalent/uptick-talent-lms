/*
  Warnings:

  - You are about to drop the column `adminId` on the `AdminProfile` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `AdminProfile` table. All the data in the column will be lost.
  - You are about to drop the column `firstName` on the `AdminProfile` table. All the data in the column will be lost.
  - You are about to drop the column `lastName` on the `AdminProfile` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `AdminProfile` table. All the data in the column will be lost.
  - You are about to drop the column `applicantId` on the `Assessment` table. All the data in the column will be lost.
  - You are about to drop the column `applicantId` on the `Interview` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `StudentProfile` table. All the data in the column will be lost.
  - You are about to drop the column `firstName` on the `StudentProfile` table. All the data in the column will be lost.
  - You are about to drop the column `lastName` on the `StudentProfile` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Applicant` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[userId]` on the table `AdminProfile` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `AdminProfile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `AdminProfile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `applicationId` to the `Assessment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `applicationId` to the `Interview` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `MentorProfile` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."AdminProfile" DROP CONSTRAINT "AdminProfile_adminId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Assessment" DROP CONSTRAINT "Assessment_applicantId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Interview" DROP CONSTRAINT "Interview_applicantId_fkey";

-- DropIndex
DROP INDEX "public"."AdminProfile_adminId_key";

-- DropIndex
DROP INDEX "public"."AdminProfile_email_key";

-- DropIndex
DROP INDEX "public"."Assessment_applicantId_key";

-- DropIndex
DROP INDEX "public"."Interview_applicantId_key";

-- DropIndex
DROP INDEX "public"."StudentProfile_email_key";

-- AlterTable
ALTER TABLE "AdminProfile" DROP COLUMN "adminId",
DROP COLUMN "email",
DROP COLUMN "firstName",
DROP COLUMN "lastName",
DROP COLUMN "role",
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Assessment" DROP COLUMN "applicantId",
ADD COLUMN     "applicationId" TEXT NOT NULL,
ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Interview" DROP COLUMN "applicantId",
ADD COLUMN     "applicationId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "MentorProfile" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "StudentProfile" DROP COLUMN "email",
DROP COLUMN "firstName",
DROP COLUMN "lastName",
ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "role",
ALTER COLUMN "updatedAt" DROP DEFAULT;

-- DropTable
DROP TABLE "public"."Applicant";

-- DropEnum
DROP TYPE "public"."Role";

-- CreateTable
CREATE TABLE "TrackOption" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TrackOption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReferralSourceOption" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ReferralSourceOption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FrontendToolOption" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FrontendToolOption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BackendToolOption" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BackendToolOption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MobileToolOption" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MobileToolOption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Role" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Application" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "track" "Track" NOT NULL,
    "referralSource" "ReferralSource" NOT NULL,
    "frontendTools" "FrontendTool"[] DEFAULT ARRAY[]::"FrontendTool"[],
    "backendTools" "BackendTool"[] DEFAULT ARRAY[]::"BackendTool"[],
    "mobileTools" "MobileTool"[] DEFAULT ARRAY[]::"MobileTool"[],
    "fullstackToolsOther" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "referralSourceOther" TEXT,
    "status" "ApplicationStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Application_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserRole" (
    "userId" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,

    CONSTRAINT "UserRole_pkey" PRIMARY KEY ("userId","roleId")
);

-- CreateIndex
CREATE UNIQUE INDEX "TrackOption_name_key" ON "TrackOption"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ReferralSourceOption_name_key" ON "ReferralSourceOption"("name");

-- CreateIndex
CREATE UNIQUE INDEX "FrontendToolOption_name_key" ON "FrontendToolOption"("name");

-- CreateIndex
CREATE UNIQUE INDEX "BackendToolOption_name_key" ON "BackendToolOption"("name");

-- CreateIndex
CREATE UNIQUE INDEX "MobileToolOption_name_key" ON "MobileToolOption"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Role_name_key" ON "Role"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Application_userId_key" ON "Application"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Application_phoneNumber_key" ON "Application"("phoneNumber");

-- CreateIndex
CREATE UNIQUE INDEX "AdminProfile_userId_key" ON "AdminProfile"("userId");

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRole" ADD CONSTRAINT "UserRole_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRole" ADD CONSTRAINT "UserRole_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Assessment" ADD CONSTRAINT "Assessment_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Interview" ADD CONSTRAINT "Interview_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdminProfile" ADD CONSTRAINT "AdminProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
