/*
  Warnings:

  - You are about to drop the column `budgetMax` on the `StudentProfile` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "StudentProfile" DROP COLUMN "budgetMax",
ADD COLUMN     "budgetRange" INTEGER[];
