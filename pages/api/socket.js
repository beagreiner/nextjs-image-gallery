import { Server } from "socket.io";

let io; // Declare Socket.IO instance

export function getSocketIOInstance(server) {
    if (!io) {
        console.log("Manually initializing Socket.IO server...");
        io = new Server(server, {
            path: "/api/socket",
            cors: {
                origin: "http://localhost:3000",
                methods: ["GET", "POST"],
            },
        });

        io.on("connection", (socket) => {
            console.log("Client connected:", socket.id);
            console.log('aaa');
            socket.on("disconnect", () => {
                console.log("Client disconnected:", socket.id);
            });
        });
        console.log('bbb');
    }
    console.log('ccc');
    console.log(io);
    return io;
}

export default function handler(req, res) {
    if (!res.socket.server.io) {
        res.socket.server.io = getSocketIOInstance(res.socket.server);
    }
    res.end();
}

export function broadcastImage(image) {
    const clientFriendlyUrl = image.url.replace(/^.*\/public/, ""); // Strip '/home/...' up to '/public'
    console.log("Broadcasting new image:", clientFriendlyUrl);
    const payload = { url: clientFriendlyUrl };
    console.log('broadcastImage', io);
    if (io) {
        io.emit("new-image", payload);
    } else {
        console.error("Socket.IO instance is not initialized.");
    }
}
