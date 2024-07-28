"use client";
import React, { useState } from "react";
import SearchBar from "@/components/SearchBar";
import SearchResults from "@/components/SearchResults";
import Videos from "@/components/Videos";

export default function Home() {
  const [imgQuerySrc, setImgQuerySrc] = useState("");

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <SearchBar imgQuerySrc={imgQuerySrc} setImgQuerySrc={setImgQuerySrc} />
      <Videos />
      {imgQuerySrc && <SearchResults />}
    </main>
  );
}
