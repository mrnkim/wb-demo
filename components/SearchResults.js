"use client";
import React, { useEffect, useState } from "react";
import SearchResultList from "./SearchResultList";

const SearchResults = ({
  imgQuerySrc,
  uploadedImg,
  searchResultData,
  setSearchResultData,
  updatedSearchData,
  setUpdatedSearchData,
  searchImage,
  imgName,
}) => {
  useEffect(() => {
    console.log("img updated:", imgName);
  }, [imgName]);
  
  return (
    <div>
      <p>
        Search result {updatedSearchData?.pageInfo?.totalVideos}
        {updatedSearchData?.pageInfo?.totalVideos > 1
          ? "videos"
          : "video"}, {updatedSearchData?.pageInfo?.totalResults}{" "}
        {updatedSearchData?.pageInfo?.totalResults > 1 ? "matches" : "match"},{" "}
      </p>
      <SearchResultList
        searchResultData={searchResultData}
        updatedSearchData={updatedSearchData}
        setUpdatedSearchData={setUpdatedSearchData}
        imgName={imgName}
      />
    </div>
  );
};

export default SearchResults;
