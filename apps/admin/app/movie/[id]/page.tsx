"use client";
import axios from "axios";
import dotenv from "dotenv";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
dotenv.config();

interface MovieData {
  id: string,
  title: string,
  description: string,
  totalSeats: number,
  seatPrice: number,
  cinemahall: string,
  startTime: Date | null,
  imageUrl: string,
  banner: string
}

const GetMovieByItsId = () => {
  const [movie, setMovie] = useState<MovieData | null>(null)
  const { id } = useParams();

  useEffect(() => {
    getMovie()
  }, [])

  const getMovie = async () => {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/movie/${id}`);
    if (res.statusText === 'OK') {
      setMovie(res.data.movie)
    }
  }


  return (
    <>
      <div className="movie">
        <div>
          {movie ? (
            <>
              <div>
                <div className="image w-full h-[70vh] relative">
                  <Image
                    src={movie.banner}
                    alt={movie.title}

                    layout="fill"
                    objectFit="cover"
                    className="absolute top-0 left-0 opacity-80"
                  />
                  <div className="flex justify-evenly relative">
                    <div className="absolute top-0 left-0 w-[23vw] h-[70vh] z-10 overflow-hidden rounded-xl ">
                      <Image
                        src={movie.imageUrl}
                        alt={movie.title}
                        layout="fill"
                        objectFit="cover"
                        className="p-8"
                      />
                    </div>
                    <div className="book-ticket px-4 py-2 z-50 bg-[#88001b] text-white rounded hover:bg-[#cc0a0a] absolute mt-80 mr-30 p-8" >
                      <Link href={`/movie/${movie.id}/seats`}>
                        Book Tickets
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="m-4 ml-20 description">
                  <h1 className=" text-2xl font-bold m-4">
                    About the Movie
                  </h1>
                  <p > {movie.description} </p>

                </div>
              </div>

            </>
          ) : (
            "No movie found"
          )}

        </div>

      </div>
    </>
  )
}

export default GetMovieByItsId;