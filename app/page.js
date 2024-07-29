"use client";
import React, { useState } from "react";
import SearchBar from "@/components/SearchBar";
import SearchResults from "@/components/SearchResults";
import Videos from "@/components/Videos";

export default function Home() {
  const [imgQuerySrc, setImgQuerySrc] = useState("");
  const [uploadedImg, setUploadedImg] = useState("");
  const [searchResultData, setSearchResultData] = useState(null);
  console.log("🚀 > Home > searchResultData=", searchResultData)
  const [updatedSearchData, setUpdatedSearchData] = useState([]);
  const [imgName, setImgName] = useState("");

  const clearImageQuery = async () => {
    setImgName("");
    setImgQuerySrc("");
  };

  const searchImage = async (imagePath) => {
    // setIsLoading(true);
    // setError(null);
    try {
      const response = await fetch(
        `/api/search?query=${encodeURIComponent(imagePath)}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const result = await response.json();
      setSearchResultData(result);
    } catch (error) {
      console.error(error);
      // setError(error.message);
    }
    // finally {
    //   setIsLoading(false);
    // }
  };

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
        searchImage={searchImage}
        imgName={imgName}
        setImgName={setImgName}
        clearImageQuery={clearImageQuery}
      />
      {!uploadedImg && <Videos />}
      {uploadedImg && (
        <SearchResults
          imgQuerySrc={imgQuerySrc}
          uploadedImg={uploadedImg}
          searchResultData={searchResultData}
          setSearchResultData={setSearchResultData}
          updatedSearchData={updatedSearchData}
          setUpdatedSearchData={setUpdatedSearchData}
          searchImage={searchImage}
          imgName={imgName}
        />
      )}
    </main>
  );
}
