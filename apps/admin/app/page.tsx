"use client";

import axios from "axios";
import dotenv from "dotenv";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import ImageSlider from "./components/ImageSlider";
import Sidebar from "./components/Sidebar";
import UpcomingMovies from "./components/UpcomingMovies";
import PropagateLoader from "react-spinners/PropagateLoader";

dotenv.config();

interface City {
  name: string;
  cinemaHalls: string;
}

interface Movie {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  cities: City[];
  language: string;
  genre: string;
}

export default function Home() {
  const [movies, setMovies] = useState<Movie[] | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [searchItem, setSearchItem] = useState("");
  const [filteredMovies, setFilteredMovies] = useState<Movie[] | null>(null);
  const [loading, setLoading] = useState(true);

  const [selectedItems, setSelectedItems] = useState({
    language: "All",
    genre: "Action",
  });

  useEffect(() => {
    getMovies();
  }, []);

  const handleSearchItem = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchItem(e.target.value);
  };

  useEffect(() => {
    try {
      const filteredFilms = movies?.filter((movie) => {
        const selectedLang =
          selectedItems.language === "All" ||
          movie.language.toLowerCase() === selectedItems.language.toLowerCase();
        const selectGenre =
          movie.genre.toLowerCase() === selectedItems.genre.toLowerCase();
        const searchedItem = movie.title
          .toLowerCase()
          .includes(searchItem.toLowerCase());
        return selectedLang && selectGenre && searchedItem;
      });

      setFilteredMovies(filteredFilms!);
    } catch (error) {
      setLoading(false);
    } finally {
      setLoading(false);
    }
  }, [movies, searchItem, selectedItems.genre, selectedItems.language]);

  const getMovies = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/movie`
      );
      setMovies(res.data.movies);
    } catch (error) {
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <PropagateLoader />
      </div>
    );
  }

  return (
    <>
      <div className="movies bg-white mb-4">
        {/* Image Slider */}
        <div>
          <ImageSlider />
          <div className="h-[72px] shadow-lg flex items-center justify-evenly px-4">
            <div className="hidden md:flex">
              <Link href={"/movie/upcoming"}>
                <button className="bg-[#EEEFF1] text-sm p-2 px-4 rounded-md border-blue-400 border-[1px] cursor-pointer">
                  Upcoming
                </button>
              </Link>
              <Link href={"/movie/streaming"}>
                <button className="bg-[#EEEFF1] text-sm p-2 px-4 rounded-md border-blue-200 ml-4 cursor-pointer">
                  Now Streaming
                </button>
              </Link>
            </div>

            <div className="relative ml-2 sm:ml-12 w-full max-w-[600px]">
              <input
                type="text"
                placeholder="Search Your Favourite Movie"
                className="p-2 px-4 rounded-md ps-10 text-sm text-gray-900 w-full border border-gray-500"
                value={searchItem}
                onChange={handleSearchItem}
              />
            </div>
            <button className="flex justify-center items-center border-outline border-[1px] p-2 px-4 text-sm rounded-md border-[#b9cfd5]">
              <Image
                src="/assets/location-pin-svgrepo-com.svg"
                alt={"location-icon"}
                width={20}
                height={20}
              />
              <span className="pl-[3px]">Hyderabad</span>
            </button>
          </div>
        </div>

        <div className="sm:hidden p-4">
          <button
            onClick={() => setShowFilters(true)}
            className="bg-[#FD4342] text-white p-2 px-12 rounded-lg shadow-md cursor-pointer w-full"
          >
            Filters
          </button>
        </div>

        {/* Movie List */}
        <div className="flex flex-col sm:flex-row justify-center bg-[#F6F6F6]">
          <div className="hidden md:block">
            <Sidebar
              selectedItems={selectedItems}
              setSelectedItems={setSelectedItems}
            />
          </div>
          <div className="w-full sm:w-[65%] mt-8 bg-white rounded-xl shadow-sm">
            <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 justify-items-center p-6">
            
              {filteredMovies ? (
                filteredMovies.map((movie: Movie) => (
                  <div
                    key={movie.id}
                    className="shadow-sm rounded-md overflow-hidden"
                  >
                    <div className="w-[290px] h-[400px] relative overflow-hidden">
                      <Link href={`/movie/${movie.id}`}>
                        <Image
                          src={movie.imageUrl}
                          alt=""
                          layout="fill"
                           sizes="(max-width: 768px) 100vw, 50vw"
                          className="object-cover transition-transform duration-300 hover:scale-110"
                        />
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                <p>No movies available...</p>
              )}
            </div>
          </div>
        </div>

        {showFilters && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-[90vw] max-w-lg relative">
              <button
                onClick={() => setShowFilters(false)}
                className="absolute top-2 right-4 text-gray-500 text-2xl font-bold"
              >
                &times;
              </button>
              <h2 className="text-lg font-bold mb-4">Filters</h2>
              <Sidebar
                selectedItems={selectedItems}
                setSelectedItems={setSelectedItems}
              />
              <button
                onClick={() => setShowFilters(false)}
                className="mt-4 w-full bg-blue-500 text-white p-2 rounded-lg"
              >
                Apply Filters
              </button>
            </div>
          </div>
        )}

        <div className="bg-[#F6F6F6] pt-8">
          <UpcomingMovies />
        </div>

        <div className="screening-today mt-12">
          <div
            className="relative w-full h-[400px] sm:h-[600px]"
            // style={{ backgroundImage: "url('/assets/screening.jpg')" }}
          >
            <div className="absolute inset-0 bg-black"></div>
            <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between h-full p-4 sm:p-12">
              <div className="text-section text-white max-w-lg text-center sm:text-left">
                <h1 className="text-2xl sm:text-4xl font-bold mb-4">
                  This Saturday&apos;s Screening
                </h1>
                <p className="text-sm sm:text-lg">
                  Don&apos;t miss the most awaited film screening this Saturday! Get
                  ready for an unforgettable movie night with friends and
                  family. See you there!
                </p>
              </div>
              <div className="movie-image mt-4 sm:mt-0">
                <Image
                  src="/assets/salaar.webp"
                  alt="Movie Poster"
                  width={400}
                  height={300}
                  className="rounded-lg shadow-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
