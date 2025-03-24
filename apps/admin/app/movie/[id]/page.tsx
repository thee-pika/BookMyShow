"use client";
import axios from "axios";
import dotenv from "dotenv";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import toast, { Toaster } from 'react-hot-toast';
import { useEffect, useState } from "react";
import SimilarMoviesSlider from "../../components/similarMoviesSlider";
import ReviewComponent from "../../components/ReviewComponent";
import PropagateLoader from "react-spinners/PropagateLoader";
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
  const [role, setrole] = useState("");
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();
  const currentTime = new Date().toISOString();

  useEffect(() => {
    const data = sessionStorage.getItem("access_token");
  
    if (data) {
      const userDetails = JSON.parse(data);
      const token = userDetails.token;
      if (!token) {
        router.push("/auth/login");
      } else {
        setToken(token);
        setrole(userDetails.role);
      }
    } else {
      setrole("");
    }

  }, [router]);

  useEffect(() => {
    if (id) {
      const getMovie = async () => {
        try {
          const res = await axios.get(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/movie/${id}`
          );
          if (res.status === 200) {
            setMovie(res.data.movie);
          }
        } catch (error) {
         toast.error(`Error: ${error}`);
          setLoading(false);
        } finally {
          setLoading(false);
        }
      };
  
      getMovie();
    }
  }, [id]);

  if (loading) {
    return <div className="flex justify-center items-center h-[70vh]">
      <PropagateLoader />
    </div>
  }

  const handleDelete = async () => {
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

        toast.success("Movie deleted successfully");
        setTimeout(() => {
          router.push("/");
        }, 1000)
      }
    }
  }

  return (
    <>
      <div className="movie bg-black text-white min-h-screen relative flex flex-col">
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
            <div className="relative z-10 flex flex-wrap items-center gap-8 p-4 sm:p-8">
              <div className="w-full hidden sm:flex sm:w-[40%] lg:w-[22%] h-[40vh] sm:h-[60vh] rounded-xl shadow-lg overflow-hidden">
                <Image
                  src={movie.imageUrl}
                  alt={`${movie.title} Poster`}
                  width={250}
                  height={350}
                  objectFit="cover"
                  className="w-full h-full"
                />
              </div>
              <div className="w-full sm:w-[55%] lg:w-[60%] flex flex-col space-y-4 mt-28 ">
                <h1 className="text-2xl sm:text-4xl font-bold">{movie.title}</h1>
                <p className="text-blue-500 font-bold text-lg">BlockBuster</p>
                <div className="flex text-sm sm:text-lg font-bold">
                  <p>{movie.language}</p>
                  <span className="text-gray-400 mx-2">|</span>
                  <p>{movie.year}</p>
                  <span className="text-gray-400 mx-2">|</span>
                  <p>{movie.genre}</p>
                </div>
                <p className="text-sm sm:text-base text-gray-300">{movie.description}</p>
                <p className="text-sm sm:text-lg font-bold">
                  StartsAt:{" "}
                  {new Date(movie.startTime!).toLocaleString("en-Us", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
                <div>
                  <Link href={`/movie/${movie.id}/seats`}>
                    <button
                      className={`px-4 py-2 sm:px-8 sm:py-3 mt-6 rounded-lg font-semibold ${movie.startTime &&
                          new Date(movie.startTime).toISOString() > currentTime
                          ? "bg-red-600 hover:bg-red-500 text-white"
                          : "bg-gray-500 text-gray-300"
                        }`}
                      disabled={
                        !movie.startTime ||
                        new Date(movie.startTime).toISOString() <= currentTime
                      }
                    >
                      Book Tickets
                    </button>
                  </Link>
                </div>
              </div>
              {role === "admin" && (
                <div className="flex mt-4">
                  <Link href={`/movie/${movie.id}/edit`} className="mr-4">
                    <Image
                      src={"/assets/edit-svgrepo-com.svg"}
                      alt={"Edit"}
                      width={30}
                      height={30}
                    />
                  </Link>
                  <span onClick={handleDelete} className="cursor-pointer">
                    <Image
                      src={"/assets/delete-2-svgrepo-com.svg"}
                      alt={"Delete"}
                      width={30}
                      height={30}
                    />
                  </span>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-screen">
            <p>No movie found</p>
          </div>
        )}
      </div>
      {/* Review Section */}
      <div className="review px-4 sm:px-8">
        {id && <ReviewComponent movieId={id as string} />}
      </div>
      <div className="similar-movies mt-8">
        {movie && <SimilarMoviesSlider id={id as string} />}
      </div>
      <Toaster />
    </>
  );
};

export default GetMovieByItsId;
