/*
  Warnings:

  - You are about to drop the column `userId` on the `BriefNotification` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "BriefNotification" DROP CONSTRAINT "BriefNotification_userId_fkey";

-- AlterTable
ALTER TABLE "BriefNotification" DROP COLUMN "userId";

-- CreateTable
CREATE TABLE "_BriefNotificationToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_BriefNotificationToUser_AB_unique" ON "_BriefNotificationToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_BriefNotificationToUser_B_index" ON "_BriefNotificationToUser"("B");

-- AddForeignKey
ALTER TABLE "_BriefNotificationToUser" ADD CONSTRAINT "_BriefNotificationToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "BriefNotification"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BriefNotificationToUser" ADD CONSTRAINT "_BriefNotificationToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
