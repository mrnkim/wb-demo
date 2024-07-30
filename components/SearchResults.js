"use client";
import React, { useEffect, useState } from "react";
import SearchResultList from "./SearchResultList";

const SearchResults = ({ imgQuerySrc, uploadedImg, searchResultData, setSearchResultData, updatedSearchData, setUpdatedSearchData, searchImage, imgName }) => {

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
