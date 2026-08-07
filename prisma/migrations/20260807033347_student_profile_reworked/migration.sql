/*
  Warnings:

  - You are about to drop the column `age` on the `StudentProfile` table. All the data in the column will be lost.
  - You are about to drop the column `preferredMajors` on the `StudentProfile` table. All the data in the column will be lost.
  - Added the required column `dateOfBirth` to the `StudentProfile` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "StudentProfile" DROP COLUMN "age",
DROP COLUMN "preferredMajors",
ADD COLUMN     "dateOfBirth" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "intendedMajors" TEXT[],
ADD COLUMN     "phone" TEXT,
ALTER COLUMN "satScore" DROP NOT NULL,
ALTER COLUMN "actScore" DROP NOT NULL;
