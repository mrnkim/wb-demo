import React, { useEffect, useState, useRef } from "react";
import ReactPlayer from "react-player";
import { useInView } from "react-intersection-observer";
import PageNav from "./PageNav";
import VideoList from "./VideoList";

const Videos = () => {
  const [videosData, setVideosData] = useState(null);
  const [page, setPage] = useState(1);

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
    fetchVideos();
  }, [page]);

  return (
    <div>
      <VideoList videos={videosData?.data} page={page} />
      <PageNav videosData={videosData} page={page} setPage={setPage} />
    </div>
  );
};

export default Videos;
