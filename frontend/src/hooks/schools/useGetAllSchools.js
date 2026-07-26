import { useQuery } from "@tanstack/react-query";
import React from "react";
import { QUERY_KEYS } from "../queryKeys";
import apiClient from "../../api/apiClient";
import apiConstant from "../../api/apiConstant";

const useGetAllSchools = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.SCHOOL.ALL_SCHOOLS],
    queryFn: async ({ signal }) => {
      const res = await apiClient.get(apiConstant.allSchools, { signal });
      return res.data;
    },
    keepPreviousData: true,
  });
};

export default useGetAllSchools;
