"use client";
import StarRatingComponent from 'react-star-rating-component';
import React, { useEffect, useState } from 'react';
import axios from "axios";
import dotenv from "dotenv";
import toast, { Toaster } from 'react-hot-toast';
import Image from 'next/image';
import { useRouter } from "next/navigation";
import PropagateLoader from 'react-spinners/PropagateLoader';
dotenv.config();

interface Review {
    id: string,
    userId: string,
    movieId: string,
    review: string,
    rating: number
}

const ReviewComponent = ({ movieId }: { movieId: string }) => {

    const [rating, setRating] = useState(1);
    const [review, setReview] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState("");
    const [loading, setLoading] = useState(true);
    const [allReviews, setAllReviews] = useState<Review[]>([]);
    const [token, setToken] = useState<string | null>(null);
 
    const router = useRouter();

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

  
    
    useEffect(() => {
        const getReviews = async () => {
            try {
                const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/review//movies/${movieId}`);
                setAllReviews(res.data.reviews);
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            } catch (error) {
                setLoading(false);
            } finally {
                setLoading(false);
            }
        }

        getReviews();
    }, []);

    if (loading) {
        return <div className="flex justify-center items-center h-[70vh]">
            <PropagateLoader />
        </div>
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!isEditing) {
            const res = await axios.post(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/review`, {
                movieId,
                review,
                rating
            }, {
                withCredentials: true
            });

            console.log("reviews", res.data);
            if (res.status === 200) {
                setAllReviews([...allReviews, res.data.newReview])
                toast.success("Review Added successfully!");
            }

        } else {
            const editResponse = await axios.put(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/review/${editingId}`, {
                review,
                rating
            }, {
                withCredentials: true
            });

            if (editResponse.status === 200) {
                toast.success("Review Edited successfully!");
                setAllReviews(allReviews.map((r) => r.id === editingId ? { ...r, review, rating } : r))
            }

            setIsEditing(false);
            setEditingId("");
        }
        setRating(0);
        setReview("");
    }

    const handleStarClick = (nextValue: number) => {
        setRating(nextValue);
    }

    const handleDeleteREview = async (reviewId: string) => {
        const res = await axios.delete(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/review/${reviewId}`, {
            withCredentials: true
        });

        if (res.status === 200) {
            toast.success("Review deleted successfully!");
            setAllReviews(allReviews.filter((r) => r.id !== reviewId));

        }
    }

    const handleEditReview = async (reviewId: string) => {
        setIsEditing(true);
        setEditingId(reviewId);

        const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/review/${reviewId}`);
        const review = res.data.review;
        console.log("review,", review);
        setReview(review.review);
        setRating(review.rating);
    }

    return (
        <div className="container mt-20 mb-20">
            <div className="flex flex-col md:flex-row gap-10 review-section ml-10 mr-10 mx-auto max-h-[600px]">
                <div className='w-full md:w-1/2 bg-[#F6F6F6] flex flex-col items-center justify-center shadow-md rounded-md  h-[400px]'>
                    <h1 className="p-4 text-center font-bold text-xl">
                        {!isEditing ? "How would you rate this movie ....." : "Edit Review"}
                    </h1>

                    <form onSubmit={handleSubmit} className="flex flex-col ">
                        <div className="rating text-4xl flex justify-center">
                            <StarRatingComponent
                                name="rate1"
                                starCount={5}
                                value={rating}
                                onStarClick={handleStarClick}
                            />
                        </div>

                        <div className='flex justify-center'>
                            <textarea
                                placeholder="write your review"
                                value={review}
                                onChange={(e) => setReview(e.target.value)}
                                className="border border-gray-500 p-4 mt-4 ml-4 mr-4 rounded-md w-[30vw] sm:w-lg"
                            />
                        </div>
                        <div className="flex justify-center">
                            <button
                                type="submit" className="bg-red-700 px-4 p-2 w-[150px] rounded-md hover:bg-red-800 text-white mt-4 mb-4 ">
                                {isEditing ? "Edit" : "Submit"}
                            </button>
                        </div>
                    </form>
                </div>

                {/* RenderReviews */}
                <div className='w-full md:w-1/2 bg-[#F6F6F6] max-h-[400px] overflow-y-auto'>
                    <h1 className='font-bold text-lg text-center mt-4'>Top Reviews</h1>
                    <div className="reviews h-80  grid  grid-cols-1 sm:grid-cols-2 mb-4">
                        {
                            allReviews ?
                                allReviews.map((review) => (
                                    <div key={review.id} className="p-4 mx-auto rounded-md m-4 shadow-md w-80 flex flex-col justify-evenly">
                                        <div className='flex items-center'>
                                            <div className="user-icon">
                                                <Image src={"/assets/user-profile-circle-solid-svgrepo-com.svg"} alt={''} width={30} height={30} />
                                            </div>
                                            <div className='flex flex-col ml-4'>
                                                <p>Anonymous</p>
                                                <p className='text-sm text-gray-500'>Booked on
                                                    <span className='inline-block ml-2 mr-2'>
                                                        <Image
                                                            src={"/assets/movie.png"}
                                                            width={15}
                                                            height={15} alt={""}
                                                        />
                                                    </span>
                                                    ShowTime
                                                </p>
                                            </div>
                                        </div>
                                        <h1>{review.review}</h1>
                                        <div className='flex justify-between'>
                                            <p>⭐{review.rating}/5</p>
                                            <div className='flex'>

                                                <div className="edit" onClick={() => handleEditReview(review.id)}>
                                                    <Image
                                                        src={"/assets/edit-svgrepo-com.svg"}
                                                        alt={""}
                                                        width={25}
                                                        height={25}
                                                        className="m-2" />
                                                </div>

                                                <div className="delete" onClick={() => handleDeleteREview(review.id)}>
                                                    <Image
                                                        src={'/assets/delete-2-svgrepo-com.svg'}
                                                        alt={""}
                                                        width={25}
                                                        height={25}
                                                        className="m-2"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                                : <div>
                                    <p className="text-center text-gray-500">
                                        No reviews available yet.
                                    </p>
                                </div>
                        }
                    </div>
                </div>
            </div>
            <Toaster />
        </div>
    )
}

export default ReviewComponent