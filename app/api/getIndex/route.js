import { NextResponse } from "next/server";

export async function GET(req) {
  // Ensure environment variables are set
  const apiKey = process.env.TWELVELABS_API_KEY;
  const indexId = process.env.TWELVELABS_INDEX_ID;

  if (!apiKey || !indexId) {
    return NextResponse.json(
      { error: "API key or Index ID is not set" },
      { status: 500 }
    );
  }

  // const client = new TwelveLabs({ apiKey });

  const url = `https://api.twelvelabs.io/tl/playground/samples/v1.2/indexes/${indexId}`;

  const options = {
    method: "GET",
    headers: {
      "Content-Type": "multipart/form-data",
      "x-api-key": `${apiKey}`,
    },
  };

  try {
    // let video = await client.index.video.retrieve(indexId, videoId);
    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const index = await response.json();

    return NextResponse.json(index);
  } catch (error) {
    return NextResponse.json(
      { error: error.message || error },
      { status: 500 }
    );
  }
}
