/*
  Warnings:

  - Added the required column `genre` to the `Movie` table without a default value. This is not possible if the table is not empty.
  - Added the required column `language` to the `Movie` table without a default value. This is not possible if the table is not empty.
  - Added the required column `trailerId` to the `Movie` table without a default value. This is not possible if the table is not empty.
  - Added the required column `year` to the `Movie` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "LanguageType" AS ENUM ('Telugu', 'Hindi', 'English', 'Tamil', 'Malayalam');

-- CreateEnum
CREATE TYPE "GenreType" AS ENUM ('Action', 'Thriller', 'Horror');

-- AlterTable
ALTER TABLE "Movie" ADD COLUMN     "genre" "GenreType" NOT NULL,
ADD COLUMN     "language" "LanguageType" NOT NULL,
ADD COLUMN     "trailerId" TEXT NOT NULL,
ADD COLUMN     "year" INTEGER NOT NULL;
