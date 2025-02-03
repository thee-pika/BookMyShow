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

  const handleDelete = async (event: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    const permision = window.confirm("Are you sure! You want to delete??");
    console.log("permission", permision);
    if (permision) {
      const res = await axios.delete(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/movie/${id}`, {
        withCredentials: true
      }
      )
      console.log("res", res);
      if (res.status === 200) {
        alert("Movie deleted successfully");
      }
    }
  }

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
          <div className="relative z-10 flex flex-wrap items-center  gap-8 p-8">

            <div className="w-full md:w-[30%] flex flex-col items-center lg:w-[25%] h-[50vh] overflow-hidden rounded-xl shadow-lg">
              <Image
                src={movie.imageUrl}
                alt={`${movie.title} Poster`}
                width={250}
                height={350}
                objectFit="cover"
              />
            </div>

            <div className="w-full flex flex-col mt-24 md:w-[55%] lg:w-[60%] pl-12 space-y-6">
              <div className="flex">
                <h1 className="text-4xl font-bold">{movie.title}
                </h1>

              </div>
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

            <div className="flex pb-108">
              <span >
                <Link href={`/movie/${movie.id}/edit`}>
                <Image
                  src={"/assets/edit-svgrepo-com.svg"} alt={""} width={30} height={30} className="m-2" />
                </Link>
              </span>
              <span onClick={handleDelete}>
                <Image
                  src={'/assets/delete-2-svgrepo-com.svg'}
                  alt={""}
                  width={30}
                  height={30}
                  className="m-2"
                />
              </span>
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
