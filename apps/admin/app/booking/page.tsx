"use client";
import Image from "next/image";
import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PropagateLoader from "react-spinners/PropagateLoader";

interface Ticket {
    id: string,
    totalPrice: number,
    movieId: string,
    userId: string,
    paymentId: string,
    imageUrl: string,
    totalSeats: number
}

const Ticket = () => {
    const [loading, setLoading] = useState(true);
    const [tickets, setTickets] = useState<Ticket[] | null>([]);
    const router = useRouter();
    const token = sessionStorage.getItem("access_token");

    if (!token) {
        router.push("/auth/login");
    }

    useEffect(() => {
        getTicket();

    }, []);

    const getTicket = async () => {
        try {
            const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/payment/ticket`, {
                withCredentials: true,
            })
            setTickets(res.data.bookings);
        } catch (error) {
            console.log("error")
            setLoading(false);
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return <div className="flex justify-center items-center h-[70vh]">
            <PropagateLoader />
        </div>
    }

    return (
        <>
            <h1 className="text-lg font-bold m-4 mx-auto">Your Tickets</h1>
            <div>
                {
                    tickets?.map((ticket) => (
                        <div className="ticket shadow-lg w-80 rounded-md ml-8" key={ticket.id}>
                            <h1 className="">Ticket</h1>
                            <div className="head flex justify-between">
                                <div className="head1 p-2 ">
                                    <Image
                                        src={ticket.imageUrl}
                                        alt={"image"}
                                        width={70}
                                        height={70}
                                    />
                                </div>
                                <div className="p-2">
                                    {ticket.movieId}
                                </div>
                            </div>
                            <div className="booking-id">
                                <p>Booking-id: {ticket.id}</p>
                            </div>
                            <div>scanner</div>
                            <div className="flex justify-between p-4">
                                <h1>totalSeats: {ticket.totalSeats}</h1>
                                <h1>Total Amount: {(ticket.totalPrice) / 100} </h1>
                            </div>
                        </div>
                    ))
                }
            </div>
        </>
    )
}

export default Ticket