import fs from "fs";
import path from "path";

export const POST = async (req) => {
    try {
        const uploadsDir = path.join(process.cwd(), "public", "uploads");
        if (!fs.existsSync(uploadsDir)) {
            fs.mkdirSync(uploadsDir, { recursive: true });
        }

        const formData = await req.formData();
        const file = formData.get("file");

        const buffer = Buffer.from(await file.arrayBuffer());
        const fileName = `screenshot-${Date.now()}.png`;
        const filePath = path.join(uploadsDir, fileName);

        fs.writeFileSync(filePath, buffer);

        return new Response(JSON.stringify({ success: true, url: `/uploads/${fileName}` }), {
            status: 200,
        });
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ success: false, error: "Failed to save file" }), {
            status: 500,
        });
    }
};
