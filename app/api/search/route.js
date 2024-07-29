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

  const client = new TwelveLabs({ apiKey: process.env.TWELVELABS_API_KEY });

  try {
    // Determine the correct image path
    const imagePath = path.isAbsolute(imgQuerySrc)
      ? imgQuerySrc
      : path.join(process.cwd(), imgQuerySrc);

    const options = {
      indexId: process.env.TWELVELABS_INDEX_ID,
      queryMediaFile: fs.createReadStream(imagePath),
      queryMediaType: "image",
      options: ["visual", "conversation"],
      threshold: "high",
      // adjustConfidenceLevel: "0.55",
    };

    // Perform the search query using the image buffer
    const imageResult = await client.search.query(options);
    searchData.push(...imageResult.data);

    let nextPageDataByImage = await imageResult.next();
    while (nextPageDataByImage !== null) {
      nextPageDataByImage.forEach((clip) => {
        searchData.push(clip);
      });
      nextPageDataByImage = await imageResult.next();
    }

    return NextResponse.json({
      pageInfo: imageResult.pageInfo,
      searchData,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || error },
      { status: 500 }
    );
  }
}
