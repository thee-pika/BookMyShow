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

  const router = useRouter();

  useEffect(() => {
    const data = sessionStorage.getItem("access_token");
    if (data) {
      const userDetails = JSON.parse(data);

      if (userDetails) {
        setrole(userDetails.role);
      }
    } else {
      setrole("");
    }

  }, [role])

  

  useEffect(() => {
    if (id) {

      const getMovie = async () => {
        try {
          const res = await axios.get(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/movie/${id}`
          );
          if (res.statusText === "OK") {
            setMovie(res.data.movie);
            console.log("res movie, ", res.data.movie);
          }
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
          setLoading(false)
        } finally {
          setLoading(false)
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
      <div className="movie bg-black text-white min-h-screen relative flex-col">
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
                <p className="text-lg font-bold  text-white">
                  startsAt:
                  {new Date(movie.startTime!).toLocaleString('en-Us', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
                <div>
                  <Link href={`/movie/${movie.id}/seats`}>
                    <button className="px-20 mt-20 py-3 bg-[#F84464] hover:bg-[#cc0a0a] text-white font-semibold rounded-lg">
                      Book Tickets
                    </button>
                  </Link>
                </div>
              </div>

              {
                role === "admin" && <div className="flex pb-108">
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
              }
            </div>
            {/* <div>
            <SimilarMoviesSlider images={movieImages} />
          </div> */}
          </>
        ) : (
          <div className="flex items-center justify-center h-screen">
            <p>No movie found</p>
          </div>
        )}
      </div>
      {/* review Section */}

      <div className="review">
        {id && <ReviewComponent movieId={id as string} />}
      </div>

      <div className="">
        {
          movie ? (
            <div>
              <SimilarMoviesSlider id={id as string} />
            </div>
          ) : ""
        }
      </div>
      <Toaster />
    </>
  );
};

export default GetMovieByItsId;
