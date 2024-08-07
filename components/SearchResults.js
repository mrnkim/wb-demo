"use client";
import React from "react";
import clsx from "clsx";
import SearchResultList from "./SearchResultList";
import LoadingSpinner from "./LoadingSpinner";
import { ErrorBoundary } from "react-error-boundary";
import ErrorFallback from "./ErrorFallback";
import EmptyBasicIcon from "./EmptyBasicIcon";
import LimitsOfSearchByImageButton from "./LimitsOfSearchByImageButton";

const SearchResults = ({
  searchResultData,
  updatedSearchData,
  setUpdatedSearchData,
  imgQuerySrc,
  searchResultsLoading,
}) => {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <div>
        {searchResultsLoading ? (
          <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50">
            <LoadingSpinner size="lg" color="primary" />
          </div>
        ) : searchResultData?.pageInfo?.total_results > 0 ? (
          <>
            <div className={clsx("flex", "items-center", "mt-5", "mb-5")}>
              <p className="text-subtitle2 font-medium whitespace-nowrap overflow-hidden text-ellipsis">
                Search results {updatedSearchData?.pageInfo?.totalVideos}
              </p>
              <p
                className={clsx(
                  "text-grey-600",
                  "my-0 text-body2",
                  "whitespace-nowrap",
                  "ml-1.5"
                )}
              >
                <span> • </span>
                {updatedSearchData?.pageInfo?.total_results}
                {"  "}
                {updatedSearchData?.pageInfo?.total_results > 1
                  ? " matches"
                  : " match"}{" "}
              </p>
              <LimitsOfSearchByImageButton />
            </div>
            <SearchResultList
              searchResultData={searchResultData}
              updatedSearchData={updatedSearchData}
              setUpdatedSearchData={setUpdatedSearchData}
              imgQuerySrc={imgQuerySrc}
            />
          </>
        ) : (
          <div className="min-h-[50vh] flex justify-center items-center h-full">
            <div
              className={clsx(
                "h-full w-full",
                "flex flex-col items-center justify-center"
              )}
            >
              <EmptyBasicIcon />
              <div
                className={clsx(
                  "mt-2",
                  "text-center font-aeonik text-body2 font-normal text-grey-900"
                )}
              >
                <p>We couldn&apos;t find any results for your query 😿</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
};

export default SearchResults;
