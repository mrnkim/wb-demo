import React from "react";

function PageNav({ page, setPage, videosData }) {
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
    if (pg !== "...") {
      setPage(pg);
    }
  };

  const nextPage = () => {
    if (page < totalPages) setPage(page + 1);
  };

  const previousPage = () => {
    if (page > 1) setPage(page - 1);
  };

  return (
    <nav className="pageNav">
      {page === 1 ? (
        <button disabled className="disabled-button">
          <img src={"/ChevronLeftDisabled.svg"} alt="prev Icon disabled" />
        </button>
      ) : (
        <button onClick={previousPage}>
          <img src={"/ChevronLeft.svg"} alt="prev Icon" />
        </button>
      )}
      {pagesArray.map((pg) => (
        <button
          key={pg}
          className={page === pg ? "active" : ""}
          onClick={() => handlePageClick(pg)}
        >
          {pg}
        </button>
      ))}
      {page === totalPages ? (
        <button disabled className="disabled-button">
          <img src={"/ChevronRightDisabled.svg"} alt="next Icon disabled" />
        </button>
      ) : (
        <button onClick={nextPage}>
          <img src={"/ChevronRight.svg"} alt="next Icon" />
        </button>
      )}
    </nav>
  );
}

export default PageNav;
