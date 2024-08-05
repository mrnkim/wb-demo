import { NextResponse } from "next/server";
import { promises as fsPromises } from "fs";
import path from "path";

export async function POST(req) {
  const formData = await req.formData();
  const file = formData.get("file");

  if (!file) {
    return NextResponse.json({ error: "File is required" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const tempDir = path.join(process.cwd(), "tmp");

  await fsPromises.mkdir(tempDir, { recursive: true });

  const tempFilePath = path.join(tempDir, file.name);
  await fsPromises.writeFile(tempFilePath, buffer);

  return NextResponse.json({ url: tempFilePath });
}
