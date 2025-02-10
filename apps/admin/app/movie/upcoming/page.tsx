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

const UpcomingMovies = () => {
    const [UpcomingMovies, setUpcomingMovies] = useState<MovieData[] |null>(null);
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
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
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
        <div>
            <div className=" bg-white rounded-xl shadow-md">
                <h1 className="text-xl font-bold text-center"> Upcoming Movies </h1>
                <div className="flex flex-wrap justify-center">
                    {UpcomingMovies ? (
                        UpcomingMovies.map((movie: MovieData) => (
                            <div
                                key={movie.id}
                                className="m-8 shadow-sm rounded-md overflow-hidden"
                            >
                                <div className="w-[260px] h-[400px] relative overflow-hidden">
                                    <Link href={`/movie/${movie.id}`}>
                                        <Image
                                            src={movie.imageUrl}
                                            alt=""
                                            layout="fill"
                                            className="object-cover transition-transform duration-300 hover:scale-110"
                                        />
                                    </Link>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>No movies available.....</p>
                    )}

                </div>
            </div>
        </div>
    )
}

export default UpcomingMovies