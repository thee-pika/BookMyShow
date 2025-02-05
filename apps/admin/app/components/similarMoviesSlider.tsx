import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import Image from "next/image";
import axios from "axios";
import { useEffect, useState } from "react";
import Link from "next/link";

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

const SimilarMoviesSlider = ({id}: {id: string}) => {
    const [similarMovies, setSimilarMovies] = useState<MovieData[] | null>(null);

    useEffect(() => {
      getSimilarMovies()
    }, [])
    
    const getSimilarMovies = async () => {
        const res = await axios.get(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/movie/${id}/similar`
        );
        if (res.statusText === "OK") {
            const fetchedSimilarMovieData = res.data.similarMovies;
            setSimilarMovies(fetchedSimilarMovieData);
        }
    };
    return (
        <div>
            <Swiper
                slidesPerView={4}
                loop={similarMovies ? similarMovies.length > 4 : false}
                spaceBetween={10}
                navigation={true}
                modules={[Navigation]}
                className="w-full"
            >
                {
                    similarMovies?.map((movie:MovieData, index: number) => (
                        <SwiperSlide key={index} className="slider-slide">
                            
                            <div className="w-[260px] h-[400px] relative overflow-hidden  rounded-lg mt-4 ">
                                <Link href={`/movie/${movie.id}`}>
                                    <Image
                                        src={movie.imageUrl}
                                        alt=""
                                        layout="fill"
                                        className="object-cover transition-transform duration-300 hover:scale-110"
                                    />
                                </Link>
                            </div>
                        </SwiperSlide>
                    ))
                }
            </Swiper>
        </div>
    )
}

export default SimilarMoviesSlider;