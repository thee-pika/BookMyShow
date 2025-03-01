"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import PropagateLoader from "react-spinners/PropagateLoader";

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

const Footer = () => {
    const [UpcomingMovies, setUpcomingMovies] = useState<MovieData[] | null>(null);
    const [streamingMovies, setStreamingMovies] = useState<MovieData[] | null>(null);
    const [allMovies, setallMovies] = useState<MovieData[] | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getUpcomingMovies();
        getStreamingMovies();
        getAllMovies();
    }, [])

    const getAllMovies = async () => {
        try {
            const res = await axios.get(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/movie`
            );

            if (res.status === 200) {
              console.log("res.data.movies", res.data.movies);
                setallMovies(res.data.movies);
            }
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            setLoading(false)
        } finally {
            setLoading(false)
        }
    }

    const getStreamingMovies = async () => {
        try {
            const res = await axios.get(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/movie/streaming`
            );

            if (res.status === 200) {
                setStreamingMovies(res.data.streamingMovies);
            }
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            setLoading(false)
        } finally {
            setLoading(false)
        }
    }

    const getUpcomingMovies = async () => {
        try {
            const res = await axios.get(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/movie/upcoming`
            );

            if (res.status === 200) {
                setUpcomingMovies(res.data.upcomingMovies);
            }
        } catch (error) {
            console.log(error);
            setLoading(false);
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return <div className="flex justify-center items-center h-[70vh]">
            <PropagateLoader />
        </div>
    }

    return (
        <>
          <section>
      <div className="bg-[#333338] p-8 mt-12">
        <div className="all-movies mb-8">
          <h2 className="text-gray-50 text-lg font-bold mb-4">All Movies</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {allMovies &&
              allMovies.map((movie) => (
                <Link href={`/movie/${movie.id}`} key={movie.id}>
                  <span className="text-gray-300 hover:text-gray-50 font-semibold block break-words">
                    {movie.title}
                  </span>
                </Link>
              ))}
          </div>
        </div>

        <div className="quick-links grid md:grid-cols-2 gap-8">
          <div className="upcoming">
            <Link href="/movie/upcoming">
              <h1 className="text-gray-50 mt-4 mb-4 text-lg font-bold">Upcoming Movies</h1>
            </Link>
            <div className="grid grid-cols-2 gap-2">
              {UpcomingMovies &&
                UpcomingMovies.map((movie) => (
                  <Link href={`/movie/${movie.id}`} key={movie.id}>
                    <span className="text-gray-300 hover:text-gray-50 font-semibold block">
                      {movie.title}
                    </span>
                  </Link>
                ))}
            </div>
          </div>

          <div className="streaming">
            <Link href="/movie/streaming">
              <h1 className="text-gray-50 mt-4 mb-4 text-lg font-bold">Streaming This Week</h1>
            </Link>
            <div className="grid grid-cols-2 gap-2">
              {streamingMovies &&
                streamingMovies.map((movie) => (
                  <Link href={`/movie/${movie.id}`} key={movie.id}>
                    <span className="text-gray-300 hover:text-gray-50 font-semibold block">
                      {movie.title}
                    </span>
                  </Link>
                ))}
            </div>
          </div>
        </div>

        <div className="footer w-full flex flex-col items-center mt-12">
          <div className="socio-icons flex justify-center gap-4 mb-6">
            <Image
              src="/assets/facebook-svgrepo-com.svg"
              alt="Facebook"
              width={30}
              height={30}
              className="opacity-50 hover:opacity-100 cursor-pointer"
            />
            <Image
              src="/assets/linkedin-round-svgrepo-com.svg"
              alt="LinkedIn"
              width={30}
              height={30}
              className="opacity-50 hover:opacity-100 cursor-pointer"
            />
            <Image
              src="/assets/twitter-round-svgrepo-com.svg"
              alt="Twitter"
              width={30}
              height={30}
              className="opacity-50 hover:opacity-100 cursor-pointer"
            />
          </div>

          <div className="footer-items text-center text-gray-50">
            <h2 className="font-bold mt-4 mb-4">&copy; All Rights Reserved 2025</h2>
            <p className="text-gray-500 text-sm">
              The content and images used on this site are copyright protected. The usage of the
              content and images on this website is intended to promote works, and no endorsement
              of the artist shall be implied. Unauthorized use is prohibited and punishable by law.
            </p>
          </div>
        </div>
      </div>
    </section>
        </>
    )
}

export default Footer