import axios from "axios";

export const fetchSearchResults = async ({
  query,
  imagePath,
  pageParam = 1,
}) => {
  const response = await axios.get(`/api/search`, {
    params: {
      query: imagePath,
      page: pageParam,
    },
  });
  return response.data;
};
