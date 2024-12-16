import { WebSocketServer } from "ws";

let clients = []; // Store connected WebSocket clients

export default function handler(req, res) {
    if (!res.socket.server.wss) {
        console.log("Initializing WebSocket Server...");

        // Initialize WebSocket Server
        const wss = new WebSocketServer({ noServer: true });
        res.socket.server.wss = wss;

        // Handle WebSocket upgrade requests
        res.socket.server.on("upgrade", (request, socket, head) => {
            console.log("WebSocket upgrade received...");
            wss.handleUpgrade(request, socket, head, (ws) => {
                console.log("WebSocket connection established!");
                wss.emit("connection", ws, request);
            });
        });

        // Manage WebSocket connections
        wss.on("connection", (ws) => {
            console.log("Client connected!");
            clients.push(ws);

            ws.on("message", (message) => {
                console.log("Message received:", message);
            });

            ws.on("close", () => {
                console.log("Client disconnected.");
                clients = clients.filter((client) => client !== ws);
            });
        });
    } else {
        console.log("WebSocket Server already initialized.");
    }

    res.end(); // Complete the HTTP response
}

// Broadcast images to all connected clients
export function broadcastImage(image) {
    clients.forEach((client) => {
        if (client.readyState === 1) {
            client.send(JSON.stringify(image));
        }
    });
}
