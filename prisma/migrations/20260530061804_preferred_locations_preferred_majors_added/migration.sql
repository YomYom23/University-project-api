/*
  Warnings:

  - You are about to drop the column `intendedMajor` on the `StudentProfile` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "StudentProfile" DROP COLUMN "intendedMajor",
ADD COLUMN     "preferredLocations" TEXT[],
ADD COLUMN     "preferredMajors" TEXT[];
