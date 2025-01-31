"use client";
import React, { useState } from "react";
import axios from "axios";
import dotenv from "dotenv";
import { useRouter } from "next/navigation";
import DateTimePicker from 'react-datetime-picker';
import UploadToCloudianary from "../components/cloudinary/UploadToCloudianary";
import 'react-datetime-picker/dist/DateTimePicker.css';
import 'react-calendar/dist/Calendar.css';
import 'react-clock/dist/Clock.css';
dotenv.config();

interface MovieData {
    title: string,
    description: string,
    totalSeats: number,
    seatPrice: number,
    cinemahall: string,
    startTime: Date | null
}

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

interface Images {
    file1: File | null,
    file2: File | null
}

const AddMovieForm = () => {
    const router = useRouter();
    const [value, onChange] = useState<Value>(new Date());
    const [movieData, setMovieData] = useState<MovieData | null>({
        title: "",
        description: "",
        totalSeats: 0,
        seatPrice: 0,
        cinemahall: "",
        startTime: null
    });

    const [images, setImages] = useState<Images>({
        file1: null,
        file2: null
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name } = e.target;
        if (e.target.files && e.target.files[0]) {
            console.log("imag", e.target.files[0]);
            setImages({ ...images!, [name]: e.target.files![0] })
        }

    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const token = sessionStorage.getItem("access_token");
        console.log("token", token);

        const image = await UploadToCloudianary(images.file1!);
        const image2 = await UploadToCloudianary(images.file2!);

        console.log("fropm",image)
        console.log("from",image2)
        const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/movie`, {
            title: movieData!.title,
            description: movieData!.description,
            totalSeats: movieData!.totalSeats,
            banner: image2,
            imageUrl: image,
            seatPrice: movieData?.seatPrice,
            startTime: (movieData!.startTime),
            cinemahall: movieData?.cinemahall
        },
            {
                headers: {
                    authorization: `Bearer ${token}`

                }
            }
        )

        console.log("res", res)
        if (res.statusText === "ok") {
            router.push("/");
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
                    <label className="block font-medium mb-1">Banner Image</label>
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
