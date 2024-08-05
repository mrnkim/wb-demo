import { NextResponse } from "next/server";
import axios from "axios";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const pageToken = searchParams.get("pageToken");

  if (!pageToken) {
    return NextResponse.json(
      { error: "Page token is required" },
      { status: 400 }
    );
  }

  const apiKey = process.env.TWELVELABS_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ error: "API key is not set" }, { status: 500 });
  }

  const url = `https://api.twelvelabs.io/tl/playground/samples/v1.2/search-v2/${pageToken}`;

  try {
    const response = await axios.get(url, {
      headers: {
        accept: "application/json",
        "x-api-key": apiKey,
      },
    });

    const searchResults = response.data;

    if (!searchResults || !searchResults.data) {
      return NextResponse.json(
        { error: "Unexpected response structure from search query" },
        { status: 500 }
      );
    }

    const pageInfo = searchResults.page_info || {};
    return NextResponse.json({
      pageInfo,
      searchData: searchResults.data,
    });
  } catch (error) {
    console.error("Error in GET handler:", error);
    return NextResponse.json(
      { error: error.message || error.toString() },
      { status: 500 }
    );
  }
}
