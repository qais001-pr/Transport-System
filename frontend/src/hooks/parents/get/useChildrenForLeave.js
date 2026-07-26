import { useQuery } from "@tanstack/react-query";
import React from "react";
import { QUERY_KEYS } from "../../queryKeys";
import apiClient from "../../../api/apiClient";
import apiConstant from "../../../api/apiConstant";

export const useChildrenForLeave = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.PARENT.CHILDREN_FOR_LEAVE],
    queryFn: async ({ signal }) => {
      const res = await apiClient.get(apiConstant.childrenForLeave, { signal });
      return res.data;
    },
    keepPreviousData: true,
  });
};
