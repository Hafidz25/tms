-- DropForeignKey
ALTER TABLE "Payslips" DROP CONSTRAINT "Payslips_levelId_fkey";

-- DropForeignKey
ALTER TABLE "Payslips" DROP CONSTRAINT "Payslips_userId_fkey";

-- AddForeignKey
ALTER TABLE "Payslips" ADD CONSTRAINT "Payslips_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payslips" ADD CONSTRAINT "Payslips_levelId_fkey" FOREIGN KEY ("levelId") REFERENCES "LevelFee"("id") ON DELETE CASCADE ON UPDATE CASCADE;
