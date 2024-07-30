import React, { useEffect, useState, useRef } from "react";
import ReactPlayer from "react-player";

const SearchResultList = ({
  searchResultData,
  updatedSearchData,
  setUpdatedSearchData,
}) => {
  const [playingIndex, setPlayingIndex] = useState(null);
  const [clickedThumbnailIndex, setClickedThumbnailIndex] = useState(null);

  const playerRefs = useRef([]);

  useEffect(() => {
    const fetchVideoDetails = async () => {
      if (searchResultData) {
        try {
          const videoIds = new Set(
            searchResultData.searchData.map((clip) => clip.videoId)
          );
          console.log("🚀 > fetchVideoDetails > videoIds=", videoIds)

          const updatedData = await Promise.all(
            searchResultData?.searchData?.map(async (clip) => {
              const response = await fetch(
                `/api/getVideo?videoId=${clip.videoId}`
              );
              if (!response.ok) {
                throw new Error("Network response was not ok");
              }
              const videoDetail = await response.json();
              return { ...clip, videoDetail: videoDetail };
            })
          );

          setUpdatedSearchData({
            ...searchResultData,
            pageInfo: {
              ...searchResultData.pageInfo,
              totalVideos: videoIds.size, // Count of unique video IDs
            },
            searchData: updatedData,
          });
        } catch (error) {
          console.error("Failed to fetch video details:", error);
        }
      }
    };

    fetchVideoDetails();
  }, [searchResultData, setUpdatedSearchData]);

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

  return (
    <div className="flex flex-wrap -mx-2">
      {updatedSearchData?.searchData?.map((clip, index) => (
        <div key={index} className="w-full md:w-1/3 px-2 mb-4">
          <div className="p-2">
            <div className="text-center mb-2">
              <span className="text-gray-700">
                {clip.confidence}
                {Math.floor(clip.start)}, {Math.floor(clip.end)}
              </span>
            </div>
            {clip.videoDetail?.hls?.videoUrl && (
              <>
                <div
                  onClick={() => {
                    setClickedThumbnailIndex(index); // Set clicked thumbnail index
                    if (playingIndex !== index) {
                      setPlayingIndex(index); // Set playing index to start playback
                    }
                  }}
                  style={{ cursor: "pointer" }}
                >
                  <ReactPlayer
                    ref={(el) => (playerRefs.current[index] = el)}
                    url={clip.videoDetail.hls.videoUrl}
                    controls
                    width="100%"
                    height="100%"
                    playing={playingIndex === index} // Controls playback
                    onPlay={() => handlePlay(index, Math.floor(clip.start))}
                    onProgress={(state) =>
                      handleProgress(state, index, Math.floor(clip.end))
                    }
                    light={
                      <img
                        src={clip.thumbnailUrl}
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
                  <span className="text-gray-700">
                    {clip.videoDetail.metadata.video_title}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default SearchResultList;
