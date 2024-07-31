// app/api/serve-file/route.js
import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";

export async function GET(req) {
  const filePath = req.nextUrl.searchParams.get("file");
  console.log("🚀 > GET > filePath=", filePath);

  if (!filePath) {
    return NextResponse.json(
      { error: "File path is required" },
      { status: 400 }
    );
  }

  // Extract the filename from the full file path
  const fileName = path.basename(filePath);
  const resolvedFilePath = path.join(process.cwd(), "tmp", fileName);
  console.log("🚀 > GET > resolvedFilePath=", resolvedFilePath);

  if (!fs.existsSync(resolvedFilePath)) {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }

  // Read the file
  const fileBuffer = fs.readFileSync(resolvedFilePath);
  const contentType = "image/jpeg"; // Adjust based on file type

  return new NextResponse(fileBuffer, {
    headers: {
      "Content-Type": contentType,
      "Content-Disposition": `attachment; filename="${fileName}"`,
    },
  });
}
