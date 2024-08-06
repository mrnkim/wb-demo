"use client";
import React, { useEffect, useState } from "react";
import SearchBar from "@/components/SearchBar";
import SearchResults from "@/components/SearchResults";
import Videos from "@/components/Videos";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorFallback from "../components/ErrorFallback";
import { useQuery } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";

export default function Home() {
  const [imgQuerySrc, setImgQuerySrc] = useState("");
  console.log("🚀 > Home > imgQuerySrc,=", imgQuerySrc,)
  const [uploadedImg, setUploadedImg] = useState("");
  const [updatedSearchData, setUpdatedSearchData] = useState([]);
  const [imgName, setImgName] = useState("");
  const [videoError, setVideoError] = useState(null);

  const queryClient = useQueryClient();

  const fetchSearchResults = async (imagePath) => {
    const formData = new FormData();

    if (imagePath instanceof File) {
      formData.append("file", imagePath);
    } else {
      formData.append("query", imagePath);
    }

    const response = await fetch("/api/search", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    return response.json();
  };

  const useSearchQuery = ({ queryKey, enabled }) => {
    const [key, imagePath] = queryKey;
    return useQuery({
      queryKey,
      queryFn: () => fetchSearchResults(imagePath),
      enabled,
    });
  };

  const {
    data: searchResultData,
    error: searchError,
    isLoading: searchResultsLoading,
  } = useSearchQuery({
    queryKey: ["search", uploadedImg],
    enabled: !!uploadedImg,
  });
    console.log("🚀 > Home > searchResultData=", searchResultData)

  /** Upload image as a file on image selected */
  const onImageSelected = async (src) => {
    if (typeof src === "string") {
      try {
        setImgQuerySrc(src);
        setUploadedImg(src);
        setImgName(src.split("/")[src.split("/").length-1]);
      } catch (error) {
        console.error("Error processing image URL:", error);
      }
    } else if (src instanceof File) {
      try {
        setImgQuerySrc(src);
        setUploadedImg(src);
        setImgName(src.name);
      } catch (error) {
        console.error("Error processing file upload:", error);
      }
    }
  };

  const clearImageQuery = async () => {
    setImgQuerySrc("");
    setUploadedImg("");
    setUpdatedSearchData([]);
    setImgName("");
  };

  useEffect(() => {
    queryClient.invalidateQueries({
      queryKey: ["search", uploadedImg],
    });
  }, [uploadedImg]);

  if (videoError || searchError) {
    return <ErrorFallback error={videoError || searchError} />;
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="w-full max-w-4xl">
        <SearchBar
          imgQuerySrc={imgQuerySrc}
          setImgQuerySrc={setImgQuerySrc}
          setUploadedImg={setUploadedImg}
          searchResultData={searchResultData}
          updatedSearchData={updatedSearchData}
          setUpdatedSearchData={setUpdatedSearchData}
          imgName={imgName}
          setImgName={setImgName}
          clearImageQuery={clearImageQuery}
          uploadedImg={uploadedImg}
          searchResultsLoading={searchResultsLoading}
          onImageSelected={onImageSelected}
        />
        {!searchResultData && !searchResultsLoading && (
          <Videos videoError={videoError} setVideoError={setVideoError} />
        )}
        {searchResultsLoading && (
          <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50">
            <LoadingSpinner size="lg" color="primary" />
          </div>
        )}
        {searchResultData && !searchResultsLoading && (
          <SearchResults
            searchResultData={searchResultData}
            updatedSearchData={updatedSearchData}
            setUpdatedSearchData={setUpdatedSearchData}
            uploadedImg={uploadedImg}
            searchResultsLoading={searchResultsLoading}
          />
        )}
      </div>
    </main>
  );
}
