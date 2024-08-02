import React, { useEffect, useState, Suspense } from "react";
import clsx from "clsx";
import ReactPlayer from "react-player";
import { useInView } from "react-intersection-observer";
import PageNav from "./PageNav";
import VideoList from "./VideoList";

const Videos = () => {
  const [indexData, setIndexData] = useState(null);
  const [videosData, setVideosData] = useState(null);
  const [page, setPage] = useState(1);

  const fetchIndex = async () => {
    try {
      const response = await fetch(`api/getIndex`);

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const result = await response.json();
      setIndexData(result);
    } catch (error) {
      console.error(error);
    }
  };
  const fetchVideos = async () => {
    try {
      const response = await fetch(`api/getVideos?page=${page}`);

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const result = await response.json();
      setVideosData(result);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchIndex();
    fetchVideos();
  }, [page]);

  const durationString = indexData
    ? `Total ${Math.floor(indexData?.total_duration / 60)}h ${
        indexData?.total_duration % 60
      }min`
    : "";

  return (
    <div className={clsx("flex-1", "flex", "flex-col", "gap-y-3")}>
      {indexData && (
        <div className={clsx("flex", "items-center", "mt-5")}>
          <p className="text-subtitle2 font-medium whitespace-nowrap overflow-hidden text-ellipsis">
            Videos in {indexData?.index_name}
          </p>
        </div>
      )}
      {indexData && indexData.video_count && (
        <div className={clsx("flex items-center gap-x-2")}>
          <img src={"/VideoLibrary.svg"} />
          <p
            className={clsx(
              "text-grey-700",
              "my-0 text-body2",
              "whitespace-nowrap"
            )}
          >
            {indexData?.video_count} videos ({durationString})
          </p>
        </div>
      )}
      <VideoList videos={videosData?.data} page={page} />
      <div className={clsx("w-full", "flex", "justify-center", "mt-8")}>
        <PageNav videosData={videosData} page={page} setPage={setPage} />
      </div>
    </div>
  );
};

export default Videos;
