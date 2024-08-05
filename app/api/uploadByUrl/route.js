import { NextResponse } from "next/server";
import fetch from "node-fetch";
import { promises as fsPromises } from "fs";
import path from "path";

export async function POST(req) {
  try {
    const { url: imageUrl } = await req.json(); 

    if (!imageUrl) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    const response = await fetch(imageUrl);
    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch image" },
        { status: response.status }
      );
    }

    const arrayBuffer = await response.arrayBuffer();
    const imageBuffer = Buffer.from(arrayBuffer);
    const fileName = imageUrl.split("/").pop();

    const tempDir = path.join(process.cwd(), "tmp");
    const tempFilePath = path.join(tempDir, fileName);
    await fsPromises.writeFile(tempFilePath, imageBuffer);

    return NextResponse.json({ downloadUrl: tempFilePath });
  } catch (error) {
    console.error("Error processing image URL:", error.message);
    return NextResponse.json(
      { error: "Error processing image URL" },
      { status: 500 }
    );
  }
}
