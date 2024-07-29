"use client";
import React, { useEffect, useState } from "react";
import SearchResultList from "./SearchResultList";

const SearchResults = ({ imgQuerySrc, uploadedImg, searchResultData, setSearchResultData, updatedSearchData, setUpdatedSearchData, searchImage, imgName }) => {
  // const [error, setError] = useState(null);
  // const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!uploadedImg) return;
   searchImage(uploadedImg);
  }, [imgQuerySrc]);

  // if (isLoading) return <div>Loading...</div>;
  // if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <p>Showing results for: {imgName}</p>
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
