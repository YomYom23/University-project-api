/*
  Warnings:

  - Added the required column `major` to the `StudentProfile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `size` to the `StudentProfile` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "CampusSize" AS ENUM ('SMALL', 'MEDIUM', 'LARGE');

-- AlterTable
ALTER TABLE "StudentProfile" ADD COLUMN     "campusVibes" TEXT[],
ADD COLUMN     "classRank" TEXT,
ADD COLUMN     "extracurriculars" TEXT[],
ADD COLUMN     "major" TEXT NOT NULL,
ADD COLUMN     "priority" TEXT,
ADD COLUMN     "size" "CampusSize" NOT NULL;
