/*
  Warnings:

  - The `referralSourceOther` column on the `Application` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `backendToolsOther` column on the `Application` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `frontendToolsOther` column on the `Application` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `mobileToolsOther` column on the `Application` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Application" DROP COLUMN "referralSourceOther",
ADD COLUMN     "referralSourceOther" TEXT[] DEFAULT ARRAY[]::TEXT[],
DROP COLUMN "backendToolsOther",
ADD COLUMN     "backendToolsOther" TEXT[] DEFAULT ARRAY[]::TEXT[],
DROP COLUMN "frontendToolsOther",
ADD COLUMN     "frontendToolsOther" TEXT[] DEFAULT ARRAY[]::TEXT[],
DROP COLUMN "mobileToolsOther",
ADD COLUMN     "mobileToolsOther" TEXT[] DEFAULT ARRAY[]::TEXT[];
