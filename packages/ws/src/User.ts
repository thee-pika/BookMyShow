import { WebSocket, WebSocketServer } from 'ws';
import { ClientManager } from './clientManager.js';

class User {

    public clients: Map<string, WebSocket>;
    private ws: WebSocket;

    constructor() {
        this.clients = new Map<string, WebSocket>
        this.ws = ws;
    }
    
    if(this.ws) {
        const clientManager = ClientManager.getInstance();
        this.ws.on('message', (data:any) => {
            const parsedData = JSON.parse(data.toString());
            const { type, userId } = parsedData;

            if (type === "register") {
                clientManager.addClient(userId, ws);
                console.log(`User registered with ID: ${userId}`);
            } else {
                console.log('Received message:', data);
            }
        });
    }
};
