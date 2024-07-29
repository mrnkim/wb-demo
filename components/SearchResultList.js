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
    <div>
      <ul>
        {updatedSearchData?.map((clip, index) => (
          <li key={index}>
            {clip.score}
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
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchResultList;
