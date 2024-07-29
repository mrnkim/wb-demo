"use client";
import React, { useEffect, useState } from "react";

const SearchResults = ({ imgQuerySrc, uploadedImg }) => {
  const [data, setData] = useState(null);
  console.log("🚀 > SearchResults > data=", data);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!uploadedImg) return;

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `/api/search?query=${encodeURIComponent(uploadedImg)}`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const result = await response.json();
        setData(result);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [imgQuerySrc]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <p>Showing results for: {uploadedImg}</p>
      <ul>
        {data?.searchData?.map((clip, index) => (
          <li key={index}>{clip.score}</li>
        ))}
      </ul>
    </div>
  );
};

export default SearchResults;
