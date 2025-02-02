"use client";

import axios from "axios";
import dotenv from "dotenv";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import ImageSlider from "./components/ImageSlider";
import Sidebar from "./components/Sidebar";
import UpcomingMovies from "./components/UpcomingMovies";

dotenv.config();

interface cinemaHall {
  name: string;
}

interface City {
  name: string;
  cinemaHalls: cinemaHall[];
}

interface Movie {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  cities: City[];
  language: string
  genre: string
}

export default function Home() {
  const [movies, setMovies] = useState<Movie[] | null>(null);
  const [searchItem, setSearchItem] = useState("");
  const [fileteredMovies, setfileteredMovies] = useState<Movie[] | null>(null);
  const [currentPage, setcurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0);

  const [selectedItems, setselectedItems] = useState({
    language: "All",
    genre: "Action"
  })

  useEffect(() => {
    getMovies();
  }, []);

  const handleSearchItem = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchItem(e.target.value);
  }

  useEffect(() => {
    const filteredMovies = movies?.filter((movie) => {
      const selectedLang = selectedItems.language === "All" || movie.language === selectedItems.language;
      const selectGenre = selectedItems.genre === movie.genre;

      const searchedItem = movie.title.toLowerCase().includes(searchItem.toLowerCase());
      return selectedLang && selectGenre && searchedItem;
    })

    setfileteredMovies(filteredMovies!);
  }, [movies, searchItem, selectedItems.genre, selectedItems.language])

  const getMovies = async () => {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/movie?page=${currentPage}&limit=6`
    );
    setMovies(res.data.movies);
    setTotalPages(movies!.length)
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) setcurrentPage(currentPage + 1);
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) setcurrentPage(currentPage - 1);
  };

  return (
    <>
      <div className="movies bg-[#F6F6F6] mb-4">
        {/* Image Slider */}
        <div>
          <ImageSlider />
          <div className="h-[72px] w-[1530px] shadow-lg  flex items-center justify-evenly">
            <div>
              <button className="bg-[#EEEFF1] text-sm ml-24 p-2 px-4 rounded-md border-blue-400 border-[1px]">upcoming</button>
              <button className="bg-[#EEEFF1] text-sm  p-2 px-4 rounded-md border-blue-200 ml-4">Now streaming</button>
            </div>

            <div className="relative  ml-12">
              <div className="absolute inset-y-0 start-0 flex items-center ps-3">
                <svg className="w-4 h-4 text-gray-500 " aria-hidden="true" fill="none" viewBox="0 0 20 20">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="search Your Favourite movie?"
                className="p-2 px-12 rounded-md ps-10 text-sm text-gray-900 w-2xl"
                value={searchItem}
                onChange={handleSearchItem}
              />
            </div>
            <button className="flex justify-center items-center border-outline border-[1px] p-2 px-4 text-sm rounded-md border-[#b9cfd5]">
              <Image
                src="/assets/location-pin-svgrepo-com.svg" alt={"lo9cation-icon"} width={20} height={20} />
              <span className="pl-[3px]">Hyderabad</span>
            </button>
          </div>
        </div>

        {/* Movie List */}
        <div className="flex mx-auto bg-[#F6F6F6] mt-8 justify-center">
          <Sidebar
            selectedItems={selectedItems}
            setSelectedItems={setselectedItems}
          />
          <div className="w-[65vw] bg-white rounded-xl shadow-sm">
            <div className="flex flex-wrap justify-center">
              {fileteredMovies ? (
                fileteredMovies.map((movie: Movie) => (
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
              <div className="pagination-controls">
                <button
                  onClick={goToPreviousPage}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
                <span>Page {currentPage} of {totalPages}</span>
                <button
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages}
                  className="bg-black"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-[#F6F6F6] ml-12 mt-8">
          <UpcomingMovies />
        </div>

        <div className="screening-today mt-12">
          <div className="relative w-full h-[600px] bg-cover bg-center" style={{ backgroundImage: "url('/assets/screening.jpg')" }}>
            <div className="absolute inset-0 bg-[#21223F] bg-opacity-50"></div>
            <div className="relative z-10 flex items-center justify-between h-full px-12">
              {/* Text Section */}
              <div className="text-section text-white max-w-lg">
                <h1 className="text-4xl font-bold mb-4">This Saturday&apos;s Screening</h1>
                <p className="text-lg">
                  Don&apos;t miss the most awaited film screening this Saturday! Get ready for
                  an unforgettable movie night with friends and family. See you there!
                </p>
              </div>
              <div className="movie-image">
                <Image
                  src="/assets/salaar.webp"
                  alt="Movie Poster"
                  width={700}
                  height={450}
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
