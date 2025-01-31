/*
  Warnings:

  - You are about to drop the column `seatType` on the `Seat` table. All the data in the column will be lost.
  - Added the required column `expires` to the `Payments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `orderId` to the `Payments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `orderId` to the `Seat` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `Seat` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "seatStatus" AS ENUM ('available', 'booked', 'pending');

-- AlterTable
ALTER TABLE "Payments" ADD COLUMN     "expires" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "orderId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Seat" DROP COLUMN "seatType",
ADD COLUMN     "orderId" TEXT NOT NULL,
ADD COLUMN     "status" "seatStatus" NOT NULL,
ALTER COLUMN "price" DROP NOT NULL;
