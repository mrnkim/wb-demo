import React, { useEffect, useState, useRef } from "react";
import clsx from "clsx";
import ReactPlayer from "react-player";
import { useInView } from "react-intersection-observer";
import LoadingSpinner from "./LoadingSpinner";
import ErrorFallback from "./ErrorFallback";

const SearchResultList = ({
  searchResultData,
  updatedSearchData,
  setUpdatedSearchData,
  imgQuerySrc,
}) => {
  const [nextPageLoading, setNextPageLoading] = useState(false);
  const [error, setError] = useState(null);
  const [playingIndex, setPlayingIndex] = useState(null);
  const [clickedThumbnailIndex, setClickedThumbnailIndex] = useState(null);
  const [nextPageToken, setNextPageToken] = useState(null);
  const playerRefs = useRef([]);

  const fetchNextSearchResults = async () => {
    setNextPageLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/searchByToken?pageToken=${nextPageToken}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch next data");
      }

      const { pageInfo, searchData } = await response.json();
      setNextPageToken(pageInfo.next_page_token || null);
      return { pageInfo, searchData };
    } catch (error) {
      console.error("Error getting next search results", error);
      setError(error.message);
    } finally {
      setNextPageLoading(false);
    }
  };

  const fetchVideoDetails = async (data) => {
    try {
      const updatedData = await Promise.all(
        data.map(async (clip) => {
          const response = await fetch(
            `/api/getVideo?videoId=${clip.video_id}`
          );
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          const videoDetail = await response.json();
          return { ...clip, videoDetail: videoDetail };
        })
      );

      return updatedData;
    } catch (error) {
      console.error("Failed to fetch video details:", error);
      setError(error.message);
    }
  };

  useEffect(() => {
    const updateSearchData = async () => {
      if (searchResultData) {
        setNextPageLoading(true);
        setError(null);
        try {
          const updatedData = await fetchVideoDetails(
            searchResultData.searchData
          );
          setUpdatedSearchData({
            ...searchResultData,
            searchData: updatedData,
          });
          setNextPageToken(searchResultData.pageInfo.next_page_token);
        } catch (error) {
          setError(error.message);
        } finally {
          setNextPageLoading(false);
        }
      }
    };

    if (imgQuerySrc) {
      setUpdatedSearchData({ searchData: [], pageInfo: {} });
      setNextPageToken(null);
      updateSearchData();
    }
  }, [searchResultData, imgQuerySrc, setUpdatedSearchData]);

  const handleProgress = (state, index, end) => {
    if (state.playedSeconds >= end && index === playingIndex) {
      setPlayingIndex(null);
    }
  };

  const handlePlay = (index, start) => {
    if (playingIndex !== null && playingIndex !== index) {
      setPlayingIndex(null);
    }
    setPlayingIndex(index);
    if (playerRefs.current[index]) {
      playerRefs.current[index].seekTo(start);
      playerRefs.current[index].getInternalPlayer().play();
    }
  };

  const handleNextPage = async () => {
    const result = await fetchNextSearchResults();
    if (result && result.searchData) {
      const updatedData = await fetchVideoDetails(result.searchData);
      setUpdatedSearchData((prevData) => ({
        ...prevData,
        searchData: [...prevData.searchData, ...updatedData],
        pageInfo: {
          ...prevData.pageInfo,
          ...result.pageInfo,
        },
      }));
    }
  };

  const { ref: observerRef, inView } = useInView({
    threshold: 0.8,
    triggerOnce: false,
  });

  useEffect(() => {
    if (inView && nextPageToken) {
      handleNextPage();
    }
  }, [inView, nextPageToken]);

  if (nextPageLoading && !updatedSearchData.searchData.length) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50">
        <LoadingSpinner size="lg" color="primary" />
      </div>
    );
  }

  if (error) {
    return <ErrorFallback message={error} />;
  }

  return (
    <div className="flex flex-wrap -mx-2">
      {updatedSearchData?.searchData?.length ? (
        updatedSearchData.searchData.map((clip, index) => (
          <div
            key={clip?.video_id + "-" + index}
            className="w-full md:w-1/3 px-2 mb-2"
          >
            <div className="relative p-1">
              {clip.videoDetail?.hls?.video_url && (
                <>
                  <div
                    className="w-full h-40 relative overflow-hidden rounded cursor-pointer"
                    onClick={() => {
                      setClickedThumbnailIndex(index);
                      if (playingIndex !== index) {
                        setPlayingIndex(index);
                      }
                    }}
                  >
                    <ReactPlayer
                      ref={(el) => (playerRefs.current[index] = el)}
                      url={clip.videoDetail.hls.video_url}
                      controls
                      width="100%"
                      height="100%"
                      playing={playingIndex === index}
                      onPlay={() => handlePlay(index, Math.floor(clip.start))}
                      onProgress={(state) =>
                        handleProgress(state, index, Math.floor(clip.end))
                      }
                      light={
                        <img
                          src={clip.thumbnail_url}
                          width="100%"
                          height="100%"
                          alt="thumbnail"
                        />
                      }
                      config={{
                        file: {
                          attributes: {
                            preload: "auto",
                          },
                        },
                      }}
                      progressInterval={100}
                    />
                  </div>
                  <div className="text-center mb-2">
                    <div
                      className={clsx("absolute", "top-3", "transform")}
                      style={{ left: "5%" }}
                    >
                      <div
                        className={clsx(
                          "px-1",
                          "py-1",
                          "rounded",
                          clip.confidence === "high"
                            ? "bg-turquoise-600"
                            : clip.confidence === "medium"
                            ? "bg-yellow-600"
                            : clip.confidence === "low"
                            ? "bg-grey-600"
                            : "bg-grey-600"
                        )}
                      >
                        <p className="text-body3 font-bold text-white capitalize">
                          {clip.confidence}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="text-center mb-2">
                    <p
                      className={clsx(
                        "mt-2",
                        "text-body3",
                        "truncate",
                        "grey-700"
                      )}
                    >
                      {clip.videoDetail.metadata.video_title}
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        ))
      ) : !nextPageLoading ? (
        <p className="w-full text-center">No results found</p>
      ) : null}

      <div ref={observerRef} className="w-full text-center py-4">
        {nextPageToken && (
          <div className="flex justify-center items-center w-full">
            <LoadingSpinner size="sm" color="default" />
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResultList;
