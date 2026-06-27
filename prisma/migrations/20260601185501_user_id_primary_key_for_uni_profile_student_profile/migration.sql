/*
  Warnings:

  - The primary key for the `StudentProfile` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `StudentProfile` table. All the data in the column will be lost.
  - The primary key for the `UniversityProfile` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `UniversityProfile` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "StudentProfile_userId_key";

-- DropIndex
DROP INDEX "UniversityProfile_userId_key";

-- AlterTable
ALTER TABLE "StudentProfile" DROP CONSTRAINT "StudentProfile_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "StudentProfile_pkey" PRIMARY KEY ("userId");

-- AlterTable
ALTER TABLE "UniversityProfile" DROP CONSTRAINT "UniversityProfile_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "UniversityProfile_pkey" PRIMARY KEY ("userId");
