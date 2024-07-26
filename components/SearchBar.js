import React from "react";

const SearchBar = () => {
  return (
    <div className="w-full max-w-4xl h-14 py-3 bg-white border-b-2 border-[#e5e6e4] justify-between items-center inline-flex">
      <div className="grow shrink basis-0 h-14 justify-start items-center flex">
        <div className="w-8 h-14 justify-start items-center gap-1 flex">
          <div className="w-6 h-6 relative">
            <img
              className="w-[20.66px] h-[18px] left-[1.34px] top-[2px] absolute"
              src="/SearchVideoLeft.svg"
            />
          </div>
        </div>
        <div className="text-[#c5c7c3] text-2xl font-medium leading-loose">
          What are you looking for?
        </div>
      </div>
      <div className="justify-end items-center gap-2 flex">
        <div className="w-px h-6 bg-[#d9d9d9]" />
        <div className="px-3 py-2 rounded justify-center items-center flex">
          <div className="justify-start items-center gap-1 flex">
            <div className="w-5 h-5 relative">
              <button className="flex items-center icon-text-button">
                <img
                  className="w-5 h-5 mr-2"
                  src="/ImageSearch.svg"
                  alt="Search Icon"
                />
                <span
                  className="text-[#006f33]
text-sm
font-medium
leading-tight"
                >
                  Search by image
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
