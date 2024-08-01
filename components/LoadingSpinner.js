import React from "react";

function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center h-full">
      <div className="p-0.5">
        <img
          src="/LoadingSpinner.svg"
          alt="Loading Spinner"
          className="animate-rotate"
        />
      </div>
    </div>
  );
}

export default LoadingSpinner;
