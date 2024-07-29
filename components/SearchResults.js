"use client";
import React, { useEffect, useState } from "react";
import SearchResultList from "./SearchResultList";

const SearchResults = ({ imgQuerySrc, uploadedImg }) => {
  const [searchResultData, setSearchResultData] = useState(null);
  const [updatedSearchData, setUpdatedSearchData] = useState([]);
  console.log("🚀 > SearchResults > updatedSearchData=", updatedSearchData);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!uploadedImg) return;

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `/api/search?query=${encodeURIComponent(uploadedImg)}`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const result = await response.json();
        setSearchResultData(result);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [imgQuerySrc]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <p>Showing results for: {uploadedImg}</p>
      <SearchResultList
        searchResultData={searchResultData}
        updatedSearchData={updatedSearchData}
        setUpdatedSearchData={setUpdatedSearchData}
      />
    </div>
  );
};

export default SearchResults;
