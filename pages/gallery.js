'use client';

import { useEffect, useState } from "react";
import axios from "axios";

export default function Gallery() {
    const [images, setImages] = useState([]);

    useEffect(() => {
        const fetchImages = async () => {
            const response = await axios.get("/images");
            setImages(response.data);
        };

        fetchImages();

        const socket = new WebSocket("ws://localhost:3000/api/socket");

        socket.onopen = () => {
            console.log("WebSocket connected!");
        };

        socket.onmessage = (event) => {
            console.log("Message from server:", event.data);
        };

        socket.onerror = (error) => {
            console.error("WebSocket error:", error);
        };

        socket.onclose = () => {
            console.log("WebSocket connection closed.");
        };

        return () => socket.close();
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
