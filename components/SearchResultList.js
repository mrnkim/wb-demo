import React, { useEffect } from "react";
import videojs from "video.js";
import Player from "./Player"; // Correctly import the Player component

const SearchResultList = ({
  searchResultData,
  updatedSearchData,
  setUpdatedSearchData,
}) => {
  const playerRef = React.useRef(null);

  useEffect(() => {
    const fetchVideoDetails = async () => {
      if (searchResultData) {
        try {
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

          setUpdatedSearchData(updatedData);
        } catch (error) {
          console.error("Failed to fetch video details:", error);
        }
      }
    };

    fetchVideoDetails();
  }, [searchResultData]);

  const videoJsOptions = {
    autoplay: false,
    controls: true,
    responsive: true,
    fluid: true,
  };

  const handlePlayerReady = (player) => {
    playerRef.current = player;
    player.on("waiting", () => videojs.log("player is waiting"));
    player.on("dispose", () => videojs.log("player will dispose"));
  };

  return (
    <div className="flex flex-wrap -mx-2">
      {updatedSearchData?.map((clip, index) => (
        <div key={index} className="w-full md:w-1/3 px-2 mb-4">
          <div className="bg-gray-100 p-2 rounded shadow">
            <div className="text-center mb-2">
              <span className="text-gray-700">{clip.score}</span>
            </div>
            {clip.videoDetail?.hls?.videoUrl && (
              <Player
                sources={[
                  {
                    src: clip.videoDetail.hls.videoUrl,
                    type: "application/x-mpegURL",
                  },
                ]}
                offset={{
                  start: clip.start,
                  end: clip.end,
                }}
                onReady={handlePlayerReady}
              />
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default SearchResultList;
