"use client";
import React, { useState } from "react";
import SearchByImageButtonAndModal from "./SearchByImageButtonAndModal";
import SelectedImageDisplay from "./SelectedImageDisplay";

const SearchBar = () => {
  const [imageName, setImageName] = useState("");
  const [imgSrc, setImageSrc] = useState("");

  const clearImageQuery = async () => {
    setImageName("");
    setImageSrc("");
  };

  const onImageSelected = (src) => {
    if (typeof src === "string") {
      setImageName(src); // Assuming `src` is a URL
      setImageSrc(src);
    } else if (src instanceof File) {
      setImageName(src.name); // If `src` is a File object
      const objectUrl = URL.createObjectURL(src);
      setImageSrc(objectUrl);
      // Clean up the object URL to avoid memory leaks
      return () => URL.revokeObjectURL(objectUrl);
    }
  };

  return (
    <div className="w-full max-w-4xl h-14 py-3 bg-white border-b-2 border-[#e5e6e4] flex justify-between items-center">
      <div className="flex items-center">
        <div className="w-8 h-14 flex items-center gap-1 ml-4">
          <div className="w-6 h-6">
            {!imgSrc && <img src="/SearchVideoLeft.svg" alt="Search Icon" />}
          </div>
            {imgSrc && <SelectedImageDisplay
              imageBlobUrl={imgSrc}
              imageName={imageName}
              unselectImage={clearImageQuery}
            />}
        </div>
        {!imgSrc && <div className="text-[#c5c7c3] text-xl leading-loose ml-2">
          What are you looking for?
        </div>}
      </div>
      <div className="flex items-center gap-2">
        <div className="w-px h-6 bg-[#d9d9d9]" />
        <SearchByImageButtonAndModal onImageSelected={onImageSelected} />
        {/* <div className="px-3 py-2 rounded flex items-center">
          <button className="flex items-center">
            <img
              className="w-5 h-5 mr-2"
              src="/ImageSearch.svg"
              alt="Search Icon"
            />
            <span className="text-[#006f33] text-xs leading-tight">
              Search by image
            </span>
          </button>
        </div> */}
      </div>
    </div>
  );
};

export default SearchBar;
