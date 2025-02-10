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
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getUpcomingMovies();
    }, [])

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
                    <div >
                        <div className="latest">
                            {
                                UpcomingMovies && UpcomingMovies.map((movie) => (
                                    <Link href={`/movie/${movie.id}`} key={movie.title}>
                                        <span key={movie.id} className="text-gray-300 hover:text-gray-50 font-semibold ">  {movie.title}</span> |
                                    </Link>
                                ))
                            }
                        </div>
                        <div className="quick-links">
                            <Link href={"/movie/upcoming"}>
                                <h1 className="text-gray-50 mt-4 mb-4 text-lg font-bold">  Upcoming Movies</h1>
                            </Link>
                            <Link href={"/movie/streaming"}>
                                <h1 className="text-gray-50 mt-4 mb-4 text-lg font-bold"> week Streaming </h1>
                            </Link>
                        </div>
                    </div>
                    <div className="footer  w-[100%]  flex flex-col justify-center items-center h-20 bottom-0">
                        <div className="socio-icons flex ">
                            <div className="facebook cursor-pointer">
                                <Image
                                    src={'/assets/facebook-svgrepo-com.svg'}
                                    alt={""}
                                    width={30}
                                    height={30}
                                    className="opacity-50 hover:opacity-100 mx-2"
                                />
                            </div>
                            <div className="twitter cursor-pointer">
                                <Image
                                    src={'/assets/linkedin-round-svgrepo-com.svg'}
                                    alt={""}
                                    width={30}
                                    height={30}
                                    className="opacity-50 hover:opacity-10 mx-2"
                                />
                            </div>
                            <div className="linked-in cursor-pointer">
                                <Image
                                    src={'/assets/twitter-round-svgrepo-com.svg'}
                                    alt={""}
                                    width={30}
                                    height={30}
                                    className="opacity-50 hover:opacity-100 mx-2"
                                />
                            </div>
                        </div>
                        <div className="footer-items flex items-center flex-col mb-12">
                            <h2 className="font-bold mt-4 mb-4 text-gray-50">&copy; All Rights Received 2025</h2>
                            <h4 className="text-gray-400 text-sm">The content and images used on this site are copyright protected and copyrights vests with the respective owners. The usage of the content and images on this website is intended to promote the  works and no endorsement of the artist shall be implied. Unauthorized use is prohibited and punishable by law.</h4>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default Footer