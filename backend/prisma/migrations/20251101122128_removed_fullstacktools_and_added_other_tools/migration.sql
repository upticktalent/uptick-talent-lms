/*
  Warnings:

  - You are about to drop the column `fullstackToolsOther` on the `Application` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Application" DROP COLUMN "fullstackToolsOther",
ADD COLUMN     "backendToolsOther" TEXT,
ADD COLUMN     "frontendToolsOther" TEXT,
ADD COLUMN     "mobileToolsOther" TEXT;
