import "video.js/dist/video-js.css";
import "videojs-vtt-thumbnails";
import "videojs-offset";
import debounce from "lodash/debounce";

import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import React, {
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { createRoot } from "react-dom/client";
import videojs from "video.js";

// Ensure the offset plugin is correctly registered
import offsetPlugin from "videojs-offset";
videojs.registerPlugin("offset", offsetPlugin);

const defaultOptions = {
  fill: true,
  playsinline: true,
  controlBar: {
    pictureInPictureToggle: false,
    currentTimeDisplay: true,
    timeDivider: true,
    durationDisplay: true,
    remainingTimeDisplay: false,
  },
};

const CONTROL_BAR_HEIGHT = 44;
const PROGRESS_BAR_HEIGHT = 8;

const colorWithAlpha = (color, alpha) =>
  `${color}${Math.round(alpha * 255).toString(16)}`;

const Video = styled("video")(({ theme }) => ({
  "&.video-js .vjs-big-play-button": {
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  },
  "&.vjs-has-started .vjs-control-bar": {
    height: theme.spacing(CONTROL_BAR_HEIGHT),
  },
  "& .vjs-button > .vjs-icon-placeholder:before": {
    fontSize: theme.spacing(24),
    lineHeight: theme.spacing(CONTROL_BAR_HEIGHT),
  },
  "&.video-js .vjs-slider": {
    background: colorWithAlpha(theme.palette.grey[900], 0.2),
  },
  "&.video-js .vjs-progress-control": {
    position: "absolute",
    top: `-${theme.spacing(PROGRESS_BAR_HEIGHT)}`,
    left: 0,
    width: "100%",
    height: "auto",
  },
  "&.video-js .vjs-progress-holder": {
    margin: "0 !important",
    height: theme.spacing(PROGRESS_BAR_HEIGHT),
  },
  "&.video-js .vjs-load-progress > div": {
    background: theme.palette.grey[900],
  },
  "&.video-js .vjs-time-control": {
    display: "block",
    padding: `0 ${theme.spacing(4)}`,
    minWidth: "unset",
    lineHeight: theme.spacing(CONTROL_BAR_HEIGHT),
    fontSize: theme.typography.body2.fontSize,
    fontFamily: theme.typography.body2.fontFamily,
  },
  "&.video-js .vjs-play-progress": {
    background: "#FFFFFF",
  },
  "&.video-js .vjs-play-progress:before": {
    content: '""',
    width: theme.spacing(2),
    height: "100%",
    background: "#FFFFFF",
    top: 0,
    right: `-${theme.spacing(1)}`,
    borderRadius: theme.spacing(1),
  },
  "&.video-js .vjs-fullscreen-control": {
    position: "absolute",
    right: 0,
    bottom: 0,
    height: theme.spacing(CONTROL_BAR_HEIGHT),
  },
  "&.video-js .vjs-volume-panel": {
    "& .vjs-volume-control.vjs-volume-horizontal": {
      height: `${theme.spacing(CONTROL_BAR_HEIGHT)} !important`,
      display: "flex",
      alignItems: "center",
      "& > div": { margin: 0 },
    },
  },
  "& .vjs-vtt-thumbnail-display": {
    ...theme.components?.MuiPaper,
    position: "absolute",
    transition: "opacity .2s",
    bottom: `${theme.spacing(PROGRESS_BAR_HEIGHT + 8)}`,
    pointerEvents: "none",
  },
}));

const setOffset = (player, value) => {
  player.getCache().initTime = 0;
  player.currentTime(0);
  player.offset(value);
};

const Player = forwardRef((props, outerRef) => {
  const {
    sources,
    vttThumbnails,
    offset,
    autoloop,
    highlights: defaultHighlights,
    loopPadding = 0,
    ...options
  } = props;
  const videoRef = useRef(null);
  const playerRef = useRef(null);

  const trimHighlight = useCallback(({ start, end, ...other }) => {
    const duration = playerRef.current?.duration();
    return {
      start: Math.max(Math.floor(start), 0),
      end: duration ? Math.min(Math.ceil(end), duration) : Math.ceil(end),
      ...other,
    };
  }, []);

  const [highlights, setHighlights] = useState(
    defaultHighlights?.map(trimHighlight)
  );

  const initRef = useRef(
    debounce(() => {
      const video = videoRef.current;
      if (!video) return;

      const player = videojs(video, {
        sources,
        ...defaultOptions,
        ...options,
      });
      const progressHolder = video.parentElement?.getElementsByClassName(
        "vjs-progress-holder"
      )[0];
      if (!progressHolder) return;

      function renderHighlights(items) {
        const duration = player.duration();
        if (!duration) return;

        const highlightId = "player_progress-highlight";
        const prevHighlight = document.getElementById(highlightId);
        prevHighlight?.remove();

        const highlightBox = document.createElement("div");
        highlightBox.setAttribute("id", highlightId);
        progressHolder?.appendChild(highlightBox);
        createRoot(highlightBox).render(
          items.map(({ start, end, color }) => (
            <Box
              key={`${start}_${end}`}
              sx={{
                position: "absolute",
                left: `${(start * 100) / duration}%`,
                width: `max(${((end - start) * 100) / duration}%, 8px)`,
                height: "100%",
                background: color,
              }}
            />
          ))
        );
      }

      let loopBack = null;
      const loopHighlight = (
        start = highlights?.[0].start,
        end = highlights?.[0].end
      ) => {
        if (start == null || end == null) return;

        const padding =
          end - start < 5 ? Math.max(loopPadding, 1) : loopPadding;
        const paddedStart = Math.max(start - padding, 0);
        const paddedEnd = Math.min(player.duration(), end + padding);
        player.currentTime(paddedStart);

        if (loopBack) {
          player.off("timeupdate", loopBack);
        }

        loopBack = () => {
          if (player.currentTime() >= paddedEnd) {
            player.currentTime(paddedStart);
          }
        };
        player.on("timeupdate", loopBack);

        const clearLoopBack = () => {
          if (loopBack) player.off("timeupdate", loopBack);
          progressHolder.removeEventListener("click", clearLoopBack);
        };
        progressHolder.addEventListener("click", clearLoopBack);
      };

      const replaceHighlights = (newHighlights) => {
        const trimmedHighlights = newHighlights.map(trimHighlight);
        setHighlights(trimmedHighlights);
        if (autoloop) {
          loopHighlight(trimmedHighlights[0].start, trimmedHighlights[0].end);
        }
        renderHighlights(trimmedHighlights);
      };

      if (vttThumbnails) player.vttThumbnails(vttThumbnails);
      if (offset) setOffset(player, offset);

      video.onloadedmetadata = () => {
        if (highlights) {
          if (autoloop) loopHighlight();
          renderHighlights(highlights);
        }
      };

      player.on("error", () => {
        const err = player.error();
        if (err) {
          console.error("video.js error:", err.message, { sources }, err);
        }
      });

      playerRef.current = player;
      if (outerRef) {
        outerRef.current = player;
        outerRef.current.loopHighlight = loopHighlight;
        outerRef.current.replaceHighlights = replaceHighlights;
      }
    }, 10)
  );

  useEffect(() => {
    initRef.current();
    return () => {
      const player = playerRef.current;
      if (player && !player.isDisposed()) {
        player.dispose();
        playerRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    return () => {};
  }, [sources]);

  return (
    <div data-vjs-player>
      <Video ref={videoRef} className="video-js vjs-16-9" />
    </div>
  );
});

export default memo(Player);
