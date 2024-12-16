'use client';

import html2canvas from "html2canvas";
import axios from "axios";
import { useState } from "react";

export default function Home() {
    const [status, setStatus] = useState("");

    const takeScreenshot = async () => {
        setStatus("Capturing...");
        const canvas = await html2canvas(document.body);
        const dataUrl = canvas.toDataURL("image/png");
        const blob = await (await fetch(dataUrl)).blob();

        const formData = new FormData();
        formData.append("file", blob, "screenshot.png");

        setStatus("Uploading...");
        try {
            await axios.post("/upload", formData);
            setStatus("Screenshot uploaded successfully!");
        } catch (error) {
            console.error(error);
            setStatus("Upload failed.");
        }
    };

    return (
        <div>
            <h1>Take Screenshot</h1>
            <button onClick={takeScreenshot}>Capture and Upload</button>
            <p>{status}</p>
        </div>
    );
}
