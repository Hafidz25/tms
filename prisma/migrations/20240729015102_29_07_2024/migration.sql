-- AlterTable
ALTER TABLE "Payslips" ADD COLUMN     "levelId" TEXT;

-- CreateTable
CREATE TABLE "LevelFee" (
    "id" TEXT NOT NULL,
    "level" TEXT NOT NULL,
    "regularFee" DECIMAL(65,30) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LevelFee_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Payslips" ADD CONSTRAINT "Payslips_levelId_fkey" FOREIGN KEY ("levelId") REFERENCES "LevelFee"("id") ON DELETE SET NULL ON UPDATE CASCADE;
