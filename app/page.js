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

  //TODO: Merge with uploadImage in SelectedImageDisplay.js
  const onImageSelected = async (src) => {
    setSearchResultsLoading(true); // Start loading
    if (typeof src === "string") {
      // src is an image URL; download and upload the image
      try {
        // Proxy the image request through your server
        const response = await fetch("/api/uploadByUrl", {
          method: "POST",
          body: JSON.stringify({ url: src }),
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          console.error("Failed to fetch image through proxy");
          return;
        }

        const { downloadUrl } = await response.json(); // Get fileName from response
        const fileName = downloadUrl.split("/").pop(); // Simple method to get file name

        setImgQuerySrc(downloadUrl);
        setUploadedImg(downloadUrl);
        setImgName(fileName);
      } catch (error) {
        console.error("Error processing image URL:", error);
      }
    } else if (src instanceof File) {
      try {
        const formData = new FormData();
        formData.append("file", src);

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          console.error("Failed to upload image");
          return;
        }

        const { url } = await response.json();
        setImgQuerySrc(src);
        setUploadedImg(url);
        setImgName(src.name);
      } catch (error) {
        console.error("Error processing file upload:", error);
      }
    }
  };

  const searchImage = async (imagePath) => {
    setSearchResultsLoading(true);
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
    } finally {
      setSearchResultsLoading(false);
      setNewSearchStarted(false);
    }
  };

  useEffect(() => {
    if (!uploadedImg) return;
    searchImage(uploadedImg);
  }, [uploadedImg]);

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
          onImageSelected={onImageSelected}
          searchImage={searchImage}
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
