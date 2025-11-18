-- AlterTable
ALTER TABLE "Assessment" ADD COLUMN     "dueDate" TIMESTAMP(3),
ADD COLUMN     "explanation" TEXT,
ADD COLUMN     "feedback" TEXT,
ADD COLUMN     "fileUrl" TEXT,
ADD COLUMN     "instructions" TEXT,
ADD COLUMN     "liveDemoUrl" TEXT,
ADD COLUMN     "reviewedById" TEXT;

-- CreateIndex
CREATE INDEX "Assessment_submittedAt_idx" ON "Assessment"("submittedAt");

-- CreateIndex
CREATE INDEX "Assessment_reviewedAt_idx" ON "Assessment"("reviewedAt");

-- AddForeignKey
ALTER TABLE "Assessment" ADD CONSTRAINT "Assessment_reviewedById_fkey" FOREIGN KEY ("reviewedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
