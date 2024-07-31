import { NextResponse } from "next/server";
import { TwelveLabs, SearchData } from "twelvelabs-js";
import * as fs from "fs";
import path from "path";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const imgQuerySrc = searchParams.get("query");
  const searchData = [];

  if (!imgQuerySrc) {
    return NextResponse.json(
      { error: "Query parameter is required" },
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
    const options = {
      indexId,
      queryMediaFile: fs.createReadStream(imgQuerySrc),
      queryMediaType: "image",
      options: ["visual"],
      threshold: "medium",
      adjustConfidenceLevel: "0.6",
    };

    if (!path.isAbsolute(imgQuerySrc)) {
      options.queryMediaUrl = imgQuerySrc; // Ensure the URL is set properly for URL-based query
      delete options.queryMediaFile; // Remove the file-based query option
    }

    // Perform the search query using the image buffer
    const imageResult = await client.search.query(options);

    // Check if imageResult and imageResult.data are defined
    if (!imageResult || !imageResult.data) {
      return NextResponse.json(
        { error: "Unexpected response structure from search query" },
        { status: 500 }
      );
    }

    searchData.push(...imageResult.data);

    // Ensure next() method and pageInfo are available
    while (imageResult.next) {
      const nextPageDataByImage = await imageResult.next();
      if (nextPageDataByImage) {
        searchData.push(...nextPageDataByImage);
      } else {
        break;
      }
    }

    // Ensure pageInfo is available
    const pageInfo = imageResult.pageInfo || {};
    return NextResponse.json({
      pageInfo,
      searchData,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || error.toString() },
      { status: 500 }
    );
  }
}
