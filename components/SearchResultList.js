import React, { useEffect } from "react";
import Video from "./Video";

const SearchResultList = ({
  searchResultData,
  updatedSearchData,
  setUpdatedSearchData,
}) => {
  const playerRef = React.useRef(null);

  useEffect(() => {
    const fetchVideoDetails = async () => {
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
    };

    fetchVideoDetails();
  }, [searchResultData]);

  const videoJsOptions = {
    autoplay: false,
    controls: true,
    responsive: true,
    fluid: true,
    sources: [
      {
        src: "/path/to/video.mp4",
        type: "application/x-mpegURL",
      },
    ],
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
              <Video
                options={{
                  ...videoJsOptions,
                  sources: [
                    {
                      src: clip.videoDetail.hls.videoUrl,
                      type: "application/x-mpegURL",
                    },
                  ],
                }}
                onReady={handlePlayerReady}
                start={clip.videoDetail.start}
                end={clip.videoDetail.end}
              />
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchResultList;
