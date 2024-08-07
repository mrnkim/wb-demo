import React, { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import ErrorFallback from "./ErrorFallback";
import LoadingSpinner from "./LoadingSpinner";
import Video from "./Video";

const VideoList = ({ videos }) => {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Suspense fallback={<LoadingSpinner />}>
        <div className="flex flex-wrap -mx-2">
          {videos?.map((video) => (
            <Video key={video._id} video={video} />
          ))}
        </div>
      </Suspense>
    </ErrorBoundary>
  );
};

export default VideoList;
