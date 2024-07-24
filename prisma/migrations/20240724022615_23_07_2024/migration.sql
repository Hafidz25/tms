/*
  Warnings:

  - Added the required column `totalFee` to the `Payslips` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Payslips" ADD COLUMN     "totalFee" MONEY NOT NULL;
