import { useQuery } from "@tanstack/react-query";
import React from "react";
import { QUERY_KEYS } from "../../queryKeys";
import apiClient from "../../../api/apiClient";
import apiConstant from "../../../api/apiConstant";

const useFeedbackHistory = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.PARENT.FEEDBACK_HISTORY],
    queryFn: async ({ signal }) => {
      const res = await apiClient.get(apiConstant.feedbackHistory, { signal });
      return res.data;
    },
    keepPreviousData: true,
  });
};

export default useFeedbackHistory;
