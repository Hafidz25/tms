/*
  Warnings:

  - You are about to drop the column `description` on the `Brief` table. All the data in the column will be lost.
  - Added the required column `content` to the `Brief` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `deadline` on the `Brief` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Brief" DROP COLUMN "description",
ADD COLUMN     "content" TEXT NOT NULL,
DROP COLUMN "deadline",
ADD COLUMN     "deadline" JSONB NOT NULL;
