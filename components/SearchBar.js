"use client";
import React, { useEffect, useState } from "react";
import SearchByImageButtonAndModal from "./SearchByImageButtonAndModal";
import SelectedImageDisplay from "./SelectedImageDisplay";
import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchSearchResults } from "../app/utils/fetchSearchReuslts";
import SearchResults from "./SearchResults";

const SearchBar = ({
  imgQuerySrc,
  setImgQuerySrc,
  setUploadedImg,
  searchResultData,
  setSearchResultData,
  updatedSearchData,
  setUpdatedSearchData,
  imgName,
  setImgName,
  clearImageQuery,
  uploadedImg,
}) => {


  // Use useInfiniteQuery for paginated search results
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useInfiniteQuery({
      queryKey: ["searchResults", imgName],
      queryFn: ({ pageParam = 1 }) =>
        fetchSearchResults({
          query: imgName,
          imagePath: uploadedImg,
          pageParam,
        }),
      getNextPageParam: (lastPage) => {
        const { pageInfo } = lastPage;
        return pageInfo.hasNextPage ? pageInfo.nextPage : false;
      },
      enabled: !!uploadedImg, // Only enable the query if uploadedImg is available
    });

  console.log("🚀 > data=", data);

  // Handle image selection and upload
  const onImageSelected = async (src) => {
    if (src instanceof File) {
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
    }
  };

  return (
    <div className="w-full max-w-4xl h-14 py-3 bg-white border-b-2 border-[#e5e6e4] flex justify-between items-center">
      <div className="flex items-center">
        <div className="w-8 h-14 flex items-center gap-1 ml-4">
          <div className="w-6 h-6">
            {!imgQuerySrc && (
              <img src="/SearchVideoLeft.svg" alt="Search Icon" />
            )}
          </div>
          {imgQuerySrc && (
            <SelectedImageDisplay
              imgQuerySrc={imgQuerySrc}
              setImgQuerySrc={setImgQuerySrc}
              imgName={imgName}
              setImgName={setImgName}
              unselectImage={clearImageQuery}
              setUploadedImg={setUploadedImg}
              searchResultData={searchResultData}
              setSearchResultData={setSearchResultData}
              updatedSearchData={updatedSearchData}
              setUpdatedSearchData={setUpdatedSearchData}
            />
          )}
        </div>
        {!imgQuerySrc && (
          <div className="text-[#c5c7c3] text-xl leading-loose ml-2">
            What are you looking for?
          </div>
        )}
      </div>
      <div className="flex items-center gap-2">
        <div className="w-px h-6 bg-[#d9d9d9]" />
        <SearchByImageButtonAndModal onImageSelected={onImageSelected} />
      </div>
      <SearchResults
          data={data}
          fetchNextPage={fetchNextPage}
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
          status={status}
        />
    </div>
  );
};

export default SearchBar;
