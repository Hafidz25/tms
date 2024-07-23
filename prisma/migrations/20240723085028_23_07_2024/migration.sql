-- DropForeignKey
ALTER TABLE "Brief" DROP CONSTRAINT "Brief_authorId_fkey";

-- DropForeignKey
ALTER TABLE "BriefNotification" DROP CONSTRAINT "BriefNotification_briefId_fkey";

-- DropForeignKey
ALTER TABLE "Feedback" DROP CONSTRAINT "Feedback_briefId_fkey";

-- AddForeignKey
ALTER TABLE "Brief" ADD CONSTRAINT "Brief_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Feedback" ADD CONSTRAINT "Feedback_briefId_fkey" FOREIGN KEY ("briefId") REFERENCES "Brief"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BriefNotification" ADD CONSTRAINT "BriefNotification_briefId_fkey" FOREIGN KEY ("briefId") REFERENCES "Brief"("id") ON DELETE CASCADE ON UPDATE CASCADE;
