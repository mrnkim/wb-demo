"use client";
import React, { useEffect, useState } from "react";
import SearchByImageButtonAndModal from "./SearchByImageButtonAndModal";
import SelectedImageDisplay from "./SelectedImageDisplay";

const SearchBar = ({
  imgQuerySrc,
  setImgQuerySrc,
  setUploadedImg,
  searchResultData,
  setSearchResultData,
  updatedSearchData,
  setUpdatedSearchData,
  imgName,
  setImgName,
  clearImageQuery,
  uploadedImg,
}) => {

  //TODO: Merge with uploadImage in SelectedImageDisplay.js
  const onImageSelected = async (src) => {
    if (typeof src === "string") {
      // src is an image URL; download and upload the image
      try {
        // Proxy the image request through your server
        const response = await fetch("/api/uploadByUrl", {
          method: "POST",
          body: JSON.stringify({ url: src }),
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          console.error("Failed to fetch image through proxy");
          return;
        }

        const { downloadUrl } = await response.json(); // Get fileName from response
        const fileName = downloadUrl.split("/").pop(); // Simple method to get file name

        setImgQuerySrc(downloadUrl);
        setUploadedImg(downloadUrl);
        setImgName(fileName);
      } catch (error) {
        console.error("Error processing image URL:", error);
      }
    } else if (src instanceof File) {
      const formData = new FormData();
      formData.append("file", src);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        console.error("Failed to upload image");
        return;
      }

      const { url } = await response.json();
      setImgQuerySrc(src);
      setUploadedImg(url);
      setImgName(src.name);
    }
  };

  const searchImage = async (imagePath) => {
    // setIsLoading(true);
    // setError(null);
    try {
      const response = await fetch(
        `/api/search?query=${encodeURIComponent(imagePath)}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const result = await response.json();
      setSearchResultData(result);
    } catch (error) {
      console.error(error);
      // setError(error.message);
    }
    // finally {
    //   setIsLoading(false);
    // }
  };

  useEffect(() => {
    if (!uploadedImg) return;
    searchImage(uploadedImg);
  }, [uploadedImg]);

  return (
    <div className="w-full max-w-4xl h-14 py-3 bg-white border-b-2 border-[#e5e6e4] flex justify-between items-center">
      <div className="flex items-center">
        <div className="w-8 h-14 flex items-center gap-1 ml-4">
          <div className="w-6 h-6">
            <img src="/SearchVideoLeft.svg" alt="Search Icon" />
          </div>
        </div>
        {imgQuerySrc && (
          <div className="w-8 h-14 flex items-center gap-1 ml-1">
            <SelectedImageDisplay
              imgQuerySrc={imgQuerySrc}
              setImgQuerySrc={setImgQuerySrc}
              imgName={imgName}
              setImgName={setImgName}
              unselectImage={clearImageQuery}
              setUploadedImg={setUploadedImg}
              searchResultData={searchResultData}
              setSearchResultData={setSearchResultData}
              updatedSearchData={updatedSearchData}
              setUpdatedSearchData={setUpdatedSearchData}
              searchImage={searchImage}
            />
          </div>
        )}
        {!imgQuerySrc && (
          <div className="text-[#c5c7c3] text-xl leading-loose ml-2">
            What are you looking for?
          </div>
        )}
      </div>
      <div className="flex items-center gap-2">
        <div className="w-px h-6 bg-[#d9d9d9]" />
        <SearchByImageButtonAndModal
          onImageSelected={onImageSelected}
          searchImage={searchImage}
          setImgQuerySrc={setImgQuerySrc}
          setImgName={setImgName}
        />
      </div>
    </div>
  );
};

export default SearchBar;
