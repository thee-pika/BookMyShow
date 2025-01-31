/*
  Warnings:

  - You are about to drop the `CinemaHalls` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `City` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MovieAvailabilities` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `banner` to the `Movie` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cinemahalls` to the `Movie` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "CinemaHalls" DROP CONSTRAINT "CinemaHalls_cityId_fkey";

-- DropForeignKey
ALTER TABLE "City" DROP CONSTRAINT "City_availableId_fkey";

-- DropForeignKey
ALTER TABLE "MovieAvailabilities" DROP CONSTRAINT "MovieAvailabilities_movieId_fkey";

-- AlterTable
ALTER TABLE "Movie" ADD COLUMN     "banner" TEXT NOT NULL,
ADD COLUMN     "cinemahalls" TEXT NOT NULL;

-- DropTable
DROP TABLE "CinemaHalls";

-- DropTable
DROP TABLE "City";

-- DropTable
DROP TABLE "MovieAvailabilities";
