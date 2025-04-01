"use client";
import { useEffect, useState } from "react"
import axios from "axios";
import { useParams } from "next/navigation";
import RenderRazorpay from "../../../components/razorpay/RenderRazorpay";
import io from "socket.io-client";
import PropagateLoader from "react-spinners/PropagateLoader";

const ChooseSeats = () => {

    const { id } = useParams();
    const [displayRazorpay, setDisplayRazorpay] = useState(false);
    const [totalSeats, setTotalSeats] = useState(0);
    const [selectedSeats, setselectedSeats] = useState<number[]>([]);
    const [pendingSeats, setpendingSeats] = useState<number[]>([]);
    const [bookedSeats, setBookedSeats] = useState<number[]>([]);
    const [loading, setLoading] = useState(true);

    const [orderDetails, setorderDetails] = useState({
        orderId: "",
        currency: null,
        amount: 0,
        keyId: ""
    })

    const [seatPrice, setSeatPrice] = useState(0);

    // const [seats, setSeats] = useState({
    //     seatCount: 0,
    //     type: ""
    // })

    useEffect(() => {
        const socket = io("http://localhost:8000");

        socket.on("connect", () => {

            socket.emit("register", id);

            socket.on("booking_update", (data) => {

                if (data) {
                  
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
    
    const getMovie = async () => {
        try {
            const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/movie/${id}`);
            setSeatPrice(res.data.movie.seatPrice);
            setTotalSeats(res.data.movie.totalSeats);
    
            const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/movie/${id}/seats`);
          
            setBookedSeats(response.data.seats);
            setpendingSeats(response.data.pendingSeats);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
           setLoading(false) 
        } finally {
            setLoading(false) 
        }
    }


    useEffect(() => {
        getMovie();
    }, []);

    if (loading) {
        return <div className="flex justify-center items-center h-[70vh]">
          <PropagateLoader />
        </div>
      }

    const createOrder = async (amount: number) => {
       await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/payment/book`, {
            amount,
            queueName: id,
            seats: selectedSeats

        }, {
            withCredentials: true,
        })

    }

    const toggleSeatSelection = (seatNumber: number) => {
        setselectedSeats((prev) => selectedSeats.includes(seatNumber)
            ?
            selectedSeats.filter((seatNo) => seatNo !== seatNumber)
            : [...prev, seatNumber])

    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>): Promise<void> {
        e.preventDefault();
       
        try {

            const amount = selectedSeats.length * seatPrice;

            if (amount > 0) {
                await createOrder(amount);
            } 

        } catch (error) {
          
        }
    }

    return (
        <>
            <div className="w-3xl mx-auto m-4 ">
                <h1 className="m-4 p-4 font-bold text-xl">Choose How many Seats Do You want ?</h1>
                <div className="grid grid-cols-10 gap-4 mb-4">
                    {Array.from({ length: totalSeats }).map((_, index) => {
                        const seatNumber = index + 1;
                        const isAlreadyBooked = bookedSeats.includes(seatNumber) || pendingSeats.includes(seatNumber);
                        const isSelected = selectedSeats.includes(seatNumber);
                        
                        return (
                            <div
                                key={seatNumber}
                                className={`border p-2 text-center rounded cursor-pointer ${!isAlreadyBooked
                                    ? isSelected
                                        ? "bg-green-500 text-white"
                                        : "bg-white"
                                    : "bg-red-700 text-gray-100 cursor-not-allowed"
                                    }`}
                                onClick={() => !isAlreadyBooked && toggleSeatSelection(seatNumber)}
                            >
                                <input
                                    type="checkbox"
                                    className="hidden"
                                    checked={isSelected}
                                    readOnly
                                />
                                {seatNumber}
                            </div>
                        );
                    })}
                </div>
                <div className="w-full flex">
                    <form onSubmit={handleSubmit}>
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

