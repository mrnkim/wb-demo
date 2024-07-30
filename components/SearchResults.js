import React from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useInfiniteQuery } from "@tanstack/react-query";

const SearchResults = ({
  data,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
  status,
}) => {
  console.log("🚀 > data=", data);

  if (status === "loading") return <div>Loading...</div>;
  if (status === "error") return <div>Error loading results.</div>;

  // Flatten the results from all pages into a single array
  const results = data?.pages[0].searchData;
  console.log("🚀 > results=", results);

  return (
    <InfiniteScroll
      dataLength={results?.length || 0} // Required prop
      next={fetchNextPage} // Function to fetch more data
      hasMore={hasNextPage} // Boolean to check if there's more data
      loader={<h4>Loading...</h4>}
      endMessage={<p>No more results</p>}
    >
      {results?.map((result) => (
        <div key={result.thumbnailUrl}>{result.start}</div>
      ))}
    </InfiniteScroll>
  );
};

export default SearchResults;
