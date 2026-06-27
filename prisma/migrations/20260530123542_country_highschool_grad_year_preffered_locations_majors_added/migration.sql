/*
  Warnings:

  - You are about to drop the column `name` on the `UniversityProfile` table. All the data in the column will be lost.
  - You are about to drop the column `firstName` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `lastName` on the `user` table. All the data in the column will be lost.
  - Added the required column `age` to the `StudentProfile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `firstName` to the `StudentProfile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `StudentProfile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `universityName` to the `UniversityProfile` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "StudentProfile" ADD COLUMN     "age" TEXT NOT NULL,
ADD COLUMN     "firstName" TEXT NOT NULL,
ADD COLUMN     "lastName" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "UniversityProfile" DROP COLUMN "name",
ADD COLUMN     "universityName" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "firstName",
DROP COLUMN "lastName";
