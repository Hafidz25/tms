/*
  Warnings:

  - Added the required column `position` to the `Payslips` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Payslips" ADD COLUMN     "position" TEXT NOT NULL;
