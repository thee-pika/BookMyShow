import axios from "axios"
import dotenv from "dotenv";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "./ui/carousel";
import { Card, CardContent } from "./ui/card";
import PropagateLoader from "react-spinners/PropagateLoader";
dotenv.config();

interface Movie {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
}

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
    const [upcomingMovies, setupcomingMovies] = useState<MovieData[]>();
    const [streamingMovies, setStreamingMovies] = useState<MovieData[] | null>(null);

    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const getUpcomingMovies = async () => {
            const res = await axios.get(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/movie/upcoming`
            );
            setupcomingMovies(res.data.upcomingMovies);
        }
        getUpcomingMovies();
    }, [])

    useEffect(() => {
        const getStreamingMovies = async () => {
            try {
                const res = await axios.get(
                    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/movie/streamed`
                );
        console.log("streameddddddddddddddddddddddd,", res);
                if (res.status === 200) {
                    setStreamingMovies(res.data.streamedMovies);
                }
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            } catch (error) {
                setLoading(false)
            } finally {
                setLoading(false)
            }
        }
        getStreamingMovies();
    }, [])
 
    if (loading) {
        return <div className="flex justify-center items-center h-[70vh]">
            <PropagateLoader />
        </div>
    }
    
    return (
        <>
            <div className="w-[83vw] mx-auto  rounded-xl">
                <h1 className="text-lg font-semibold m-4 pl-4 pt-4 mt-8">Upcoming Movies</h1>
                <div className="flex flex-wrap justify-center">
                    <Carousel className="w-[90vw]">
                        <CarouselContent className="-ml-1">
                            {upcomingMovies ? (upcomingMovies.map((movie: Movie, index: number) => (
                                <CarouselItem key={index} className="pl-1 md:basis-1/2 lg:basis-1/4">
                                    <div className="p-1">
                                        <Card>
                                            <CardContent className="flex aspect-square items-center justify-center p-6">
                                                {
                                                    <div className="w-[260px] h-[400px] relative overflow-hidden  rounded-lg mt-4 " key={index}>
                                                        <Link href={`/movie/${movie.id}`}>
                                                            <Image
                                                                src={movie.imageUrl}
                                                                alt=""
                                                                layout="fill"
                                                                className="object-cover transition-transform duration-300 hover:scale-110"
                                                            />
                                                        </Link>
                                                    </div>
                                                }
                                            </CardContent>
                                        </Card>
                                    </div>
                                </CarouselItem>
                            ))) :
                                (
                                    <p>No movies available.....</p>
                                )
                            }
                        </CarouselContent>
                        <CarouselPrevious />
                        <CarouselNext />
                    </Carousel>
                </div>
              
            </div>

            <div className="w-[83vw] mx-auto  rounded-xl">
                <h1 className="text-lg font-semibold m-4 pl-4 pt-4 mt-8">Streamed Movies</h1>
                <div className="flex flex-wrap justify-center">
                    <Carousel className="w-[90vw]">
                        <CarouselContent className="-ml-1">
                            {streamingMovies ? (streamingMovies.map((movie: Movie, index: number) => (
                                <CarouselItem key={index} className="pl-1 md:basis-1/2 lg:basis-1/4">
                                    <div className="p-1">
                                        <Card>
                                            <CardContent className="flex aspect-square items-center justify-center p-6">
                                                {
                                                    <div className="w-[260px] h-[400px] relative overflow-hidden  rounded-lg mt-4 " key={index}>
                                                        <Link href={`/movie/${movie.id}`}>
                                                            <Image
                                                                src={movie.imageUrl}
                                                                alt=""
                                                                layout="fill"
                                                                className="object-cover transition-transform duration-300 hover:scale-110"
                                                            />
                                                        </Link>
                                                    </div>
                                                }
                                            </CardContent>
                                        </Card>
                                    </div>
                                </CarouselItem>
                            ))) :
                                (
                                    <p>No movies available.....</p>
                                )
                            }
                        </CarouselContent>
                        <CarouselPrevious />
                        <CarouselNext />
                    </Carousel>
                </div>
           
            </div>
        </>
    )
}

export default UpcomingMovies