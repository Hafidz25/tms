/*
  Warnings:

  - You are about to drop the `_BriefToUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_BriefToUser" DROP CONSTRAINT "_BriefToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_BriefToUser" DROP CONSTRAINT "_BriefToUser_B_fkey";

-- AlterTable
ALTER TABLE "Brief" ADD COLUMN     "authorId" TEXT;

-- DropTable
DROP TABLE "_BriefToUser";

-- CreateTable
CREATE TABLE "_assign" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_assign_AB_unique" ON "_assign"("A", "B");

-- CreateIndex
CREATE INDEX "_assign_B_index" ON "_assign"("B");

-- AddForeignKey
ALTER TABLE "Brief" ADD CONSTRAINT "Brief_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_assign" ADD CONSTRAINT "_assign_A_fkey" FOREIGN KEY ("A") REFERENCES "Brief"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_assign" ADD CONSTRAINT "_assign_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
