-- CreateTable
CREATE TABLE "Payslips" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "period" JSONB NOT NULL,
    "regularFee" MONEY NOT NULL,
    "presence" DECIMAL(65,30) NOT NULL,
    "transportFee" MONEY NOT NULL,
    "thrFee" MONEY NOT NULL,
    "otherFee" MONEY NOT NULL,
    "userId" TEXT,

    CONSTRAINT "Payslips_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Payslips" ADD CONSTRAINT "Payslips_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
