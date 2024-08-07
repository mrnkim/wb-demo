"use client";
import React, { useEffect, useState } from "react";
import SearchBar from "@/components/SearchBar";
import SearchResults from "@/components/SearchResults";
import Videos from "@/components/Videos";
import ErrorFallback from "../components/ErrorFallback";
import LoadingSpinner from "../components/LoadingSpinner";
import { useQuery } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";

export default function Home() {
  const [imgQuerySrc, setImgQuerySrc] = useState("");
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

  const {
    data: searchResultData,
    error: searchError,
    isLoading: searchResultsLoading,
  } = useQuery({
    queryKey: ["search", imgName],
    queryFn: () => fetchSearchResults(imgQuerySrc),
    enabled: !!imgQuerySrc,
    keepPreviousData: true,
  });

  useEffect(() => {
    queryClient.invalidateQueries(["search", imgQuerySrc]);
  }, [imgQuerySrc, queryClient]);

  const onImageSelected = async (src) => {
    setImgQuerySrc(null);
    setUpdatedSearchData([]);

    if (typeof src === "string") {
      setImgQuerySrc(src);
      setImgName(src.split("/").pop());
    } else if (src instanceof File) {
      setImgQuerySrc(src);
      setImgName(src.name);
    }
  };

  const clearImageQuery = () => {
    setImgQuerySrc("");
    setUpdatedSearchData([]);
    setImgName("");
  };

  if (videoError || searchError) {
    return <ErrorFallback error={videoError || searchError} />;
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="w-full max-w-4xl">
        <SearchBar
          imgQuerySrc={imgQuerySrc}
          setImgQuerySrc={setImgQuerySrc}
          searchResultData={searchResultData}
          updatedSearchData={updatedSearchData}
          setUpdatedSearchData={setUpdatedSearchData}
          imgName={imgName}
          setImgName={setImgName}
          clearImageQuery={clearImageQuery}
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
            imgQuerySrc={imgQuerySrc}
            searchResultsLoading={searchResultsLoading}
          />
        )}
      </div>
    </main>
  );
}
