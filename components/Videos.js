import React, { useEffect, useState, Suspense } from "react";
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
    <div>
          <p>Videos in {indexData?.index_name}</p>
          <p>
            {indexData?.video_count} videos ({durationString})
          </p>
          <VideoList videos={videosData?.data} page={page} />
          <PageNav videosData={videosData} page={page} setPage={setPage} />

    </div>
  );
};

export default Videos;
