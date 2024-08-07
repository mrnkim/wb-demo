import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import FormData from "form-data";

export const runtime = 'nodejs';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const apiKey = process.env.TWELVELABS_API_KEY;
    const indexId = process.env.TWELVELABS_INDEX_ID;

    if (!apiKey || !indexId) {
      return NextResponse.json(
        { error: "API key or Index ID is not set" },
        { status: 500 }
      );
    }

    const searchDataForm = new FormData();
    searchDataForm.append("search_options", "visual");
    searchDataForm.append("adjust_confidence_level", "0.55");
    searchDataForm.append("group_by", "clip");
    searchDataForm.append("threshold", "medium");
    searchDataForm.append("sort_option", "score");
    searchDataForm.append("page_limit", "12");
    searchDataForm.append("index_id", indexId);
    searchDataForm.append("query_media_type", "image");

    const imgQuerySrc = formData.get("query");
    const imgFile = formData.get("file");

    if (imgQuerySrc) {
      searchDataForm.append("query_media_url", imgQuerySrc);
    } else if (imgFile && imgFile instanceof Blob) {
      const buffer = Buffer.from(await imgFile.arrayBuffer());
      searchDataForm.append("query_media_file", buffer, imgFile.name);
    } else {
      return NextResponse.json(
        { error: "No query or file provided" },
        { status: 400 }
      );
    }

    const formDataHeaders = searchDataForm.getHeaders();
    const url =
      "https://api.twelvelabs.io/tl/playground/samples/v1.2/search-v2";

    const response = await axios.post(url, searchDataForm, {
      headers: {
        ...formDataHeaders,
        accept: "application/json",
        "x-api-key": apiKey,
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

    return NextResponse.json({ pageInfo, searchData });
  } catch (error) {
    console.error("Error in POST handler:", error);
    return NextResponse.json(
      { error: error.message || error.toString() },
      { status: 500 }
    );
  }
}
