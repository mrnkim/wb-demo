import React, { useEffect, useState, useRef } from "react";
import ReactPlayer from "react-player";

const VideoList = ({ videos, page }) => {
  const [updatedVideos, setUpdatedVideos] = useState(null);

  const fetchVideoDetails = async () => {
    try {
      const updatedVideos = await Promise.all(
        videos?.map(async (video) => {
          const response = await fetch(`/api/getVideo?videoId=${video._id}`);
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          const videoDetail = await response.json();
          return { ...video, videoDetail };
        })
      );
      setUpdatedVideos(updatedVideos);
    } catch (error) {
      console.error("Failed to fetch video details:", error);
    }
  };

  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return [
      hours.toString().padStart(2, '0'),
      minutes.toString().padStart(2, '0'),
      secs.toString().padStart(2, '0')
    ].join(':');
  };

  useEffect(() => {
    if (videos && videos.length > 0) {
      fetchVideoDetails();
    }
  }, [videos, page]); // Ensure the effect runs when videos or page changes

  return (
    <div className="flex flex-wrap -mx-2">
      {updatedVideos?.map((video, index) => (
        <div key={index} className="w-full md:w-1/3 px-2 mb-4">
          <div className="p-2">
            <div className="text-center mb-2">
              <span className="text-gray-700">{formatDuration(video.metadata.duration)}</span>
            </div>
            {video.videoDetail?.hls?.video_url && (
              <>
                <ReactPlayer
                  url={video.videoDetail.hls.video_url}
                  controls
                  width="100%"
                  height="100%"
                  light={
                    <img
                      src={video?.videoDetail?.hls.thumbnail_urls[0]}
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
                <div className="text-center mb-2">
                  <span className="text-gray-700">
                    {video.metadata.filename}
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

export default VideoList;
