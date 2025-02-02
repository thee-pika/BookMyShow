import axios from "axios"
import dotenv from "dotenv";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
dotenv.config();

interface Movie {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
}

const UpcomingMovies = () => {
    const [upcomingMovies, setupcomingMovies] = useState<Movie[]>();

    useEffect(() => {
        getUpcomingMovies();
    }, [])

    const getUpcomingMovies = async () => {
        const res = await axios.get(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/movie`
        );

        setupcomingMovies(res.data.movies);

    }

    return (
        <div className="w-[83vw] mx-auto bg-white rounded-xl">
            <h1 className="text-lg font-semibold m-4 pl-4 pt-4 mt-8">Upcoming Movies</h1>
            <div className="flex flex-wrap justify-center">
                {upcomingMovies ? (
                    upcomingMovies.map((movie: Movie) => (
                        <div
                            key={movie.id}
                            className="m-8 shadow-sm rounded-md overflow-hidden"
                        >
                            <div className="w-[240px] h-[320px] relative overflow-hidden">
                                <Link href={`/movie/${movie.id}`}>
                                    <Image
                                        src={movie.imageUrl}
                                        alt=""
                                        layout="fill"
                                        className="object-cover"
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
    )
}

export default UpcomingMovies