/*
  Warnings:

  - You are about to drop the column `userId` on the `Brief` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Brief" DROP CONSTRAINT "Brief_userId_fkey";

-- AlterTable
ALTER TABLE "Brief" DROP COLUMN "userId";

-- CreateTable
CREATE TABLE "_BriefToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_BriefToUser_AB_unique" ON "_BriefToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_BriefToUser_B_index" ON "_BriefToUser"("B");

-- AddForeignKey
ALTER TABLE "_BriefToUser" ADD CONSTRAINT "_BriefToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Brief"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BriefToUser" ADD CONSTRAINT "_BriefToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
