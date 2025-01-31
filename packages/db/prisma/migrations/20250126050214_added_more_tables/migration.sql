-- CreateTable
CREATE TABLE "MovieAvailabilities" (
    "id" TEXT NOT NULL,
    "movieId" TEXT NOT NULL,

    CONSTRAINT "MovieAvailabilities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "City" (
    "id" TEXT NOT NULL,
    "availableId" TEXT NOT NULL,

    CONSTRAINT "City_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CinemaHalls" (
    "id" TEXT NOT NULL,
    "cityId" TEXT NOT NULL,

    CONSTRAINT "CinemaHalls_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "MovieAvailabilities" ADD CONSTRAINT "MovieAvailabilities_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "Movie"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "City" ADD CONSTRAINT "City_availableId_fkey" FOREIGN KEY ("availableId") REFERENCES "MovieAvailabilities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CinemaHalls" ADD CONSTRAINT "CinemaHalls_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "City"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
