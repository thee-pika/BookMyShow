import WebSocket from "ws";

export class ClientManager {

    static instance: ClientManager;
    clients: Map<string, WebSocket>
    private ws: WebSocket | undefined;
    constructor() {
        this.clients = new Map<string, WebSocket>
        this.ws = this.ws;
    }

    public static getInstance(): ClientManager {
        if (!ClientManager.instance) {
            ClientManager.instance = new ClientManager();
        }
        return ClientManager.instance;
    }

    public addClient(userId: string, ws: WebSocket) {
        this.clients.set(userId, ws);
    }

    public getClient(userId: string): WebSocket | undefined {
        return this.clients.get(userId);
    }

    public removeClient(userId: string) {
        this.clients.delete(userId);
    }

    public broadcast(message: string) {
        for (const ws of this.clients.values()) {
            ws.send(message);
        }
    }
}
