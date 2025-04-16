/*
  Warnings:

  - Added the required column `updatedAt` to the `BlogComment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `BlogPost` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "BlogComment" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "BlogPost" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
