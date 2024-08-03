import React from "react";
import clsx from "clsx";

function PageNav({ page, setPage, videosData, setVideoLoading }) {
  const totalPages = videosData?.page_info?.total_page || 1;
  const maxPagesToShow = 5; // Adjust this to control how many pages to show
  const pageRange = Math.floor(maxPagesToShow / 2);

  const getPagesArray = () => {
    let pages = [];

    // Calculate start and end page based on current page
    let startPage = Math.max(1, page - pageRange);
    let endPage = Math.min(totalPages, page + pageRange);

    if (totalPages <= maxPagesToShow) {
      // If total pages are less than or equal to max pages to show, display all pages
      pages = Array.from({ length: totalPages }, (_, index) => index + 1);
    } else {
      // Add the first page and ellipsis if needed
      if (startPage > 2) {
        pages.push(1, "...");
      } else {
        startPage = 1;
      }

      // Add pages from startPage to endPage
      pages.push(
        ...Array.from(
          { length: endPage - startPage + 1 },
          (_, index) => startPage + index
        )
      );

      // Add ellipsis and the last page if needed
      if (endPage < totalPages - 1) {
        pages.push("...", totalPages);
      } else {
        endPage = totalPages;
      }
    }

    return pages;
  };

  const pagesArray = getPagesArray();

  const handlePageClick = (pg) => {
    setVideoLoading(true);
    if (pg !== "...") {
      setPage(pg);
    }
  };

  const nextPage = () => {
    setVideoLoading(true);
    if (page < totalPages) setPage(page + 1);
  };

  const previousPage = () => {
    setVideoLoading(true);
    if (page > 1) setPage(page - 1);
  };

  return (
    <nav
      className={clsx(
        "pageNav",
        "flex",
        "items-center",
        "px-1.5",
        "gap-x-[1.5rem]"
      )}
    >
      {page === 1 ? (
        <button
          disabled
          className="text-black bg-transparent outline-none flex-shrink-0 w-[1.5rem] h-[1.5rem] rounded-full transition-colors duration-300 m-[0.38rem] border-none"
        >
          <img src={"/ChevronLeftDisabled.svg"} alt="prev Icon disabled" />
        </button>
      ) : (
        <button
          onClick={previousPage}
          className="text-black bg-transparent outline-none flex-shrink-0 w-[1.5rem] h-[1.5rem] rounded-full transition-colors duration-300 m-[0.38rem] border-none hover:border hover:border-[#D4D5D2]"
        >
          <img src={"/ChevronLeft.svg"} alt="prev Icon" />
        </button>
      )}
      {pagesArray.map((pg) => (
        <button
          key={pg}
          className={clsx(
            "text-xs text-black bg-transparent outline-none flex-shrink-0 w-[1.5rem] h-[1.5rem] rounded-full transition-colors duration-300 m-[0.38rem] border-none",
            pg === page && "bg-[#D4D5D2] font-medium"
          )}
          disabled={pg === "..."}
          onClick={() => handlePageClick(pg)}
        >
          {pg}
        </button>
      ))}
      {page === totalPages ? (
        <button
          disabled
          className="text-black bg-transparent outline-none flex-shrink-0 w-[1.5rem] h-[1.5rem] rounded-full transition-colors duration-300 m-[0.38rem] border-none"
        >
          <img src={"/ChevronRightDisabled.svg"} alt="next Icon disabled" />
        </button>
      ) : (
        <button
          onClick={nextPage}
          className="text-black bg-transparent outline-none flex-shrink-0 w-[1.5rem] h-[1.5rem] rounded-full transition-colors duration-300 m-[0.38rem] border-none hover:border hover:border-[#D4D5D2]"
        >
          <img src={"/ChevronRight.svg"} alt="next Icon" />
        </button>
      )}
    </nav>
  );
}

export default PageNav;
