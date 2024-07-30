import CloseIcon from "@mui/icons-material/Close";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Popper,
  Skeleton,
  dialogClasses,
} from "@mui/material";
import clsx from "clsx";
import React, { useState, useRef, useEffect } from "react";
import styles from "./styles.module.css";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

const SelectedImageDisplay = ({
  imgQuerySrc,
  setImgQuerySrc,
  imgName,
  setImgName,
  unselectImage,
  setUploadedImg,
  searchResultData,
  setSearchResultData,
  updatedSearchData,
  setUpdatedSearchData,
  searchImage,
}) => {
  const [crop, setCrop] = useState({});
  const [completedCrop, setCompletedCrop] = useState(null);
  const [imageSrc, setImageSrc] = useState(null);
  // const [error, setError] = useState(null);
  // const [isLoading, setIsLoading] = useState(false);

  const imgRef = useRef(null);

const [isModalOpen, setIsModalOpen] = useState(false);
  const openDisplayModal = () => setIsModalOpen(true);
  const closeDisplayModal = () => setIsModalOpen(false);

  const [anchorEl, setAnchorEl] = useState(null);
  const [arrowEl, setArrowEl] = useState(null);
  const openPopover = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const closePopover = () => setAnchorEl(null);

  useEffect(() => {
    if (imgQuerySrc instanceof File) {
      const objectUrl = URL.createObjectURL(imgQuerySrc);
      setImageSrc(objectUrl);

      return () => {
        URL.revokeObjectURL(objectUrl);
      };
    } else {
      setImageSrc(imgQuerySrc);
    }
  }, [imgQuerySrc]);

  if (!imageSrc) {
    return <Skeleton variant="text" width={240} height={36} />;
  }

  const onCloseIconClick = (e) => {
    e.stopPropagation();
    unselectImage();
  };

  const isPopperOpen = Boolean(anchorEl);

  const getCroppedImage = (image, crop) => {
    return new Promise((resolve, reject) => {
      if (!crop || !image) {
        reject(new Error("Invalid crop or image"));
        return;
      }

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Canvas context is not available"));
        return;
      }

      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;
      const pixelRatio = window.devicePixelRatio || 1;

      const cropWidth = Math.max(crop.width, 378);
      const cropHeight = Math.max(crop.height, 378);

      canvas.width = cropWidth * pixelRatio;
      canvas.height = cropHeight * pixelRatio;

      ctx.scale(pixelRatio, pixelRatio);
      ctx.imageSmoothingQuality = "high";

      const offsetX = (cropWidth - crop.width) / 2;
      const offsetY = (cropHeight - crop.height) / 2;

      ctx.drawImage(
        image,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        offsetX,
        offsetY,
        crop.width,
        crop.height
      );

      try {
        const dataUrl = canvas.toDataURL("image/jpeg");
        resolve(dataUrl);
      } catch (error) {
        reject(new Error("Failed to convert canvas to data URL"));
      }
    });
  };

  const dataURLToBlob = (dataURL) => {
    const [header, base64Data] = dataURL.split(",");
    const mimeString = header.split(":")[1].split(";")[0];
    const binaryString = window.atob(base64Data);
    const arrayBuffer = new ArrayBuffer(binaryString.length);
    const uint8Array = new Uint8Array(arrayBuffer);

    for (let i = 0; i < binaryString.length; i++) {
      uint8Array[i] = binaryString.charCodeAt(i);
    }

    return new Blob([uint8Array], { type: mimeString });
  };

  const uploadImage = async (src) => {
    const blob = dataURLToBlob(src);
    const formData = new FormData();
    formData.append("file", blob, `${imgName}_cropped`);

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Failed to upload image");
    }

    const { url } = await response.json();
    const urlParts = url.split("/");
    const filename = urlParts[urlParts.length - 1];

    setImgQuerySrc(src);
    setUploadedImg(url);
    setImgName(filename);
  };

  const onCropSearchClick = async () => {
    if (completedCrop && imgRef.current) {
      try {
        const croppedImage = await getCroppedImage(
          imgRef.current,
          completedCrop
        );
        const uploadResponse = await uploadImage(croppedImage);
        await searchImage(uploadResponse);
        closeDisplayModal();
      } catch (error) {
        console.error("Error processing image:", error);
      }
    } else {
      console.warn("No completed crop or imgRef.current is null");
    }
  };

  // if (isLoading) return <div>Loading...</div>;
  // if (error) return <div>Error: {error}</div>;

  return (
    <>
      <div
        aria-describedby="image-display-popper"
        className={clsx(
          "flex items-center",
          "min-w-0 bg-grey-50",
          "rounded border border-grey-200 hover:border-green-500",
          "mr-2"
        )}
        role="button"
        tabIndex={0}
        onClick={openDisplayModal}
      >
        <img
          className={clsx(
            "object-contain",
            "border-r-[1px] border-grey-200",
            "flex-shrink-0"
          )}
          src={imageSrc}
          alt="user-uploaded"
        />
        <span
          className={clsx(
            "mx-[9px]",
            "text-subtitle2 text-grey-700",
            "whitespace-nowrap"
          )}
        >
          {imgName}
        </span>
        <IconButton size="small" onClick={onCloseIconClick}>
          <CloseIcon className="text-grey-500" fontSize="small" />
        </IconButton>
      </div>
      <Popper
        id="image-display-popper"
        className="z-navbar border border-grey-200"
        placement="right"
        open={isPopperOpen}
        anchorEl={anchorEl}
        modifiers={[
          {
            name: "offset",
            options: {
              offset: [0, 16],
            },
          },
          {
            name: "arrow",
            enabled: true,
            options: {
              element: arrowEl,
            },
          },
        ]}
      >
        <span className={styles["popper-arrow"]} ref={setArrowEl} />
        <div className={clsx("h-[300px] p-2", "bg-white", "border-grey-200")}>
          <img
            className="h-full rounded bg-grey-50 object-contain"
            src={imageSrc}
            alt="expanded-user-uploaded"
          />
        </div>
      </Popper>
      <Dialog
        sx={{
          [`& .${dialogClasses.paper}`]: {
            width: "80vw",
            height: "80vh",
            maxWidth: "none",
            maxHeight: "none",
          },
        }}
        open={isModalOpen}
        onClose={closeDisplayModal}
      >
        <DialogTitle className="w-[calc(100%-30px)] truncate tablet:pb-3">
          {imgName}
          <IconButton
            className="absolute right-3 top-3"
            onClick={closeDisplayModal}
          >
            <CloseIcon className="text-grey-500" />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <div
            className={clsx(
              "border-grey-200 bg-grey-50",
              "flex justify-center",
              "overflow-hidden rounded"
            )}
          >
            <ReactCrop
              crop={crop}
              onChange={(_, percentCrop) => setCrop(percentCrop)}
              onComplete={(c) => setCompletedCrop(c)}
              minHeight={100}
            >
              <img
                ref={imgRef}
                className="h-full w-full bg-grey-50 object-contain"
                src={imageSrc}
                alt="expanded-user-uploaded"
              />
            </ReactCrop>
          </div>
          <div
            className={clsx("border-grey-200 bg-grey-50", "flex justify-end")}
          >
            <IconButton onClick={onCropSearchClick}>Search</IconButton>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SelectedImageDisplay;
