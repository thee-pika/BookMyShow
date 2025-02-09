"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import dotenv from "dotenv";
import { useParams, useRouter } from "next/navigation";
import { MdUpload } from 'react-icons/md';
import DateTimePicker from 'react-datetime-picker';
import toast, { Toaster } from 'react-hot-toast';
import UploadToCloudianary from "../../../components/cloudinary/UploadToCloudianary";
import 'react-datetime-picker/dist/DateTimePicker.css';
import 'react-calendar/dist/Calendar.css';
import 'react-clock/dist/Clock.css';

import PropagateLoader from "react-spinners/PropagateLoader";
dotenv.config();

interface MovieData {
    title: string,
    description: string,
    totalSeats: number,
    seatPrice: number,
    cinemahall: string,
    startTime: Date | null,
    language: string,
    genre: string,
    trailerId: string,
    year: number,
    imageUrl: string,
    banner: string
}

interface FileType {
    imageUrl: File | null,
    banner: File | null
}


const EditMovie = () => {
    const router = useRouter();
    const { id } = useParams();
    const [loading, setLoading] = useState(true);

    const [movieData, setMovieData] = useState<MovieData | null>({
        title: "",
        description: "",
        totalSeats: 0,
        seatPrice: 0,
        cinemahall: "",
        startTime: null,
        language: "Telugu",
        genre: "Action",
        year: 0,
        trailerId: "",
        imageUrl: "",
        banner: ""
    });

    const [files, setFiles] = useState<FileType | null>({
        imageUrl: null,
        banner: null
    });

    const languages = ["Telugu", "Hindi", "English", "Tamil", "Malayalam"]
    const genres = ["Action", "Thriller", "Horror"]

    const getMovieData = async () => {
        try {
            const res = await axios.get(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/movie/${id}`
            );
           
            if (res.statusText === "OK") {
                setMovieData(res.data.movie);
               
               
            }
        } catch (error) {
            console.log("error", error);
            setLoading(false);
        } 
    }

    useEffect(() => {
        const fetchData = async () => {
            await getMovieData();
            setLoading(false);
        }
        fetchData()
    }, [])

    if (loading) {
        return <div className="flex justify-center items-center h-[70vh]">
            <PropagateLoader />
        </div>
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name } = e.target;
        if (e.target.files && e.target.files[0]) {
            setFiles({ ...files!, [name]: e.target.files[0] });

            setMovieData({ ...movieData!, [name]: e.target.files[0].name });
        }
    }

    const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        // setSelectedOption({ ...selectedOption, [name]: value });
        setMovieData({ ...movieData!, [name]: value })
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const image = files?.imageUrl ? await UploadToCloudianary(files!.imageUrl!) : movieData?.imageUrl;
        const image2 = files?.banner ? await UploadToCloudianary(files!.banner!) : movieData?.banner

        if (image && image2) {
            setMovieData({ ...movieData!, imageUrl: image, banner: image2 });
        }

        const res = await axios.put(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/movie/${id}`, {
            movieData
        },
            {
                withCredentials: true
            }
        )
     
        if (res.status === 200) {
            toast.success("Movie Updated successfully!!");
            setTimeout(() => {
                router.push("/");
            },1000)
           
        }
    };

    function handleClick(): void {
        const fileInput = document.getElementById("fileInput");
        if (fileInput) {
            fileInput.click()
        }
    }

    return (
        <div>
            <div className="p-4 mt-12 mb-12 max-w-3xl mx-auto bg-gray-100 rounded-lg shadow-lg">
                <h2 className="text-2xl font-semibold mb-4">Add New Movie</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block font-medium mb-1">Title</label>
                        <input
                            type="text"
                            value={movieData?.title}
                            onChange={(e) => setMovieData({ ...movieData!, title: e.target.value })}
                            className="w-full p-2 border border-gray-300 rounded"
                            placeholder="Enter movie title"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block font-medium mb-1">Description</label>
                        <textarea
                            value={movieData!.description}
                            onChange={(e) =>
                                setMovieData({ ...movieData!, description: e.target.value })
                            }
                            className="w-full p-2 border border-gray-300 rounded"
                            placeholder="Enter movie description"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block font-medium mb-1">Image URL</label>
                        <div
                            className="flex flex-col mb-4 items-center justify-center w-[80%] h-64 border-2 border-dashed rounded-lg bg-[#f4f5f5] cursor-pointer hover:bg-gray-800"
                            onClick={handleClick}
                            onDrop={(e) => {
                                e.preventDefault();
                                const file = e.dataTransfer.files[0];
                                if (file) {

                                    setMovieData({ ...movieData!, imageUrl: file.name })
                                }
                            }}
                            onDragOver={(e) => e.preventDefault()}
                        >
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                {movieData?.imageUrl ? (
                                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                        Uploaded Image URL: {movieData?.imageUrl}
                                    </p>
                                ) : (
                                    <>
                                        <MdUpload className="w-8 h-8 mb-4 text-gray-500" />

                                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                            <span className="font-semibold">Click to upload</span> or drag and drop
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            PNG, JPG or JPEG (MAX. 2MB)
                                        </p>
                                    </>
                                )
                                }
                            </div>
                            <input
                                type="file"
                                name="imageUrl"
                                id="fileInput"
                                className="hidden"
                                accept="image/*"
                                onChange={handleFileChange}
                            />
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="block font-medium mb-1">Banner</label>
                        <div
                            className="flex flex-col mb-4 items-center justify-center w-[80%] h-64 border-2 border-dashed rounded-lg bg-[#f4f5f5] cursor-pointer hover:bg-gray-800"
                            onClick={handleClick}
                            onDrop={(e) => {
                                e.preventDefault();
                                const file = e.dataTransfer.files[0];
                                if (file) {

                                    setMovieData({ ...movieData!, banner: file.name })
                                }
                            }}
                            onDragOver={(e) => e.preventDefault()}
                        >
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                {movieData?.banner ? (
                                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                        Uploaded Image URL: {movieData?.banner}
                                    </p>
                                ) : (
                                    <>
                                        <MdUpload className="w-8 h-8 mb-4 text-gray-500" />

                                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                            <span className="font-semibold">Click to upload</span> or drag and drop
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            PNG, JPG or JPEG (MAX. 2MB)
                                        </p>
                                    </>
                                )
                                }
                            </div>
                            <input
                                type="file"
                                name="banner"
                                id="fileInput"
                                className="hidden"
                                accept="image/*"
                                onChange={handleFileChange}
                            />
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="block font-medium mb-1">Total Seats</label>
                        <input

                            type="number"
                            onChange={(e) => setMovieData({ ...movieData!, totalSeats: parseInt(e.target.value) })}
                            className="w-full p-2 border border-gray-300 rounded"
                            value={movieData?.totalSeats}
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block font-medium mb-1">Seat Price</label>
                        <input
                            type="number"
                            onChange={(e) => setMovieData({ ...movieData!, seatPrice: parseInt(e.target.value) })}
                            className="w-full p-2 border border-gray-300 rounded"
                            value={movieData?.seatPrice}
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block font-medium mb-1">Cinema Hall</label>
                        <input
                            name="cinemahall"
                            type="text"
                            onChange={(e) =>
                                setMovieData({ ...movieData!, cinemahall: e.target.value })
                            }
                            className="w-full p-2 border border-gray-300 rounded"
                            value={movieData?.cinemahall}
                        />
                    </div>
                    <div className="flex justify-between">
                        <div className="mb-4">
                            <label className="block font-medium mb-1">Genre</label>
                            <select
                                id="movie-dropdown"
                                value={movieData?.genre}
                                onChange={handleSelect}
                                className="dropdown p-2 px-4 border border-gray-300 rounded"
                                name="genre"
                            >
                                <option value="" disabled>
                                    choose the genre
                                </option>
                                {
                                    genres.map((genre) => (
                                        <option value={genre} key={genre}>{genre}</option>
                                    ))
                                }
                            </select>
                        </div>
                        
                        <div className="mb-4">
                            <label className="block font-medium mb-1">Language</label>
                            <select
                                id="movie-dropdown"
                                value={movieData?.language}
                                onChange={handleSelect}
                                className="dropdown p-2 px-4 border border-gray-300 rounded"
                                name="language"
                            >
                                <option value="" disabled>
                                    choose the language
                                </option>
                                {
                                    languages.map((lang) => (
                                        <option value={lang} key={lang}>{lang}</option>
                                    ))
                                }
                            </select>

                        </div>
                        <div className="mb-4">
                            <label className="block font-medium mb-1">year</label>
                            <input
                                name="cinemahall"
                                type="number"
                                onChange={(e) =>
                                    setMovieData({ ...movieData!, year: parseInt(e.target.value) })
                                }
                                className="w-full p-2 border border-gray-300 rounded"
                                value={movieData?.year}
                            />
                        </div>
                    </div>
                    <div className="mb-4">
                        <label className="block font-medium mb-1">TrailerId</label>
                        <input
                            name="trailerId"
                            type="text"
                            onChange={(e) =>
                                setMovieData({ ...movieData!, trailerId: e.target.value })
                            }
                            className="w-full p-2 border border-gray-300 rounded"
                            value={movieData?.trailerId}
                        />
                    </div>

                    <div className="mb-4">
                        <h1>Start Time</h1>
                        <DateTimePicker
                            value={movieData!.startTime}
                            onChange={(date) => {
                                console.log("data", date);
                                setMovieData({ ...movieData!, startTime: date })
                            }} />
                    </div>
                    <button
                        type="submit"

                        className="w-full px-4 py-2 bg-[#cc0a31] text-white rounded hover:bg-[#cc0a0a67]"
                    >
                        Edit
                    </button>
                </form>
            </div>
            <Toaster />
        </div>
    )
}

export default EditMovie