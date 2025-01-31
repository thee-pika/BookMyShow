/*
  Warnings:

  - You are about to drop the column `expires` on the `Payments` table. All the data in the column will be lost.
  - You are about to drop the column `movieId` on the `Payments` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Payments" DROP CONSTRAINT "Payments_movieId_fkey";

-- AlterTable
ALTER TABLE "Payments" DROP COLUMN "expires",
DROP COLUMN "movieId";
