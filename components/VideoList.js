import React, { useEffect, useState } from "react";
import clsx from "clsx";
import ReactPlayer from "react-player";
import { ErrorBoundary } from "react-error-boundary";
import ErrorFallback from "./ErrorFallback";
import LoadingSpinner from "./LoadingSpinner";

const VideoList = ({ videos, page }) => {
  const [updatedVideos, setUpdatedVideos] = useState(null);
  const [videoLoading, setVideoLoading] = useState(true);
  const [error, setError] = useState(null);

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
      setVideoLoading(false);
    } catch (error) {
      console.error("Failed to fetch video details:", error);
      setError(error);
      setVideoLoading(false);
    }
  };

  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return [
      hours.toString().padStart(2, "0"),
      minutes.toString().padStart(2, "0"),
      secs.toString().padStart(2, "0"),
    ].join(":");
  };

  useEffect(() => {
    if (videos && videos.length > 0) {
      fetchVideoDetails();
    }
  }, [videos, page]); // Ensure the effect runs when videos or page changes

  if (videoLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorFallback error={error} />;
  }

  return (
    <div className="flex flex-wrap -mx-2">
      {updatedVideos?.map((video, index) => (
        <div
          key={video._id + "-" + index}
          className="w-full md:w-1/3 px-2 mb-4"
        >
          <div className="relative p-2">
            <div className="w-full h-40 relative overflow-hidden rounded">
              <ReactPlayer
                url={video.videoDetail.hls.video_url}
                controls
                width="100%"
                height="100%"
                light={
                  <img
                    src={video?.videoDetail?.hls.thumbnail_urls[0]}
                    className="object-contain w-full h-full"
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
              <div
                className={clsx(
                  "absolute",
                  "top-5",
                  "left-1/2",
                  "transform",
                  "-translate-x-1/2"
                )}
              >
                <div
                  className={clsx(
                    "bg-grey-1000/60",
                    "px-0.5",
                    "py-1",
                    "rounded-sm"
                  )}
                >
                  <p className={clsx("text-white", "text-xs font-light")}>
                    {formatDuration(video.metadata.duration)}
                  </p>
                </div>
              </div>
            </div>
            <div className="text-center mb-2">
              <p className={clsx("mt-2", "text-body3", "truncate")}>
                {video.metadata.filename}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const VideoListWithErrorBoundary = (props) => (
  <ErrorBoundary FallbackComponent={ErrorFallback}>
    <VideoList {...props} />
  </ErrorBoundary>
);

export default VideoListWithErrorBoundary;
