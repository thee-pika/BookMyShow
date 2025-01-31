import { WebSocketServer } from 'ws';
import { ClientManager } from './clientManager.js';

const wss = new WebSocketServer({ port: 3001 });

wss.on('connection', function connection(ws) {
  let client = new ClientManager(ws);
  ws.on('error', (err) => console.error('WebSocket Error:', err));

  ws.on('close', () => {
    console.log("ws is closedddddddddd");
  })
});
