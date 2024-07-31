import { NextResponse } from "next/server";
import { TwelveLabs } from "twelvelabs-js";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const videoId = searchParams.get("videoId");

  // Ensure environment variables are set
  const apiKey = process.env.TWELVELABS_API_KEY;
  const indexId = process.env.TWELVELABS_INDEX_ID;

  if (!apiKey || !indexId) {
    return NextResponse.json(
      { error: "API key or Index ID is not set" },
      { status: 500 }
    );
  }

  const client = new TwelveLabs({ apiKey });

  try {
    let video = await client.index.video.retrieve(indexId, videoId);

    return NextResponse.json({
      hls: video.hls,
      metadata: video.metadata,
      source: video.source,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || error },
      { status: 500 }
    );
  }
}
