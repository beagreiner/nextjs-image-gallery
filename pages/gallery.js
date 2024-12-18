'use client';

import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import axios from "axios";

export default function Gallery() {
    const [images, setImages] = useState([]);

    useEffect(() => {
        // Fetch initial images from the API
        const fetchImages = async () => {
            try {
                const response = await axios.get("/images");
                setImages(response.data);
            } catch (error) {
                console.error("Error fetching images:", error);
            }
        };

        fetchImages();

        // Establish Socket.IO connection
        const socket = io("http://localhost:3000", {
            path: "/api/socket", // Ensure this matches the server's path
        });

        socket.on("connect", () => {
            console.log("Socket.IO client connected!");
        });

        socket.on("new-image", (newImage) => {
            console.log("New image received:", newImage);
            setImages((prevImages) => [newImage, ...prevImages]);
        });

        socket.on("disconnect", () => {
            console.log("Socket.IO client disconnected.");
        });

        return () => socket.disconnect(); // Cleanup on component unmount
    }, []);

    return (
        <div>
            <h1>Gallery</h1>
            <div>
                {images.map((image, index) => (
                    <img key={index} src={image} alt={`Screenshot ${index}`} width="300" />
                ))}
            </div>
        </div>
    );
}
