import { NextResponse } from "next/server";
import axios from "axios";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const imageUrl = searchParams.get("url");
  console.log("🚀 > GET > imageUrl=", imageUrl)

  if (!imageUrl) {
    return NextResponse.json(
      { error: "URL parameter is required" },
      { status: 400 }
    );
  }

  try {
    const response = await axios.get(imageUrl, {
      responseType: "arraybuffer",
    });
    console.log("🚀 > GET > response=", response)

    const headers = {
      "Content-Type": response.headers["content-type"],
      "Content-Length": response.headers["content-length"],
    };

    return new NextResponse(response.data, {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error("Error fetching image:", error);
    return NextResponse.json(
      { error: "Failed to fetch image" },
      { status: 500 }
    );
  }
}
