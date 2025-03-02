
import * as React from "react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import Link from "next/link"
import { useEffect, useState } from "react"
import axios from "axios"

interface MovieData {
  id: string;
  title: string;
  description: string;
  totalSeats: number;
  seatPrice: number;
  cinemahall: string;
  startTime: Date | null;
  imageUrl: string;
  language: string;
  genre: string;
  year: string;
  banner: string;
  trailerId: string;
}

const SimilarMoviesSlider = ({ id }: { id: string }) => {

  const [similarMovies, setSimilarMovies] = useState<MovieData[] | null>(null);

  useEffect(() => {
    const getSimilarMovies = async () => {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/movie/${id}/similar`
      );
      if (res.statusText === "OK") {
        const fetchedSimilarMovieData = res.data.similarMovies;
        setSimilarMovies(fetchedSimilarMovieData);
      }
    };
    getSimilarMovies()
  }, [id])

  return (
    <>
     
      <h1 className="text-xl font-semibold text-center mb-4 hover:underline cursor-pointer">Similar Movies</h1>
      <div className="flex w-[80vw] sm:w-full  justify-center pl-12 sm:px-6 lg:px-8">
        <Carousel className="w-full max-w-7xl">
          <CarouselContent className="-ml-1">
            {similarMovies?.map((movie: MovieData, index: number) => (
              <CarouselItem
                key={index}
                className="pl-1 sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
              >
                <div className="p-2">
                  <Card className="rounded-lg shadow-md">
                    <CardContent className="flex aspect-square items-center justify-center p-4 sm:p-6">
                      <div className="relative w-full h-64 sm:h-[300px] lg:h-[400px] overflow-hidden rounded-lg">
                        <Link href={`/movie/${movie.id}`}>
                          <Image
                            src={movie.imageUrl}
                            alt={movie.title}
                            layout="fill"
                            className="object-cover transition-transform duration-300 hover:scale-110"
                          />
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </>
  )
}

export default SimilarMoviesSlider