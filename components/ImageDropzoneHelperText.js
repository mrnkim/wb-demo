import clsx from "clsx";
import React from "react";

const ImageDropzoneHelperText = ({ isDragAccept }) => {
  if (isDragAccept) {
    return <p className="text-subtitle2 !text-moss_green-800">Drop here!</p>;
  }

  return (
    <p className="text-subtitle2 text-grey-1000">
      <span>Drop an image or&nbsp;</span>
      <span className={clsx("text-moss_green-800", "capitalize")}>
        browse file
      </span>
    </p>
  );
};

export default ImageDropzoneHelperText;
