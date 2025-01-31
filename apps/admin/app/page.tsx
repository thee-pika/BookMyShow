"use client"
import axios from "axios";
import dotenv from "dotenv";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
dotenv.config();

interface cinemaHall {
  name: string
}

interface City {
  name: string,
  cinemaHalls: cinemaHall[]
}

interface Movie {
  id: string
  title: string,
  description: string,
  imageUrl: string,
  cities: City[]
}

export default function Home() {
  const [movies, setMovies] = useState<Movie[] | null>(null);

  useEffect(() => {
    getMovies()
  }, [])

  const getMovies = async () => {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/movie`);
    setMovies(res.data.movies);
  }

  return (
    <>
      <div className="movies">
        <div className="flex">
          {
            movies ? movies.map((movie: Movie) => (
              <div key={movie.id} className=" m-8 shadow-sm rounded-md overflow-hidden">
                <Link href={`/movie/${movie.id}`}>
                <Image
                  src={movie.imageUrl}
                  key={movie.id}
                  width={240}
                  height={240} alt={""} 
                  className="transition-transform duration-300 hover:scale-110"
                  />
                </Link>
              </div>
            )) : <p>No movies available.....</p>
          }
        </div>
      </div>
    </>
  );
}
