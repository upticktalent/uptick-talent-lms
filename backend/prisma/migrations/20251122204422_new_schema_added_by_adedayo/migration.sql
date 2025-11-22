-- CreateEnum
CREATE TYPE "MaterialType" AS ENUM ('LINK', 'VIDEO', 'DOCUMENT', 'PDF', 'IMAGE', 'TEXT', 'OTHER');

-- AlterTable
ALTER TABLE "course_materials" ADD COLUMN     "link" TEXT,
ADD COLUMN     "order" INTEGER DEFAULT 0,
ADD COLUMN     "type" "MaterialType" NOT NULL DEFAULT 'LINK';
