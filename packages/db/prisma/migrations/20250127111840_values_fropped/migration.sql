/*
  Warnings:

  - You are about to drop the column `cinemahalls` on the `Movie` table. All the data in the column will be lost.
  - Added the required column `cinemahall` to the `Movie` table without a default value. This is not possible if the table is not empty.
  - Added the required column `seatPrice` to the `Movie` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Movie" DROP COLUMN "cinemahalls",
ADD COLUMN     "cinemahall" TEXT NOT NULL,
ADD COLUMN     "seatPrice" INTEGER NOT NULL;
