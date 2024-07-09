/*
  Warnings:

  - Added the required column `visibility` to the `Brief` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Brief" ADD COLUMN     "visibility" TEXT NOT NULL;
