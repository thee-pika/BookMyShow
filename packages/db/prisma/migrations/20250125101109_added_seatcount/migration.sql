/*
  Warnings:

  - Added the required column `totalSeats` to the `Movie` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "totalSeats" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Movie" ADD COLUMN     "totalSeats" INTEGER NOT NULL;
