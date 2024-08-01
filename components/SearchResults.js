"use client";
import React, { useEffect, Suspense } from "react";
import SearchResultList from "./SearchResultList";
import LoadingSpinner from "./LoadingSpinner";
import { ErrorBoundary } from "react-error-boundary";
import ErrorFallback from "./ErrorFallback";

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
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Suspense fallback={<LoadingSpinner />}>
        <div>
          {searchResultData?.pageInfo?.total_results > 0 ? (
            <>
              <p>
                Search result {updatedSearchData?.pageInfo?.totalVideos}
                {updatedSearchData?.pageInfo?.totalVideos > 1
                  ? " videos"
                  : " video"}
                , {updatedSearchData?.pageInfo?.total_results}{" "}
                {updatedSearchData?.pageInfo?.total_results > 1
                  ? " matches"
                  : " match"}
                ,{" "}
              </p>
              <SearchResultList
                searchResultData={searchResultData}
                updatedSearchData={updatedSearchData}
                setUpdatedSearchData={setUpdatedSearchData}
                imgName={imgName}
              />
            </>
          ) : (
            <div className="flex justify-center items-center h-full">
              <p>We couldn't find any results for your query. 😿</p>
            </div>
          )}
        </div>
      </Suspense>
    </ErrorBoundary>
  );
};

export default SearchResults;
