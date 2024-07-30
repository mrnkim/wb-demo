"use client";
import React, { useState } from "react";
import SearchBar from "@/components/SearchBar";
import SearchResults from "@/components/SearchResults";
import Videos from "@/components/Videos";

export default function Home() {
  const [imgQuerySrc, setImgQuerySrc] = useState("");
  const [uploadedImg, setUploadedImg] = useState("");
  const [searchResultData, setSearchResultData] = useState(null);
  console.log("🚀 > Home > searchResultData=", searchResultData);
  const [updatedSearchData, setUpdatedSearchData] = useState([]);
  console.log("🚀 > Home > updatedSearchData=", updatedSearchData)
  const [imgName, setImgName] = useState("");

  const clearImageQuery = async () => {
    setImgQuerySrc("");
    setUploadedImg("");
    setSearchResultData("");
    setUpdatedSearchData("");
    setImgName("");
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
        imgName={imgName}
        setImgName={setImgName}
        clearImageQuery={clearImageQuery}
        uploadedImg={uploadedImg}
      />
      {!uploadedImg && <Videos />}
      {uploadedImg && searchResultData && (
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
