"use client";
import React, { useEffect, useState } from "react";

const SearchResults = ({ imgQuerySrc, uploadedImg }) => {
  console.log("🚀 > SearchResults > imgQuerySrc=", imgQuerySrc);
  console.log("🚀 > SearchResults > uploadedImg=", uploadedImg);
  const [data, setData] = useState(null);
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
        console.log("🚀 > fetchData > response=", response);
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
        {data?.results?.map((result, index) => (
          <li key={index}>{result.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default SearchResults;
