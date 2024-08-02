"use client";
import React, { useEffect, Suspense } from "react";
import clsx from "clsx";
import SearchResultList from "./SearchResultList";
import LoadingSpinner from "./LoadingSpinner";
import { ErrorBoundary } from "react-error-boundary";
import ErrorFallback from "./ErrorFallback";
import EmptyBasicIcon from "./EmptyBasicIcon";

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
              <div className={clsx("flex", "items-center", "mt-5", "mb-5")}>
                <p className="text-subtitle2 font-medium whitespace-nowrap overflow-hidden text-ellipsis">
                  Search results {updatedSearchData?.pageInfo?.totalVideos}
                </p>
                {/* <img src={"/Ellipse.sgv"} className="m-3" /> */}
                <p
                  className={clsx(
                    "text-grey-600",
                    "my-0 text-body2",
                    "whitespace-nowrap",
                    "ml-1.5"
                  )}
                >
                  <span> • </span>
                  {/* {updatedSearchData?.pageInfo?.totalVideos > 1
                    ? " videos"
                    : " video"}
                  , */}
                  {updatedSearchData?.pageInfo?.total_results}
                  {"  "}
                  {updatedSearchData?.pageInfo?.total_results > 1
                    ? " matches"
                    : " match"}{" "}
                </p>
              </div>

              <SearchResultList
                searchResultData={searchResultData}
                updatedSearchData={updatedSearchData}
                setUpdatedSearchData={setUpdatedSearchData}
                imgName={imgName}
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
                  <p>We couldn't find any results for your query 😿</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </Suspense>
    </ErrorBoundary>
  );
};

export default SearchResults;
