import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import clsx from "clsx";
import ReactPlayer from "react-player";
import ErrorFallback from "./ErrorFallback";

const fetchVideoDetail = async (videoId) => {
  const response = await fetch(`/api/getVideo?videoId=${videoId}`);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
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

const Video = ({ video }) => {
  const [playing, setPlaying] = useState(false);

  const {
    data: videoDetail,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["videoDetail", video._id],
    queryFn: () => fetchVideoDetail(video._id),
    staleTime: 600000,
    cacheTime: 900000,
  });

  if (error) {
    return <ErrorFallback error={error} />;
  }

  return (
    <div className="w-full md:w-1/3 px-2 mb-2">
      <div className="relative p-1">
        <div
          className="w-full h-40 relative overflow-hidden rounded cursor-pointer"
          onClick={() => setPlaying(!playing)}
        >
          <ReactPlayer
            url={videoDetail?.hls?.video_url}
            controls
            width="100%"
            height="100%"
            light={
              <img
                src={videoDetail?.hls?.thumbnail_urls[0]}
                className="object-contain w-full h-full"
                alt="thumbnail"
              />
            }
            playing={playing}
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
              "top-3",
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
          <p className={clsx("mt-2", "text-body3", "truncate", "grey-700")}>
            {video.metadata.filename}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Video;
