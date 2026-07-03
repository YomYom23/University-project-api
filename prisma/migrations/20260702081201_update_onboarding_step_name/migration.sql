/*
  Warnings:

  - You are about to drop the column `onBoardingStep` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "onBoardingStep",
ADD COLUMN     "onboardingStep" INTEGER NOT NULL DEFAULT 0;
