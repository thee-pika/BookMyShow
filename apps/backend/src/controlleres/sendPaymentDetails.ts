import { ClientManager } from "@repo/ws/ws";

export const sendPaymentDetails = (userId: string, paymentDetails: any) => {
    const webSocket = ClientManager.getInstance().getClient(userId);
    if (webSocket) {
        webSocket.send(paymentDetails);
    } else {
        console.log("user not connected!!");
    }
}