"use client";
import axios from "axios";
import { useState } from "react"

const NewMovie = () => {
    const [newMovieData, setnewMovieData] = useState({
        title: "",
        description: "",
        imageUrl: ""
    })
    async function handleSubmit(e: React.FormEvent<HTMLFormElement>): Promise<void> {
        const admin_token = "";
        e.preventDefault();
        const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/movie`, {
            title: newMovieData.title,
            description: newMovieData.description,
            imageUrl: newMovieData.imageUrl,
            adminId: ""
        },
            {
                headers: {
                    authorization: `Bearer ${admin_token}`
                }
            })
    }

    function handleChange(event: React.ChangeEvent<HTMLInputElement>): void {
        const { name, value } = event.target;
        setnewMovieData({ ...newMovieData, [name]: value })
    }

    return (
        <>
            <div className="movie shadow-sm rounded-md w-[40vw] mx-auto h-100 flex flex-col justify-center items-center mt-8">
                <form onSubmit={handleSubmit}>
                    <div>
                        <h1 className="mb-4 text-xl font-bold ">Login Into Your Account</h1>
                        <input
                            type="text"
                            name="title"
                            placeholder="title"
                            onChange={handleChange}
                            value={newMovieData.title}
                            className="bg-gray-50 border mb-4  border-gray-100 text-gray-900 outline-none focus:ring-[#cc0a31] focus:border-[#cc0a31] block w-full ring-2 p-4 rounded-md"
                            required
                        />
                        <input
                            type="text"
                            name="title"
                            placeholder="title"
                            value={newMovieData.title}
                            className="bg-gray-50 border border-gray-100 text-gray-900 outline-none focus:ring-[#cc0a31] focus:border-[#cc0a31] block w-full ring-2 p-4 rounded-md"
                            required
                        />
                        <input
                            type="file"
                            name="imageUrl"
                           
                            className="bg-gray-50 border border-gray-100 mt-4  text-gray-900 outline-none focus:ring-[#cc0a31] focus:border-[#cc0a31] block w-full ring-2 p-4 rounded-md"
                            required
                        />
                        <button type="submit" className="bg-red-600 rounded-md p-4 mt-4 w-full text-white font-bold"> create Movie </button>
                    </div>
                </form>
            </div>
        </>
    )
}

export default NewMovie