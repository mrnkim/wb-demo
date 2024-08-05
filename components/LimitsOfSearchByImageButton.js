import React, { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import InfoOutlined from "@mui/icons-material/InfoOutlined";
import { Dialog, DialogContent, DialogTitle, IconButton } from "@mui/material";
import Button from "./Button";
import clsx from "clsx";
// import img from "next/image";

const LimitsOfSearchByImageButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      <Button
        className="w-[fit-content]"
        appearance="subtle"
        size="xs"
        type="button"
        onClick={() => setIsModalOpen(true)}
      >
        <InfoOutlined color="inherit" fontSize="small" /> Limitations of Search
        by image
      </Button>
      <Dialog fullWidth open={isModalOpen} onClose={closeModal}>
        <DialogTitle>
          Limitations of Search by image
          <IconButton className="absolute right-3 top-3" onClick={closeModal}>
            <CloseIcon className="text-grey-500" />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <ol className="mb-2 ml-[18px]">
            <li value="1" className="list-decimal text-body1 text-grey-800">
              Only supports semantic search, not exact search like face
              detection. It focuses on the contextual similarity than specific
              details to the image.
            </li>
          </ol>
          <div
            className={clsx(
              "flex flex-col items-center",
              "rounded bg-grey-100 p-3",
              "text-body2 text-grey-800"
            )}
          >
            <div className={clsx("mb-2", "block gap-x-[10px] tablet:flex")}>
              <img
                className={clsx(
                  "rounded",
                  "h-[56px] w-[86px] tablet:h-[68px] tablet:w-[96px]",
                  "mx-auto tablet:mx-0"
                )}
                src="/images/beach_to_search.png"
                placeholder="blur"
                alt="beach_to_search"
              />
              <img
                className={clsx("w-8", "hidden tablet:block")}
                src="/images/search_arrow.svg"
                alt="search_arrow"
              />
              <img
                className={clsx("mx-auto my-1 w-3", "block tablet:hidden")}
                src="/images/mobile_search_arrow.svg"
                alt="mobile_search_arrow"
              />
              <div className="flex gap-x-[10px]">
                <img
                  className={clsx(
                    "rounded",
                    "h-[56px] w-[86px] tablet:h-[68px] tablet:w-[96px]"
                  )}
                  src="/images/beach_search_result1.png"
                  placeholder="blur"
                  alt="beach_search_result1"
                />
                <img
                  className={clsx(
                    "rounded",
                    "h-[56px] w-[86px] tablet:h-[68px] tablet:w-[96px]"
                  )}
                  src="/images/beach_search_result2.png"
                  placeholder="blur"
                  alt="beach_search_result2"
                />
                <img
                  className={clsx(
                    "rounded",
                    "h-[56px] w-[86px] tablet:h-[68px] tablet:w-[96px]"
                  )}
                  src="/images/beach_search_result3.png"
                  placeholder="blur"
                  alt="beach_search_result3"
                />
              </div>
            </div>
            <div className="text-center tablet:text-left">
              ex. Search results return different beaches, not the exact one in
              the image
            </div>
          </div>
          <ol className="mb-2 ml-[18px] mt-6">
            <li value="2" className="list-decimal text-body1 text-grey-800">
              Small objects in videos may not be detected. Optimal search
              results are achieved when objects occupy at least 50% of the video
              frame.
            </li>
          </ol>
          <div
            className={clsx(
              "tablet:flex tablet:justify-center tablet:gap-x-10",
              "grid grid-cols-1 place-items-center gap-y-5",
              "rounded bg-grey-100 p-3",
              "text-body2 text-grey-800"
            )}
          >
            <div className="flex gap-x-2">
              <img
                className={clsx(
                  "rounded",
                  "h-[68px] w-[96px] tablet:h-[80px] tablet:w-[112px]"
                )}
                src="/images/bad_object_example1.png"
                placeholder="blur"
                alt="bad_object_example1"
              />
              <img
                className={clsx(
                  "rounded",
                  "h-[68px] w-[96px] tablet:h-[80px] tablet:w-[112px]"
                )}
                src="/images/good_object_example1.png"
                placeholder="blur"
                alt="good_object_example1"
              />
            </div>
            <div className="flex gap-x-2">
              <img
                className={clsx(
                  "rounded",
                  "h-[68px] w-[96px] tablet:h-[80px] tablet:w-[112px]"
                )}
                src="/images/bad_object_example2.png"
                placeholder="blur"
                alt="bad_object_example2"
              />
              <img
                className={clsx(
                  "rounded",
                  "h-[68px] w-[96px] tablet:h-[80px] tablet:w-[112px]"
                )}
                src="/images/good_object_example2.png"
                placeholder="blur"
                alt="good_object_example2"
              />
            </div>
          </div>
          <ol className="mb-2 ml-[18px] mt-6">
            <li value="3" className="list-decimal text-body1 text-grey-800">
              To detect conversation and text-in-video from videos, the image
              query must contain visible text.
            </li>
          </ol>
          <div
            className={clsx(
              "flex justify-center gap-x-10",
              "rounded bg-grey-100 p-3",
              "text-body2 text-grey-800"
            )}
          >
            <div className="flex gap-x-2">
              <img
                className={clsx(
                  "h-[68px] w-[96px] tablet:h-[80px] tablet:w-[112px]",
                  "rounded"
                )}
                src="/images/good_text_example1.png"
                placeholder="blur"
                alt="good_text_example1"
              />
              <img
                className={clsx(
                  "h-[68px] w-[96px] tablet:h-[80px] tablet:w-[112px]",
                  "rounded"
                )}
                src="/images/good_text_example2.png"
                placeholder="blur"
                alt="good_text_example2"
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default LimitsOfSearchByImageButton;
