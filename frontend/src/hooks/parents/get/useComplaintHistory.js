import { useQuery } from "@tanstack/react-query";
import React from "react";
import { QUERY_KEYS } from "../../queryKeys";
import apiClient from "../../../api/apiClient";
import apiConstant from "../../../api/apiConstant";

const useComplaintHistory = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.PARENT.COMPLAINT_HISTORY],
    queryFn: async ({ signal }) => {
      const res = await apiClient.get(apiConstant.complaintHistory, { signal });
      return res.data;
    },
    keepPreviousData: true,
  });
};

export default useComplaintHistory;
