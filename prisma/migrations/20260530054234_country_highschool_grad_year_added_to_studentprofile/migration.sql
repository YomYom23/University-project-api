/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `StudentProfile` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId]` on the table `UniversityProfile` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `country` to the `StudentProfile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `graduationYear` to the `StudentProfile` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "StudentProfile" ADD COLUMN     "country" TEXT NOT NULL,
ADD COLUMN     "graduationYear" TEXT NOT NULL,
ADD COLUMN     "highSchool" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "StudentProfile_userId_key" ON "StudentProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "UniversityProfile_userId_key" ON "UniversityProfile"("userId");
