/*
  Warnings:

  - You are about to alter the column `regularFee` on the `Payslips` table. The data in that column could be lost. The data in that column will be cast from `Money` to `Decimal(65,30)`.
  - You are about to alter the column `transportFee` on the `Payslips` table. The data in that column could be lost. The data in that column will be cast from `Money` to `Decimal(65,30)`.
  - You are about to alter the column `thrFee` on the `Payslips` table. The data in that column could be lost. The data in that column will be cast from `Money` to `Decimal(65,30)`.
  - You are about to alter the column `otherFee` on the `Payslips` table. The data in that column could be lost. The data in that column will be cast from `Money` to `Decimal(65,30)`.
  - You are about to alter the column `totalFee` on the `Payslips` table. The data in that column could be lost. The data in that column will be cast from `Money` to `Decimal(65,30)`.

*/
-- AlterTable
ALTER TABLE "Payslips" ALTER COLUMN "regularFee" SET DATA TYPE DECIMAL(65,30),
ALTER COLUMN "transportFee" SET DATA TYPE DECIMAL(65,30),
ALTER COLUMN "thrFee" SET DATA TYPE DECIMAL(65,30),
ALTER COLUMN "otherFee" SET DATA TYPE DECIMAL(65,30),
ALTER COLUMN "totalFee" SET DATA TYPE DECIMAL(65,30);
