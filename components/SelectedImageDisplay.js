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
import React, { useState, useRef } from "react";
import styles from "./styles.module.css";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

const SelectedImageDisplay = ({ imageBlobUrl, imageName, unselectImage }) => {
  const [crop, setCrop] = useState({});
  const [completedCrop, setCompletedCrop] = useState(null);
  const [imageSrc, setImageSrc] = useState(imageBlobUrl);
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

      canvas.width = crop.width * pixelRatio;
      canvas.height = crop.height * pixelRatio;

      ctx.scale(pixelRatio, pixelRatio);
      ctx.imageSmoothingQuality = "high";

      ctx.drawImage(
        image,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        crop.width,
        crop.height
      );

      // Convert the canvas to a data URL and resolve the promise
      try {
        const dataUrl = canvas.toDataURL("image/jpeg");
        resolve(dataUrl);
      } catch (error) {
        reject(new Error("Failed to convert canvas to data URL"));
      }
    });
  };

  const onCropSearchClick = async () => {
    console.log("Search button clicked");

    if (completedCrop && imgRef.current) {
      try {
        console.log("Cropping image...");
        const croppedImage = await getCroppedImage(
          imgRef.current,
          completedCrop
        );
        setImageSrc(croppedImage);
        console.log("Cropped image:", croppedImage);
      } catch (error) {
        console.error("Error cropping image:", error);
      }
    } else {
      console.warn("No completed crop or imgRef.current is null");
    }
  };

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
          {imageName}
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
          {imageName}
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
