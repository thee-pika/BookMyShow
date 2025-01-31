"use client";
import { useEffect, useState } from "react"
import axios from "axios";
import { useParams } from "next/navigation";
import RenderRazorpay from "../../../components/razorpay/RenderRazorpay";
import io from "socket.io-client";

const ChooseSeats = () => {

    const { id } = useParams();
    useEffect(() => {
        const socket = io("http://localhost:8000");

        socket.on("connect", () => {
            console.log("connected to the websocket");

            socket.emit("register", id);

            socket.on("booking_update", (data) => {
                console.log("something is printend ddddddddddddd");
                if (data) {
                    console.log("data", data);
                    setorderDetails({
                        ...orderDetails,
                        orderId: data.orderId,
                        currency: data.currency,
                        keyId: data.keyId,
                        amount: data.amount
                    })
                    setDisplayRazorpay(true);
                }
            })
        })

    }, [id])

    const [displayRazorpay, setDisplayRazorpay] = useState(false);
    const [orderDetails, setorderDetails] = useState({
        orderId: "",
        currency: null,
        amount: 0,
        keyId: ""
    })

    const [seatPrice, setSeatPrice] = useState(0);

    const [seats, setSeats] = useState({
        seatCount: 0,
        type: ""
    })

    useEffect(() => {
        getMovie();
    }, [])

    const createOrder = async (amount: number) => {
        const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/payment/book`, {
            amount,
            queueName: id
        }, {
            withCredentials: true,
        })

        if (res.statusText === "OK") {
            console.log("im innnn", res);
        }
    }

    const getMovie = async () => {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/movie/${id}`);
        console.log("seatPrice", res.data.movie.seatPrice);
        setSeatPrice(res.data.movie.seatPrice);
        console.log("updated seatprice", seatPrice)
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>): Promise<void> {
        e.preventDefault();
        try {

            const amount = seats.seatCount * seatPrice;

            if (amount > 0) {
                await createOrder(amount);
            } else {
                alert("amount is low......");
            }

        } catch (error) {
            console.log("erro", error);
        }
    }

    return (
        <>
            <div className="w-3xl mx-auto m-4 ">
                <h1>Choose How many Seats Do You want ?</h1>
                <div className="w-full flex">
                    <form onSubmit={handleSubmit}>
                        <input
                            type="number"
                            className="p-2 border border-gray-300 rounded"
                            onChange={(e) => setSeats({ ...seats!, seatCount: parseInt(e.target.value) })}
                            value={seats.seatCount}
                        />
                        <input
                            type="text"
                            className="p-2 border border-gray-300 rounded"
                            onChange={(e) => setSeats({ ...seats!, type: e.target.value })}
                            value={seats.type}
                            placeholder="Type of Seat"
                        />
                        <button
                            type="submit"
                            className="w-full px-4 m-4 mt-12 py-2 bg-[#cc0a31] text-white rounded hover:bg-[#cc0a0a67]"
                        > Pay </button>
                    </form>
                    {
                        displayRazorpay && <RenderRazorpay orderDetails={orderDetails} />
                    }
                </div>
            </div>
        </>
    )
}

export default ChooseSeats

