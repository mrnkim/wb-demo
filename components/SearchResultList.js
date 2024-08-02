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
  imgName,
}) => {
  const [nextPageLoading, setNextPageLoading] = useState(false);
  const [error, setError] = useState(null);
  const [playingIndex, setPlayingIndex] = useState(null);
  const [clickedThumbnailIndex, setClickedThumbnailIndex] = useState(null);
  const [nextPageToken, setNextPageToken] = useState(null);
  const playerRefs = useRef([]);
  const loadingRef = useRef();

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
      if (pageInfo.next_page_token) {
        setNextPageToken(pageInfo.next_page_token);
      } else {
        setNextPageToken(null); // No more pages
      }

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

    updateSearchData();
  }, [searchResultData, imgName, setUpdatedSearchData]);

  const handleProgress = (state, index, end) => {
    if (state.playedSeconds >= end && index === playingIndex) {
      setPlayingIndex(null); // Stop playback by setting playingIndex to null
    }
  };

  const handlePlay = (index, start) => {
    if (playingIndex !== null && playingIndex !== index) {
      setPlayingIndex(null); // Pause previous player by setting playingIndex to null
    }
    setPlayingIndex(index); // Start playing current player
    if (playerRefs.current[index]) {
      playerRefs.current[index].seekTo(start); // Seek to start time
      playerRefs.current[index].getInternalPlayer().play(); // Ensure playback starts immediately
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
    threshold: 1.0,
    triggerOnce: false,
  });

  useEffect(() => {
    if (inView && nextPageToken) {
      handleNextPage();
    }
  }, [inView, nextPageToken]);

  if (nextPageLoading && !updatedSearchData) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorFallback message={error} />;
  }

  return (
    <div className="flex flex-wrap -mx-2">
      {updatedSearchData?.searchData?.map((clip, index) => (
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
                    className={clsx(
                      "absolute",
                      "top-3",
                      "transform",
                    )}
                    style={{ left: "5%" }}
                  >
                    <div
                      className={clsx(
                        "px-1",
                        "py-1.5",
                        "rounded-lg",
                        clip.confidence === "high"
                          ? "bg-turquoise-600"
                          : clip.confidence === "medium"
                          ? "bg-yellow-600"
                          : clip.confidence === "low"
                          ? "bg-red-600"
                          : "bg-gray-300"
                      )}
                    >
                      <p className="text-body3 font-bold text-white capitalize">
                        {clip.confidence}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="text-center mb-2">
                <p className={clsx("mt-2", "text-body3", "truncate", "grey-700")}>
                {clip.videoDetail.metadata.video_title}
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      ))}

      <div ref={observerRef} className="w-full text-center py-4">
        {nextPageToken && <LoadingSpinner />}
      </div>
    </div>
  );
};

export default SearchResultList;
