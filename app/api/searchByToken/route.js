import { NextResponse } from "next/server";
import { TwelveLabs } from "twelvelabs-js";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const pageToken = searchParams.get("pageToken");
  console.log("🚀 > GET > pageToken=", pageToken);

  if (!pageToken) {
    return NextResponse.json(
      { error: "page token is required" },
      { status: 400 }
    );
  }

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
    let searchResults = await client.search.byPageToken(pageToken);
    console.log("🚀 > GET > searchResults=", searchResults);

    // Check if imageResult and imageResult.data are defined
    if (!searchResults || !searchResults.data) {
      return NextResponse.json(
        { error: "Unexpected response structure from search query" },
        { status: 500 }
      );
    }

    const pageInfo = searchResults.pageInfo || {};
    console.log("🚀 > GET > pageInfo=", pageInfo);
    return NextResponse.json({
      pageInfo,
      searchData: searchResults.data,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || error.toString() },
      { status: 500 }
    );
  }
}
