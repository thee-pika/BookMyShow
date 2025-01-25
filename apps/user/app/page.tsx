"use client";

import axios from "axios";
import { useEffect, useState } from "react";

interface Movie {
  id: string,
  title: string,
  description: string,
  imageUrl: string,
}
export default function Home() {
  const [movies, setMovies] = useState<Movie[] | null>();
  useEffect(() => {
    getMovies()
  }, [])

  const getMovies = async () => {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/movie`);
    console.log("res,", res);
    if (res.status === 200) {
      setMovies(res.data.movies);
    }
  }

  return (
    <>
      <div className="movies">
        {
          movies?.map((movie: Movie) => (
            <div key={movie.id} className="p-4 m-8">{movie.title} </div>
          ))
        }
      </div>
    </>
  );
}
