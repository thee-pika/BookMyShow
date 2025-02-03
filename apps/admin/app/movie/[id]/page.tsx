"use client";
import axios from "axios";
import dotenv from "dotenv";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
dotenv.config();

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

const GetMovieByItsId = () => {
  const [movie, setMovie] = useState<MovieData | null>(null);
  const { id } = useParams();

  useEffect(() => {
    getMovie();
  }, []);

  const getMovie = async () => {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/movie/${id}`
    );
    if (res.statusText === "OK") {
      setMovie(res.data.movie);
    }
  };

  return (
    <div className="movie bg-black text-white min-h-screen relative">
      {movie ? (
        <>
          {/* Background Banner */}
          <div className="absolute inset-0">
            <Image
              src={movie.banner}
              alt={`${movie.title} Banner`}
              layout="fill"
              objectFit="cover"
              className="opacity-40"
            />
          </div>
          {/* Main Content */}
          <div className="relative z-10 flex flex-wrap items-center justify-center gap-8 p-8">
            {/* Left: Poster */}
            <div className="w-full md:w-[30%] flex flex-col lg:w-[25%] h-[50vh] overflow-hidden rounded-xl shadow-lg">
              <Image
                src={movie.imageUrl}
                alt={`${movie.title} Poster`}
                width={250}
                height={350}
                objectFit="cover"
              />
            </div>

            <div className="w-full flex flex-col mt-24 md:w-[65%] lg:w-[70%] space-y-6">
              <h1 className="text-4xl font-bold">{movie.title}</h1>
              <p className="text-blue-500 font-bold text-lg">BlockBuster</p>
              <div className="flex font-bold">
                <p className="text-lg ">
                {movie.language}
                </p>
                <p className="text-gray-400 ml-2 mr-2">|</p>
                <p className="text-lg">
              {movie.year}
                </p>
                <p className="text-gray-400 ml-2 mr-2">|</p>
                <p className="text-lg">
             {movie.genre}
              </p>
              </div>
           
              <p className="text-base text-gray-300 w-[30vw]">{movie.description}</p>
              <div>
                <Link href={`/movie/${movie.id}/seats`}>
                  <button className="px-20 mt-20 py-3 bg-[#F84464] hover:bg-[#cc0a0a] text-white font-semibold rounded-lg">
                    Book Tickets
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="flex items-center justify-center h-screen">
          <p>No movie found</p>
        </div>
      )}
    </div>
  );
};

export default GetMovieByItsId;
