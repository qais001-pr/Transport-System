import { useQuery } from "@tanstack/react-query";
import React from "react";
import { QUERY_KEYS } from "../../queryKeys";
import apiClient from "../../../api/apiClient";
import apiConstant from "../../../api/apiConstant";

export const useLeaveHistory = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.PARENT.LEAVE_HISTORY],
    queryFn: async ({ signal }) => {
      const res = await apiClient.get(apiConstant.leaveHistory, { signal });
      return res.data;
    },
    keepPreviousData: true,
  });
};
