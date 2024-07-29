import React, { useEffect, useRef } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import "videojs-offset"; // Import the videojs-offset plugin

export const Video = (props) => {
  const videoRef = useRef(null);
  const playerRef = useRef(null);
  const { options, onReady } = props;

  useEffect(() => {
    if (!playerRef.current) {
      const videoElement = document.createElement("video-js");
      videoElement.classList.add("vjs-big-play-centered");
      videoRef.current.appendChild(videoElement);

      const player = (playerRef.current = videojs(videoElement, options, () => {
        videojs.log("Player is ready");

        // Ensure the plugin is correctly available
        if (videojs.getPlugin("offset")) {
          videojs.log("Applying offset plugin with settings:", options.offset);
          player.offset({
            start: options.offset?.start || 0,
            end: options.offset?.end || Infinity,
            restart_beginning: options.offset?.restart_beginning || false,
          });
        } else {
          videojs.log("Offset plugin not found");
        }

        if (onReady) {
          onReady(player);
        }
      }));
    } else {
      const player = playerRef.current;
      player.autoplay(options.autoplay);
      player.src(options.sources);
    }

    return () => {
      const player = playerRef.current;
      if (player && !player.isDisposed()) {
        player.dispose();
        playerRef.current = null;
      }
    };
  }, [options, videoRef, onReady]);

  return (
    <div data-vjs-player>
      <div ref={videoRef} />
    </div>
  );
};

export default Video;
