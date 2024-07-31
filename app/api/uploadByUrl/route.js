import { NextResponse } from "next/server";
import fetch from "node-fetch";
import { promises as fsPromises } from "fs";
import path from "path";

export async function POST(req) {
  try {
    const { url: imageUrl } = await req.json(); // Parse JSON body

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
    const imageBuffer = Buffer.from(arrayBuffer); // Convert ArrayBuffer to Buffer
    const fileName = imageUrl.split("/").pop(); // Simple method to get file name

    // Save the image to a pre-existing temporary location
    const tempDir = path.join(process.cwd(), "tmp");
    const tempFilePath = path.join(tempDir, fileName);
    console.log("🚀 > POST > tempFilePath=", tempFilePath);
    await fsPromises.writeFile(tempFilePath, imageBuffer);

    return NextResponse.json({ url: tempFilePath });
  } catch (error) {
    console.error("Error processing image URL:", error.message); // Log the error message
    return NextResponse.json(
      { error: "Error processing image URL" },
      { status: 500 }
    );
  }
}
