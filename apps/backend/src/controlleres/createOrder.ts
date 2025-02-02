
import { razorpay } from "../routes/v1/paymentRouter.js";

interface Options {
    amount: number,
    currency: string,
    receipt: string,
    payment_capture: number
}

const createOrder = async ({ options }: { options: Options }) => {
    const optionsRzpy = {
        amount: options.amount,
        currency: options.currency,
        receipt: options.receipt,
        payment_capture: options.payment_capture
    }

    try {
        const response = await razorpay.orders.create(optionsRzpy);

        return {
            order_id: response.id,
            currency: response.currency,
            amount: response.amount,
            keyId: process.env.RAZORPAY_KEY_ID!
        }

    } catch (error) {
        console.log("error", error);
    }
}

export default createOrder