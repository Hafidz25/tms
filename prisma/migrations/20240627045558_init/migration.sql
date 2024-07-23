/*
  Warnings:

  - You are about to drop the column `isPrivate` on the `Feedback` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Feedback" DROP COLUMN "isPrivate",
ADD COLUMN     "isReply" BOOLEAN NOT NULL DEFAULT false;
