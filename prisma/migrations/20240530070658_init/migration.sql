-- CreateTable
CREATE TABLE "BriefNotification" (
    "id" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "userId" TEXT,
    "briefId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BriefNotification_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "BriefNotification" ADD CONSTRAINT "BriefNotification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BriefNotification" ADD CONSTRAINT "BriefNotification_briefId_fkey" FOREIGN KEY ("briefId") REFERENCES "Brief"("id") ON DELETE SET NULL ON UPDATE CASCADE;
