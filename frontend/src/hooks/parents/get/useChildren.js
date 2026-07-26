import { useQuery } from "@tanstack/react-query";
import React from "react";
import { QUERY_KEYS } from "../../queryKeys";
import apiClient from "../../../api/apiClient";
import apiConstant from "../../../api/apiConstant";

export const useChildren = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.PARENT.CHILDREN],
    queryFn: async ({ signal }) => {
      const res = await apiClient.get(apiConstant.children, { signal });
      return res.data;
    },
    keepPreviousData: true,
  });
};
