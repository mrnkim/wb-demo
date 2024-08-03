"use client";
import React, { useEffect, useState } from "react";
import SearchBar from "@/components/SearchBar";
import SearchResults from "@/components/SearchResults";
import Videos from "@/components/Videos";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorFallback from "../components/ErrorFallback";

export default function Home() {
  const [imgQuerySrc, setImgQuerySrc] = useState("");
  const [uploadedImg, setUploadedImg] = useState("");
  const [searchResultData, setSearchResultData] = useState(null);
  console.log("🚀 > Home > searchResultData=", searchResultData);
  const [updatedSearchData, setUpdatedSearchData] = useState([]);
  const [imgName, setImgName] = useState("");
  const [searchResultsLoading, setSearchResultsLoading] = useState(false);
  const [newSearchStarted, setNewSearchStarted] = useState(false);
  const [videoError, setVideoError] = useState(null);

  console.log("🚀 > Home > newSearchStarted=", newSearchStarted);
  console.log("🚀 > Home > searchResultsLoading=", searchResultsLoading);

  const clearImageQuery = async () => {
    setImgQuerySrc("");
    setUploadedImg("");
    setSearchResultData("");
    setUpdatedSearchData("");
    setImgName("");
  };

  if (videoError) {
    return <ErrorFallback error={videoError} />;
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="w-full max-w-4xl">
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
          searchResultsLoading={searchResultsLoading}
          setSearchResultsLoading={setSearchResultsLoading}
          setNewSearchStarted={setNewSearchStarted}
          newSearchStarted={newSearchStarted}
        />
        {newSearchStarted ? (
          <LoadingSpinner />
        ) : (
          <>
            {!searchResultData && !searchResultsLoading && (
              <Videos videoError={videoError} setVideoError={setVideoError} />
            )}
            {searchResultsLoading && <LoadingSpinner />}
            {searchResultData && !searchResultsLoading && (
              <SearchResults
                imgQuerySrc={imgQuerySrc}
                uploadedImg={uploadedImg}
                searchResultData={searchResultData}
                setSearchResultData={setSearchResultData}
                updatedSearchData={updatedSearchData}
                setUpdatedSearchData={setUpdatedSearchData}
                imgName={imgName}
                searchResultsLoading={searchResultsLoading}
                setSearchResultsLoading={setSearchResultsLoading}
              />
            )}
          </>
        )}
      </div>
    </main>
  );
}
