-- CreateEnum
CREATE TYPE "YearsOfExperience" AS ENUM ('ZERO', 'ONE', 'TWO', 'THREE', 'MORE');

-- CreateEnum
CREATE TYPE "TimeCommitment" AS ENUM ('YES_40_HRS', 'NO');

-- AlterTable
ALTER TABLE "Applicant" ADD COLUMN     "careerGoals" TEXT,
ADD COLUMN     "githubUrl" TEXT,
ADD COLUMN     "portfolio" TEXT,
ADD COLUMN     "timeCommitment" "TimeCommitment" NOT NULL DEFAULT 'YES_40_HRS',
ADD COLUMN     "timeCommitmentReason" TEXT,
ADD COLUMN     "yearsOfExperience" "YearsOfExperience" NOT NULL DEFAULT 'ONE';
