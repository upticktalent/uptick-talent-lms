-- CreateTable
CREATE TABLE "track_assessments" (
    "id" TEXT NOT NULL,
    "track" "Track" NOT NULL,
    "title" TEXT NOT NULL,
    "instructions" TEXT NOT NULL,
    "submissionLink" TEXT,
    "dueDate" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" TEXT NOT NULL,

    CONSTRAINT "track_assessments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "track_assessments_track_key" ON "track_assessments"("track");

-- CreateIndex
CREATE UNIQUE INDEX "track_assessments_createdById_key" ON "track_assessments"("createdById");

-- AddForeignKey
ALTER TABLE "track_assessments" ADD CONSTRAINT "track_assessments_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
