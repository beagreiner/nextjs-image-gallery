import fs from "fs";
import path from "path";

export const GET = async () => {
    try {
        const uploadsDir = path.join(process.cwd(), "public", "uploads");
        if (!fs.existsSync(uploadsDir)) {
            return new Response(JSON.stringify([]), { status: 200 });
        }

        const files = fs.readdirSync(uploadsDir).map((file) => `/uploads/${file}`);
        return new Response(JSON.stringify(files), { status: 200 });
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ error: "Failed to fetch images" }), { status: 500 });
    }
};
