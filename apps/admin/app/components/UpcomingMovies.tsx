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
    const [currentPage, setcurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        getUpcomingMovies();
    }, [currentPage])

    const getUpcomingMovies = async () => {
        const res = await axios.get(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/movie?page=${currentPage}&limit=8`
        );

        setupcomingMovies(res.data.movies);
        setTotalPages(res.data.totalPages);

    }

    const goToNextPage = () => {
        if (currentPage < totalPages) setcurrentPage((prev) => prev+1);
    };

    const goToPreviousPage = () => {
        if (currentPage > 1) setcurrentPage((prev) => prev-1);
    };

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
            <div className="pagination-controls">
                <button
                    onClick={goToPreviousPage}
                    disabled={currentPage === 1}
                    className="border border-e-gray-400 px-4 rounded-md"
                >
                    Previous
                </button>
                <span className="border border-e-gray-400 px-4 rounded-md" >Page {currentPage} of {totalPages}</span>
                <button
                    onClick={goToNextPage}
                    disabled={currentPage === totalPages}
                    className="border border-e-gray-400 px-4 rounded-md"
                >
                    Next
                </button>
            </div>
        </div>
    )
}

export default UpcomingMovies