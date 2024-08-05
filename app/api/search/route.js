import { NextResponse } from "next/server";
import * as fs from "fs";
import FormData from "form-data";
import axios from "axios";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const imgQuerySrc = searchParams.get("query");

  if (!imgQuerySrc) {
    return NextResponse.json(
      { error: "Query parameter is required" },
      { status: 400 }
    );
  }

  const apiKey = process.env.TWELVELABS_API_KEY;
  const indexId = process.env.TWELVELABS_INDEX_ID;

  if (!apiKey || !indexId) {
    return NextResponse.json(
      { error: "API key or Index ID is not set" },
      { status: 500 }
    );
  }

  try {
    const formData = new FormData();
    formData.append("search_options", "visual");
    formData.append("adjust_confidence_level", "0.55");
    formData.append("group_by", "clip");
    formData.append("threshold", "medium");
    formData.append("sort_option", "score");
    formData.append("page_limit", "12");
    formData.append("index_id", indexId);
    formData.append("query_media_type", "image");

    if (imgQuerySrc.startsWith("http")) {
      formData.append("query_media_url", imgQuerySrc);
    } else {
      const filePath = imgQuerySrc;
      if (!fs.existsSync(filePath)) {
        throw new Error(`File not found: ${filePath}`);
      }
      formData.append("query_media_file", fs.createReadStream(filePath));
    }

    const formDataHeaders = formData.getHeaders();

    const url =
      "https://api.twelvelabs.io/tl/playground/samples/v1.2/search-v2";

    const response = await axios.post(url, formData, {
      headers: {
        ...formDataHeaders,
        accept: "application/json",
        "x-api-key": apiKey,
        "Content-Type": "multipart/form-data",
      },
    });

    const imageResult = response.data;

    if (!imageResult || !imageResult.data) {
      return NextResponse.json(
        { error: "Unexpected response structure from search query" },
        { status: 500 }
      );
    }

    const searchData = imageResult.data;
    const pageInfo = imageResult.page_info || {};

    return NextResponse.json({
      pageInfo,
      searchData,
    });
  } catch (error) {
    console.error("Error in GET handler:", error);
    return NextResponse.json(
      { error: error.message || error.toString() },
      { status: 500 }
    );
  }
}
