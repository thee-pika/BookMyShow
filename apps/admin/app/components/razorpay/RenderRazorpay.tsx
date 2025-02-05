import axios from "axios";
import { useEffect } from "react";

interface RenderRazorpayProps {
    orderId: string;
    currency: string | null;
    amount: number;
    keyId: string;
}

const loadScript = (src: string) => new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = src;

    script.onload = () => {
        console.log('razorpay loaded successfully');
        resolve(true);
    };

    script.onerror = () => {
        console.log('error in loading razorpay');
        resolve(false);
    };

    document.body.appendChild(script);
});

const displayRazorpay = async (options: any) => {

    const res = await loadScript(
        'https://checkout.razorpay.com/v1/checkout.js',
    );

    if (res) {
        const rzpy = new window.Razorpay(options);
        rzpy.open()
    }
}

const generateTicket = async (response: any) => {
    // const res = await axios.post(
    //     `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/payment/booking`, {

    //     }
    // );
    console.log("response,", response);
}

const RenderRazorpay = ({ orderDetails }: { orderDetails: RenderRazorpayProps }) => {
    useEffect(() => {
        console.log("ordr detailssssssssssssssssssssss", orderDetails);
        const options = {
            key: orderDetails.keyId,
            amount: orderDetails.amount,
            currency: orderDetails.currency,
            name: 'amit',
            order_id: orderDetails.orderId,

            handler: (response: any) => {
                generateTicket(response);
            },
            prefill: {
                "name": "Gaurav Kumar",
            }
        };

        displayRazorpay(options)
    }, [])
    return null;
}

export default RenderRazorpay;

declare global {
    interface Window {
        Razorpay: any
    }
}


