/*
  Warnings:

  - You are about to drop the `_BriefToUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_BriefToUser" DROP CONSTRAINT "_BriefToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_BriefToUser" DROP CONSTRAINT "_BriefToUser_B_fkey";

-- AlterTable
ALTER TABLE "Brief" ADD COLUMN     "userId" TEXT;

-- DropTable
DROP TABLE "_BriefToUser";

-- AddForeignKey
ALTER TABLE "Brief" ADD CONSTRAINT "Brief_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
