"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import dotenv from "dotenv";
import { useRouter } from "next/navigation";
import DateTimePicker from 'react-datetime-picker';
import UploadToCloudianary from "../components/cloudinary/UploadToCloudianary";
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
    year: number
}

interface FileType {
    file1: File | null,
    file2: File | null
}
const AddMovieForm = () => {
    const router = useRouter();
    // const [loading, setLoading] = useState(true);
    const [token, setToken] = useState<string | null>(null);

    console.log("im in add movieeeeeeeeeeeeeeeeeeeeeee");
    useEffect(() => {
        const data = sessionStorage.getItem("access_token");
        if (data) {

            const userDetails = JSON.parse(data);
            const token = userDetails.token;
            setToken(token);
            if (!token) {
                router.push("/auth/login");
            }
        }
    }, [router])


    const [selectedOption, setSelectedOption] = useState({
        language: "",
        genre: ""
    });

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
        trailerId: ""
    });

    const [files, setFiles] = useState<FileType | null>({
        file1: null,
        file2: null
    });

    const languages = ["Telugu", "Hindi", "English", "Tamil", "Malayalam"]
    const genres = ["Action", "Thriller", "Horror"]

    // if (loading) {
    //     return <div className="flex justify-center items-center h-[70vh]">
    //         <PropagateLoader />
    //     </div>
    // }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name } = e.target;
        if (e.target.files && e.target.files[0]) {
            setFiles({ ...files!, [name]: e.target.files[0] })
        }
    }

    const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        setSelectedOption({ ...selectedOption, [name]: value });
        setMovieData({ ...movieData!, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const image = await UploadToCloudianary(files!.file1!);
            const image2 = await UploadToCloudianary(files!.file2!);
            const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/movie`, {
                title: movieData!.title,
                description: movieData!.description,
                totalSeats: movieData!.totalSeats,
                imageUrl: image,
                seatPrice: movieData?.seatPrice,
                startTime: (movieData!.startTime),
                cinemahall: movieData?.cinemahall,
                language: movieData?.language,
                banner: image2,
                genre: movieData?.genre,
                year: movieData?.year,
                trailerId: movieData?.trailerId
            },
                {
                    withCredentials: true
                }
            )

            if (res.status === 200) {
                router.push("/");
            }
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            // setLoading(false)
        } finally {
            // setLoading(false)
        }
    };

    return (
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
                    <input
                        type="file"
                        name="file1"
                        onChange={handleFileChange}
                        className="w-full p-2 border border-gray-300 rounded"
                        placeholder="Enter image URL"
                    />
                </div>

                <div className="mb-4">
                    <label className="block font-medium mb-1">Banner</label>
                    <input
                        type="file"
                        name="file2"
                        onChange={handleFileChange}
                        className="w-full p-2 border border-gray-300 rounded"
                        placeholder="Enter image URL"
                    />
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
                            value={selectedOption.genre}
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
                            value={selectedOption.language}
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
                    Submit
                </button>
            </form>
        </div>
    );
};

export default AddMovieForm;
