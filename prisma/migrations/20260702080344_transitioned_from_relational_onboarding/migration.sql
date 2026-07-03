/*
  Warnings:

  - You are about to drop the `UserOnboarding` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "UserOnboarding" DROP CONSTRAINT "UserOnboarding_userId_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isOnboarding" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "onBoardingStep" INTEGER NOT NULL DEFAULT 0;

-- DropTable
DROP TABLE "UserOnboarding";
