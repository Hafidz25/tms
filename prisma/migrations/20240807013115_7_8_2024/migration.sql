/*
  Warnings:

  - You are about to drop the column `levelId` on the `Payslips` table. All the data in the column will be lost.
  - You are about to drop the column `otherFee` on the `Payslips` table. All the data in the column will be lost.
  - You are about to drop the column `position` on the `Payslips` table. All the data in the column will be lost.
  - You are about to drop the column `thrFee` on the `Payslips` table. All the data in the column will be lost.
  - You are about to drop the `LevelFee` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `additionalFee` to the `Payslips` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Payslips" DROP CONSTRAINT "Payslips_levelId_fkey";

-- AlterTable
ALTER TABLE "Payslips" DROP COLUMN "levelId",
DROP COLUMN "otherFee",
DROP COLUMN "position",
DROP COLUMN "thrFee",
ADD COLUMN     "additionalFee" JSONB NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "levelId" TEXT,
ADD COLUMN     "roleMemberId" TEXT;

-- DropTable
DROP TABLE "LevelFee";

-- CreateTable
CREATE TABLE "RoleMember" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RoleMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Level" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "fee" DECIMAL(65,30) NOT NULL,
    "roleId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Level_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_roleMemberId_fkey" FOREIGN KEY ("roleMemberId") REFERENCES "RoleMember"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_levelId_fkey" FOREIGN KEY ("levelId") REFERENCES "Level"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Level" ADD CONSTRAINT "Level_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "RoleMember"("id") ON DELETE CASCADE ON UPDATE CASCADE;
