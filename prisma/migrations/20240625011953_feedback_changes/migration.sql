-- AlterTable
ALTER TABLE "Feedback" ADD COLUMN     "private" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "userSentId" TEXT;

-- AddForeignKey
ALTER TABLE "Feedback" ADD CONSTRAINT "Feedback_userSentId_fkey" FOREIGN KEY ("userSentId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
