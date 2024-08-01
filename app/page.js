"use client";
import React, { useEffect, useState } from "react";
import SearchBar from "@/components/SearchBar";
import SearchResults from "@/components/SearchResults";
import Videos from "@/components/Videos";

export default function Home() {
  const [imgQuerySrc, setImgQuerySrc] = useState("");
  const [uploadedImg, setUploadedImg] = useState("");
  const [searchResultData, setSearchResultData] = useState(null);
  const [updatedSearchData, setUpdatedSearchData] = useState([]);
  const [imgName, setImgName] = useState("");
  const [videos, setVideos] = useState(null)

  const clearImageQuery = async () => {
    setImgQuerySrc("");
    setUploadedImg("");
    setSearchResultData("");
    setUpdatedSearchData("");
    setImgName("");
  };

  const fetchVideos = async () => {
    try {
      const response = await fetch(`api/getVideos`);

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const result = await response.json();
      console.log("🚀 > fetchVideos > result=", result);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <SearchBar
        imgQuerySrc={imgQuerySrc}
        setImgQuerySrc={setImgQuerySrc}
        setUploadedImg={setUploadedImg}
        searchResultData={searchResultData}
        setSearchResultData={setSearchResultData}
        updatedSearchData={updatedSearchData}
        setUpdatedSearchData={setUpdatedSearchData}
        imgName={imgName}
        setImgName={setImgName}
        clearImageQuery={clearImageQuery}
        uploadedImg={uploadedImg}
      />
      {!uploadedImg && <Videos videos={videos} />}
      {searchResultData && (
        <SearchResults
          imgQuerySrc={imgQuerySrc}
          uploadedImg={uploadedImg}
          searchResultData={searchResultData}
          setSearchResultData={setSearchResultData}
          updatedSearchData={updatedSearchData}
          setUpdatedSearchData={setUpdatedSearchData}
          imgName={imgName}
        />
      )}
    </main>
  );
}
