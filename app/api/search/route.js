import { NextResponse } from "next/server";
import { TwelveLabs, SearchData } from "twelvelabs-js";
import fs from "fs/promises";
import path from "path";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const imgQuerySrc = searchParams.get("query");
  console.log("🚀 > GET > imgQuerySrc=", imgQuerySrc);

  if (!imgQuerySrc) {
    return NextResponse.json(
      { error: "Query parameter is required" },
      { status: 400 }
    );
  }

  const client = new TwelveLabs({ apiKey: process.env.TWELVELABS_API_KEY });

  try {
    // Determine the correct image path
    const imagePath = path.isAbsolute(imgQuerySrc)
      ? imgQuerySrc
      : path.join(process.cwd(), imgQuerySrc);

    console.log("🚀 > GET > imagePath=", imagePath);

    // const imageBuffer = await fs.readFile(imagePath);
    // console.log("🚀 > GET > imageBuffer=", imageBuffer);

    // Ensure the image file exists
    const fileExists = await fs
      .access(imagePath)
      .then(() => true)
      .catch(() => false);
    if (!fileExists) {
      throw new Error(`File does not exist at path: ${imagePath}`);
    }

    // Read the image file as a stream
    const imageStream = fs.createReadStream(imagePath);

    const options = {
      indexId: process.env.TWELVELABS_INDEX_ID,
      queryMediaFile: imageStream,
      queryMediaType: "image",
      options: ["visual", "conversation"], // Add the required options
    };
    console.log("🚀 > GET > options=", options);
    // Perform the search query using the image buffer
    const imageResult = await client.search.query(options);
    console.log("🚀 > GET > imageResult=", imageResult);

    // Log the results
    imageResult.data.forEach((clip) => {
      console.log(
        `  score=${clip.score} start=${clip.start} end=${clip.end} confidence=${clip.confidence}`
      );
    });

    let nextPageDataByImage = await imageResult.next();
    while (nextPageDataByImage !== null) {
      nextPageDataByImage.forEach((clip) => {
        console.log(
          `  score=${clip.score} start=${clip.start} end=${clip.end} confidence=${clip.confidence}`
        );
      });
      nextPageDataByImage = await imageResult.next();
    }

    return NextResponse.json({
      message: "Index retrieved, check console",
      index: imageResult.index,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
