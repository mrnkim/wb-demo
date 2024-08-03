import CloseIcon from "@mui/icons-material/Close";
import InsertLink from "@mui/icons-material/InsertLink";
import { Alert, DialogContent, DialogTitle, IconButton } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import Button from "./Button";
import clsx from "clsx";
import Input from "./Input";
import Image from "next/image";
import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import ImageDropzoneHelperText from "./ImageDropzoneHelperText";
import colors from "../style/colors";

const acceptedImageTypes = {
  "image/jpeg": [".jpeg", ".jpg"],
  "image/png": [".png"],
};
const MAX_IMAGE_SIZE = 1024 * 1024 * 5; // 5MB

const getErrorMessage = (code) => {
  switch (code) {
    case "file-invalid-type":
      return "Image file format must be .png or .jpeg";
    case "too-many-files":
      return "Please drop a single image file";
    case "file-too-large":
      return "Image file size must be maximum 5MB";
    case "invalid-url":
      return "The URL you entered does not point to a valid image";
    default:
      return "Unexpected error occurred!";
  }
};

const SearchByImageButtonAndModal = ({
  onImageSelected,
  searchImage,
  setImgQuerySrc,
  setImgName,
}) => {
  const [imageUrlFromInput, setImageUrlFromInput] = useState("");
  const [errorCode, setErrorCode] = useState();
  const [isHovering, setIsHovering] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const closeModal = () => {
    setErrorCode(undefined);
    setImageUrlFromInput("");
    setIsModalOpen(false);
  };

  const { getRootProps, getInputProps, isDragAccept } = useDropzone({
    accept: acceptedImageTypes,
    maxSize: MAX_IMAGE_SIZE,
    multiple: false,
    onDragEnter: () => {
      setErrorCode(undefined);
    },
    onDropAccepted: (files) => {
      onImageSelected(files[0]);
      closeModal();
    },
    onDropRejected: (fileRejections) => {
      const code = fileRejections[0]?.errors?.[0]?.code;
      if (code) setErrorCode(code);
    },
  });

  const handleImageUrl = () => {
    try {
      const trimmedUrl = imageUrlFromInput.trim();
      const url = new URL(trimmedUrl);
      const isImage =
        /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(trimmedUrl) ||
        /f=image|f=auto/.test(trimmedUrl);
      if (!isImage) {
        setErrorCode("invalid-url"); // Set error code for invalid URL
        return;
      }
      onImageSelected(trimmedUrl);
      closeModal();
    } catch (e) {
      setErrorCode("invalid-url"); // Set error code for invalid URL
    }
  };

  return (
    <>
      <Button
        className={clsx(
          "flex items-center",
          "text-moss_green-800",
          "min-w-[fit-content]",
          "hover:bg-moss_green-100",
          "!px-1",
          "gap-2"
        )}
        type="button"
        appearance="subtle"
        size="sm"
        onClick={() => setIsModalOpen(true)}
      >
        <img src="/search-by-image.svg" alt="Search by image" />
        <span>Search by image</span>
      </Button>
      <Dialog fullWidth open={isModalOpen} onClose={closeModal} maxWidth="xs">
        <DialogTitle className="relative text-grey-1000 text-subtitle2-bold font-aeonik">
          Upload image
          <IconButton className="absolute right-3 top-3" onClick={closeModal}>
            <CloseIcon className="text-grey-500" />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {errorCode && (
            <Alert
              className="!mb-3 bg-red-50"
              icon={
                <Image
                  src="/error.svg"
                  alt="Error"
                  width={24}
                  height={24}
                  className={clsx("h-6 w-6", "-mr-1")}
                />
              }
              variant="outlined"
              severity="error"
            >
              <span className="text-body2 text-grey-900">
                {getErrorMessage(errorCode)}
              </span>
            </Alert>
          )}
          <div
            className={clsx(
              "overflow-auto",
              "flex items-stretch",
              "h-[316px]",
              "cursor-pointer"
            )}
            style={{
              backgroundImage: `url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' stroke='%23d3d3d3' stroke-width='4' stroke-dasharray='4%2c 12' stroke-dashoffset='0' stroke-linecap='square'/%3e%3c/svg%3e")`,
            }}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            {...getRootProps()}
          >
            <input {...getInputProps()} />
            <div
              className={clsx(
                "flex flex-col items-center justify-center",
                "h-full w-full"
              )}
            >
              <img
                src="/upload-image.svg"
                alt="Upload"
                className={clsx("h-10 w-10", "mb-2", "text-grey-500", {
                  "!text-green-700": isDragAccept,
                })}
              />
              <ImageDropzoneHelperText isDragAccept={isDragAccept} />
              <span className="mt-2 text-right text-subtitle3 text-grey-700">
                Supported formats
                <span className="ml-2 text-body2">.png .jpeg</span>
              </span>
              <span className="text-right text-subtitle3 text-grey-700">
                File size<span className="ml-2 text-body2">&#8804;5MB</span>
              </span>
              <span className="text-right text-subtitle3 text-grey-700">
                Dimension
                <span className="ml-2 text-body2">&#8805;378x378px</span>
              </span>
            </div>
          </div>
          <div className="my-3 flex items-center">
            <span
              className={clsx("border border-dashed border-grey-300", "flex-1")}
            />
            <span className="px-2 text-body2 text-grey-600">Or</span>
            <span
              className={clsx("border border-dashed border-grey-300", "flex-1")}
            />
          </div>
          <div className="flex w-full">
            <Input
              className="h-10 border-r-0"
              fullWidth // Ensure fullWidth is set here
              placeholder="Drop an image link"
              icon={<InsertLink className="text-grey-600" fontSize="small" />}
              value={imageUrlFromInput}
              onSelect={(e) => {
                e.stopPropagation();
              }}
              onChange={(e) => {
                setImageUrlFromInput(e.target.value);
              }}
              onClear={() => setImageUrlFromInput("")}
              type="text"
            />
            <Button
              type="button"
              appearance="primary"
              onClick={handleImageUrl}
              disabled={!imageUrlFromInput}
            >
              Search
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SearchByImageButtonAndModal;
